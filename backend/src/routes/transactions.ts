import { Router } from 'express';
import { getTransactions, exportTransactions } from '../services/transactionService';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const {
      from,
      to,
      page = '1',
      limit = '20',
      search = '',
      status,
      paymentMethod,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const filters: any = {};
    if (from) filters.from = new Date(from as string);
    if (to) filters.to = new Date(to as string);
    if (search) filters.search = search as string;
    if (status) filters.status = status as string;
    if (paymentMethod) filters.paymentMethod = paymentMethod as string;

    const result = await getTransactions(pageNum, limitNum, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/export', async (req, res, next) => {
  try {
    const { from, to, search = '', status, paymentMethod } = req.query;

    const filters: any = {};
    if (from) filters.from = new Date(from as string);
    if (to) filters.to = new Date(to as string);
    if (search) filters.search = search as string;
    if (status) filters.status = status as string;
    if (paymentMethod) filters.paymentMethod = paymentMethod as string;

    const csv = await exportTransactions(filters);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

export default router;

