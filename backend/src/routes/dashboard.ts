import { Router } from 'express';
import { getDashboardSummary } from '../services/dashboardService';

const router = Router();

router.get('/summary', async (req, res, next) => {
  try {
    const { from, to, groupBy = 'daily' } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'from and to date parameters are required' });
    }

    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const groupByValue = groupBy as 'daily' | 'monthly' | 'yearly';
    if (!['daily', 'monthly', 'yearly'].includes(groupByValue)) {
      return res.status(400).json({ error: 'groupBy must be daily, monthly, or yearly' });
    }

    const summary = await getDashboardSummary(fromDate, toDate, groupByValue);
    res.json(summary);
  } catch (error) {
    next(error);
  }
});

export default router;

