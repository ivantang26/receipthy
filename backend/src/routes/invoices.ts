import { Router } from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  duplicateInvoice,
} from '../services/invoiceService';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { status, search = '', page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const filters: any = {};
    if (status) filters.status = status as string;
    if (search) filters.search = search as string;

    const result = await getInvoices(pageNum, limitNum, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const invoice = await getInvoiceById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const invoice = await createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const invoice = await updateInvoice(req.params.id, req.body);
    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteInvoice(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post('/:id/duplicate', async (req, res, next) => {
  try {
    const invoice = await duplicateInvoice(req.params.id);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
});

export default router;

