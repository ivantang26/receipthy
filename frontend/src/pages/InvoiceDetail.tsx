import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Copy, Edit, Check } from 'lucide-react';
import { getInvoiceById, updateInvoice, duplicateInvoice } from '../lib/api';
import { formatCurrency, formatDate } from '../lib/utils';

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadInvoice();
    }
  }, [id]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const data = await getInvoiceById(id!);
      setInvoice(data);
    } catch (error) {
      console.error('Failed to load invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!invoice) return;

    try {
      await updateInvoice(invoice.id, { ...invoice, status: 'PAID' });
      loadInvoice();
    } catch (error) {
      console.error('Failed to update invoice:', error);
      alert('Failed to mark as paid');
    }
  };

  const handleDuplicate = async () => {
    if (!invoice) return;

    try {
      const newInvoice = await duplicateInvoice(invoice.id);
      navigate(`/invoices/${newInvoice.id}`);
    } catch (error) {
      console.error('Failed to duplicate invoice:', error);
      alert('Failed to duplicate invoice');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-500 mb-4">Invoice not found</div>
        <button
          onClick={() => navigate('/invoices')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar - Hidden when printing */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Invoices
        </button>
        <div className="flex gap-2">
          {invoice.status !== 'PAID' && (
            <button
              onClick={handleMarkAsPaid}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="w-5 h-5" />
              Mark as Paid
            </button>
          )}
          <button
            onClick={() => navigate(`/invoices?edit=${invoice.id}`)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-5 h-5" />
            Edit
          </button>
          <button
            onClick={handleDuplicate}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-5 h-5" />
            Duplicate
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-600 mb-2">Receipthy</h1>
            <p className="text-gray-600">POS Analytics & Document Hub</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
            <p className="text-gray-600">{invoice.invoiceNumber}</p>
            <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Dates and Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To</h3>
            <div className="text-gray-900">
              <p className="font-semibold text-lg">{invoice.customerName}</p>
              <p className="text-gray-600">{invoice.customerEmail}</p>
              {invoice.customerAddress && (
                <p className="text-gray-600 mt-2 whitespace-pre-line">{invoice.customerAddress}</p>
              )}
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-semibold text-gray-500 uppercase">Issue Date</span>
                <p className="text-gray-900">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 uppercase">Due Date</span>
                <p className="text-gray-900">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 uppercase">Description</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 uppercase w-20">Qty</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 uppercase w-32">Unit Price</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 uppercase w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 px-2 text-gray-900">{item.description}</td>
                  <td className="py-4 px-2 text-right text-gray-900">{item.quantity}</td>
                  <td className="py-4 px-2 text-right text-gray-900">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 px-2 text-right font-medium text-gray-900">
                    {formatCurrency(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium text-gray-900">{formatCurrency(invoice.tax)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-300">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notes</h3>
            <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-1">Receipthy - POS Analytics & Document Hub</p>
        </div>
      </div>
    </div>
  );
}

