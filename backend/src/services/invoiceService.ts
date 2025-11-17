import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getInvoices(
  page: number,
  limit: number,
  filters: {
    status?: string;
    search?: string;
  }
) {
  const where: any = {};

  if (filters.status && filters.status !== 'ALL') {
    where.status = filters.status;
  }

  if (filters.search) {
    where.OR = [
      { invoiceNumber: { contains: filters.search } },
      { customerName: { contains: filters.search } },
      { customerEmail: { contains: filters.search } },
    ];
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        issueDate: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    data: invoices,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      items: true,
      receipts: true,
    },
  });
}

export async function createInvoice(data: any) {
  // Generate invoice number
  const lastInvoice = await prisma.invoice.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  let invoiceNumber = 'INV-0001';
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
    invoiceNumber = `INV-${String(lastNumber + 1).padStart(4, '0')}`;
  }

  // Calculate totals
  const items = data.items || [];
  const subtotal = items.reduce((sum: number, item: any) => sum + item.lineTotal, 0);
  const tax = parseFloat((subtotal * (data.taxRate || 0.1)).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));

  return prisma.invoice.create({
    data: {
      invoiceNumber,
      issueDate: new Date(data.issueDate),
      dueDate: new Date(data.dueDate),
      status: data.status || 'DRAFT',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerAddress: data.customerAddress || null,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax,
      total,
      notes: data.notes || null,
      items: {
        create: items.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice),
          lineTotal: parseFloat(item.lineTotal),
        })),
      },
    },
    include: {
      items: true,
    },
  });
}

export async function updateInvoice(id: string, data: any) {
  // Delete existing items and recreate them
  await prisma.invoiceItem.deleteMany({
    where: { invoiceId: id },
  });

  // Calculate totals
  const items = data.items || [];
  const subtotal = items.reduce((sum: number, item: any) => sum + item.lineTotal, 0);
  const tax = parseFloat((subtotal * (data.taxRate || 0.1)).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));

  return prisma.invoice.update({
    where: { id },
    data: {
      issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      status: data.status,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerAddress: data.customerAddress,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax,
      total,
      notes: data.notes,
      items: {
        create: items.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice),
          lineTotal: parseFloat(item.lineTotal),
        })),
      },
    },
    include: {
      items: true,
    },
  });
}

export async function deleteInvoice(id: string) {
  return prisma.invoice.delete({
    where: { id },
  });
}

export async function duplicateInvoice(id: string) {
  const original = await prisma.invoice.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!original) {
    throw new Error('Invoice not found');
  }

  // Generate new invoice number
  const lastInvoice = await prisma.invoice.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  let invoiceNumber = 'INV-0001';
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
    invoiceNumber = `INV-${String(lastNumber + 1).padStart(4, '0')}`;
  }

  return prisma.invoice.create({
    data: {
      invoiceNumber,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'DRAFT',
      customerName: original.customerName,
      customerEmail: original.customerEmail,
      customerAddress: original.customerAddress,
      subtotal: original.subtotal,
      tax: original.tax,
      total: original.total,
      notes: original.notes,
      items: {
        create: original.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        })),
      },
    },
    include: {
      items: true,
    },
  });
}

