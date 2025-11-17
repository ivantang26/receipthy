import { Router } from 'express';
import {
  getReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  deleteReceipt,
} from '../services/receiptService';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const {
      from,
      to,
      source,
      search = '',
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const filters: any = {};
    if (from) filters.from = new Date(from as string);
    if (to) filters.to = new Date(to as string);
    if (source) filters.source = source as string;
    if (search) filters.search = search as string;

    const result = await getReceipts(pageNum, limitNum, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const receipt = await getReceiptById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    res.json(receipt);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const receipt = await createReceipt(req.body);
    res.status(201).json(receipt);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const receipt = await updateReceipt(req.params.id, req.body);
    res.json(receipt);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteReceipt(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

