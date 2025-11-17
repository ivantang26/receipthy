const API_BASE_URL = '/api';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard API
export async function getDashboardSummary(params: {
  from: string;
  to: string;
  groupBy: 'daily' | 'monthly' | 'yearly';
}) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/dashboard/summary?${queryString}`);
  if (!response.ok) throw new Error('Failed to fetch dashboard summary');
  return response.json();
}

// Transactions API
export async function getTransactions(params: {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  search?: string;
  status?: string;
  paymentMethod?: string;
}) {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => [key, String(value)])
  ).toString();
  const response = await fetch(`${API_BASE_URL}/transactions?${queryString}`);
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
}

export async function exportTransactions(params: {
  from?: string;
  to?: string;
  search?: string;
  status?: string;
  paymentMethod?: string;
}) {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => [key, String(value)])
  ).toString();
  const response = await fetch(`${API_BASE_URL}/transactions/export?${queryString}`);
  if (!response.ok) throw new Error('Failed to export transactions');
  return response.text();
}

// Invoices API
export async function getInvoices(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => [key, String(value)])
  ).toString();
  const response = await fetch(`${API_BASE_URL}/invoices?${queryString}`);
  if (!response.ok) throw new Error('Failed to fetch invoices');
  return response.json();
}

export async function getInvoiceById(id: string) {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}`);
  if (!response.ok) throw new Error('Failed to fetch invoice');
  return response.json();
}

export async function createInvoice(data: any) {
  const response = await fetch(`${API_BASE_URL}/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create invoice');
  return response.json();
}

export async function updateInvoice(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update invoice');
  return response.json();
}

export async function deleteInvoice(id: string) {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete invoice');
}

export async function duplicateInvoice(id: string) {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}/duplicate`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to duplicate invoice');
  return response.json();
}

// Receipts API
export async function getReceipts(params: {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  source?: string;
  search?: string;
}) {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => [key, String(value)])
  ).toString();
  const response = await fetch(`${API_BASE_URL}/receipts?${queryString}`);
  if (!response.ok) throw new Error('Failed to fetch receipts');
  return response.json();
}

export async function getReceiptById(id: string) {
  const response = await fetch(`${API_BASE_URL}/receipts/${id}`);
  if (!response.ok) throw new Error('Failed to fetch receipt');
  return response.json();
}

export async function createReceipt(data: any) {
  const response = await fetch(`${API_BASE_URL}/receipts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create receipt');
  return response.json();
}

export async function updateReceipt(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/receipts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update receipt');
  return response.json();
}

export async function deleteReceipt(id: string) {
  const response = await fetch(`${API_BASE_URL}/receipts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete receipt');
}

