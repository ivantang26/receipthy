import { PrismaClient, PaymentMethod, TransactionStatus, InvoiceStatus, ReceiptSource } from '@prisma/client';

const prisma = new PrismaClient();

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomPaymentMethod(): PaymentMethod {
  const methods = [PaymentMethod.CASH, PaymentMethod.CARD, PaymentMethod.E_WALLET, PaymentMethod.OTHER];
  return methods[Math.floor(Math.random() * methods.length)];
}

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.invoice.deleteMany();

  console.log('✅ Cleared existing data');

  // Seed Invoices
  const invoices = [];
  for (let i = 1; i <= 15; i++) {
    const issueDate = randomDate(new Date(2024, 0, 1), new Date());
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);
    
    const statuses = [InvoiceStatus.DRAFT, InvoiceStatus.SENT, InvoiceStatus.PAID, InvoiceStatus.OVERDUE];
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Mark as overdue if past due date and not paid
    if (new Date() > dueDate && status === InvoiceStatus.SENT) {
      status = InvoiceStatus.OVERDUE;
    }

    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const quantity = Math.floor(Math.random() * 5) + 1;
      const unitPrice = parseFloat((Math.random() * 200 + 50).toFixed(2));
      const lineTotal = parseFloat((quantity * unitPrice).toFixed(2));
      subtotal += lineTotal;

      items.push({
        description: `Service ${j + 1} - Professional consulting`,
        quantity,
        unitPrice,
        lineTotal,
      });
    }

    const tax = parseFloat((subtotal * 0.1).toFixed(2)); // 10% tax
    const total = parseFloat((subtotal + tax).toFixed(2));

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${String(i).padStart(4, '0')}`,
        issueDate,
        dueDate,
        status,
        customerName: `Customer ${i}`,
        customerEmail: `customer${i}@example.com`,
        customerAddress: `${i * 10} Main Street, City, State 12345`,
        subtotal,
        tax,
        total,
        notes: i % 3 === 0 ? 'Thank you for your business!' : null,
        items: {
          create: items,
        },
      },
    });

    invoices.push(invoice);
  }

  console.log(`✅ Created ${invoices.length} invoices`);

  // Seed Transactions (POS data)
  const transactions = [];
  const startDate = new Date(2024, 0, 1); // Jan 1, 2024
  const endDate = new Date();

  for (let i = 0; i < 200; i++) {
    const dateTime = randomDate(startDate, endDate);
    const status = Math.random() > 0.95 ? TransactionStatus.REFUNDED : TransactionStatus.COMPLETED;
    const paymentMethod = randomPaymentMethod();
    
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items = [];
    let netAmount = 0;

    for (let j = 0; j < itemCount; j++) {
      const quantity = Math.floor(Math.random() * 3) + 1;
      const unitPrice = parseFloat((Math.random() * 50 + 10).toFixed(2));
      const lineTotal = parseFloat((quantity * unitPrice).toFixed(2));
      netAmount += lineTotal;

      items.push({
        productName: `Product ${String.fromCharCode(65 + (i % 26))}${j + 1}`,
        quantity,
        unitPrice,
        lineTotal,
      });
    }

    const taxAmount = parseFloat((netAmount * 0.08).toFixed(2)); // 8% tax
    const grossAmount = parseFloat((netAmount + taxAmount).toFixed(2));

    const transaction = await prisma.transaction.create({
      data: {
        dateTime,
        grossAmount,
        netAmount,
        taxAmount,
        paymentMethod,
        status,
        receiptNumber: `R-${String(i + 1).padStart(6, '0')}`,
        items: {
          create: items,
        },
      },
    });

    transactions.push(transaction);
  }

  console.log(`✅ Created ${transactions.length} transactions`);

  // Seed Receipts
  const receipts = [];
  for (let i = 0; i < 30; i++) {
    const dateTime = randomDate(startDate, endDate);
    const source = i < 10 ? ReceiptSource.POS : i < 20 ? ReceiptSource.MANUAL : ReceiptSource.IMPORTED;
    const amount = parseFloat((Math.random() * 500 + 50).toFixed(2));
    const paymentMethod = randomPaymentMethod();
    
    // Link some receipts to invoices
    const relatedInvoiceId = i < 10 && invoices[i] ? invoices[i].id : null;

    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber: `RCP-${String(i + 1).padStart(5, '0')}`,
        dateTime,
        amount,
        paymentMethod,
        source,
        relatedInvoiceId,
        notes: i % 5 === 0 ? 'Payment received via bank transfer' : null,
      },
    });

    receipts.push(receipt);
  }

  console.log(`✅ Created ${receipts.length} receipts`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

