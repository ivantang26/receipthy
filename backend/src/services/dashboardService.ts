import { PrismaClient, TransactionStatus, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDashboardSummary(
  fromDate: Date,
  toDate: Date,
  groupBy: 'daily' | 'monthly' | 'yearly'
) {
  // Get all transactions in the date range
  const transactions = await prisma.transaction.findMany({
    where: {
      dateTime: {
        gte: fromDate,
        lte: toDate,
      },
    },
    include: {
      items: true,
    },
    orderBy: {
      dateTime: 'asc',
    },
  });

  // Calculate KPIs
  const completedTransactions = transactions.filter(
    (t) => t.status === TransactionStatus.COMPLETED
  );
  const refundedTransactions = transactions.filter(
    (t) => t.status === TransactionStatus.REFUNDED
  );

  const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.grossAmount, 0);
  const refundedAmount = refundedTransactions.reduce((sum, t) => sum + t.grossAmount, 0);
  const numberOfTransactions = completedTransactions.length;
  const averageOrderValue =
    numberOfTransactions > 0 ? totalRevenue / numberOfTransactions : 0;

  // Calculate top payment method
  const paymentMethodCounts: Record<string, number> = {};
  completedTransactions.forEach((t) => {
    paymentMethodCounts[t.paymentMethod] = (paymentMethodCounts[t.paymentMethod] || 0) + 1;
  });
  const topPaymentMethod = Object.entries(paymentMethodCounts).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0] || 'N/A';

  // Group data for charts
  const revenueOverTime = groupTransactionsByPeriod(completedTransactions, groupBy);
  const revenueByPaymentMethod = groupTransactionsByPaymentMethod(completedTransactions);

  return {
    kpis: {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      numberOfTransactions,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      numberOfRefunds: refundedTransactions.length,
      refundedAmount: parseFloat(refundedAmount.toFixed(2)),
      topPaymentMethod,
    },
    charts: {
      revenueOverTime,
      revenueByPaymentMethod,
    },
  };
}

function groupTransactionsByPeriod(
  transactions: any[],
  groupBy: 'daily' | 'monthly' | 'yearly'
) {
  const grouped: Record<string, number> = {};

  transactions.forEach((t) => {
    const date = new Date(t.dateTime);
    let key: string;

    if (groupBy === 'daily') {
      key = date.toISOString().split('T')[0]; // YYYY-MM-DD
    } else if (groupBy === 'monthly') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    } else {
      key = String(date.getFullYear()); // YYYY
    }

    grouped[key] = (grouped[key] || 0) + t.grossAmount;
  });

  return Object.entries(grouped)
    .map(([period, revenue]) => ({
      period,
      revenue: parseFloat(revenue.toFixed(2)),
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

function groupTransactionsByPaymentMethod(transactions: any[]) {
  const grouped: Record<string, number> = {};

  transactions.forEach((t) => {
    grouped[t.paymentMethod] = (grouped[t.paymentMethod] || 0) + t.grossAmount;
  });

  return Object.entries(grouped).map(([method, revenue]) => ({
    method,
    revenue: parseFloat(revenue.toFixed(2)),
  }));
}

