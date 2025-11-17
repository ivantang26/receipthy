import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTransactions(
  page: number,
  limit: number,
  filters: {
    from?: Date;
    to?: Date;
    search?: string;
    status?: string;
    paymentMethod?: string;
  }
) {
  const where: any = {};

  if (filters.from || filters.to) {
    where.dateTime = {};
    if (filters.from) where.dateTime.gte = filters.from;
    if (filters.to) where.dateTime.lte = filters.to;
  }

  if (filters.search) {
    where.OR = [
      { receiptNumber: { contains: filters.search } },
      { grossAmount: { gte: parseFloat(filters.search) || 0 } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.paymentMethod) {
    where.paymentMethod = filters.paymentMethod;
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        dateTime: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    data: transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function exportTransactions(filters: {
  from?: Date;
  to?: Date;
  search?: string;
  status?: string;
  paymentMethod?: string;
}) {
  const where: any = {};

  if (filters.from || filters.to) {
    where.dateTime = {};
    if (filters.from) where.dateTime.gte = filters.from;
    if (filters.to) where.dateTime.lte = filters.to;
  }

  if (filters.search) {
    where.OR = [
      { receiptNumber: { contains: filters.search } },
      { grossAmount: { gte: parseFloat(filters.search) || 0 } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.paymentMethod) {
    where.paymentMethod = filters.paymentMethod;
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: {
      dateTime: 'desc',
    },
  });

  // Generate CSV
  const headers = ['Date/Time', 'Receipt Number', 'Gross Amount', 'Net Amount', 'Tax Amount', 'Payment Method', 'Status'];
  const rows = transactions.map((t) => [
    new Date(t.dateTime).toISOString(),
    t.receiptNumber,
    t.grossAmount.toFixed(2),
    t.netAmount.toFixed(2),
    t.taxAmount.toFixed(2),
    t.paymentMethod,
    t.status,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csv;
}

