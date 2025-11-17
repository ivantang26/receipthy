import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getReceipts(
  page: number,
  limit: number,
  filters: {
    from?: Date;
    to?: Date;
    source?: string;
    search?: string;
  }
) {
  const where: any = {};

  if (filters.from || filters.to) {
    where.dateTime = {};
    if (filters.from) where.dateTime.gte = filters.from;
    if (filters.to) where.dateTime.lte = filters.to;
  }

  if (filters.source) {
    where.source = filters.source;
  }

  if (filters.search) {
    where.OR = [
      { receiptNumber: { contains: filters.search } },
      { amount: { gte: parseFloat(filters.search) || 0 } },
    ];
  }

  const [receipts, total] = await Promise.all([
    prisma.receipt.findMany({
      where,
      include: {
        relatedInvoice: {
          select: {
            id: true,
            invoiceNumber: true,
            customerName: true,
          },
        },
      },
      orderBy: {
        dateTime: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.receipt.count({ where }),
  ]);

  return {
    data: receipts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getReceiptById(id: string) {
  return prisma.receipt.findUnique({
    where: { id },
    include: {
      relatedInvoice: {
        select: {
          id: true,
          invoiceNumber: true,
          customerName: true,
        },
      },
    },
  });
}

export async function createReceipt(data: any) {
  // Generate receipt number
  const lastReceipt = await prisma.receipt.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  let receiptNumber = 'RCP-00001';
  if (lastReceipt) {
    const lastNumber = parseInt(lastReceipt.receiptNumber.split('-')[1]);
    receiptNumber = `RCP-${String(lastNumber + 1).padStart(5, '0')}`;
  }

  return prisma.receipt.create({
    data: {
      receiptNumber,
      dateTime: new Date(data.dateTime),
      amount: parseFloat(data.amount),
      paymentMethod: data.paymentMethod,
      source: data.source,
      relatedInvoiceId: data.relatedInvoiceId || null,
      notes: data.notes || null,
    },
    include: {
      relatedInvoice: {
        select: {
          id: true,
          invoiceNumber: true,
          customerName: true,
        },
      },
    },
  });
}

export async function updateReceipt(id: string, data: any) {
  return prisma.receipt.update({
    where: { id },
    data: {
      dateTime: data.dateTime ? new Date(data.dateTime) : undefined,
      amount: data.amount ? parseFloat(data.amount) : undefined,
      paymentMethod: data.paymentMethod,
      source: data.source,
      relatedInvoiceId: data.relatedInvoiceId,
      notes: data.notes,
    },
    include: {
      relatedInvoice: {
        select: {
          id: true,
          invoiceNumber: true,
          customerName: true,
        },
      },
    },
  });
}

export async function deleteReceipt(id: string) {
  return prisma.receipt.delete({
    where: { id },
  });
}

