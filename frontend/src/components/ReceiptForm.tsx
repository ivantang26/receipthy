import { useState, useEffect } from 'react';
import { createReceipt, updateReceipt, getInvoices } from '../lib/api';

interface ReceiptFormProps {
  receipt?: any;
  onClose: () => void;
}

export default function ReceiptForm({ receipt, onClose }: ReceiptFormProps) {
  const [formData, setFormData] = useState({
    dateTime: new Date().toISOString().slice(0, 16),
    amount: '',
    paymentMethod: 'CASH',
    source: 'MANUAL',
    relatedInvoiceId: '',
    notes: '',
  });

  const [invoices, setInvoices] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInvoices();

    if (receipt) {
      setFormData({
        dateTime: new Date(receipt.dateTime).toISOString().slice(0, 16),
        amount: receipt.amount.toString(),
        paymentMethod: receipt.paymentMethod,
        source: receipt.source,
        relatedInvoiceId: receipt.relatedInvoiceId || '',
        notes: receipt.notes || '',
      });
    }
  }, [receipt]);

  const loadInvoices = async () => {
    try {
      const data = await getInvoices({ limit: 100, status: undefined });
      setInvoices(data.data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        relatedInvoiceId: formData.relatedInvoiceId || null,
      };

      if (receipt) {
        await updateReceipt(receipt.id, data);
      } else {
        await createReceipt(data);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save receipt:', error);
      alert('Failed to save receipt');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Receipt Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Receipt Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date/Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="E_WALLET">E-Wallet</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source *
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="POS">POS</option>
              <option value="MANUAL">Manual</option>
              <option value="IMPORTED">Imported</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Linked Invoice (Optional)
            </label>
            <select
              value={formData.relatedInvoiceId}
              onChange={(e) => setFormData({ ...formData, relatedInvoiceId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">— No linked invoice —</option>
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoiceNumber} - {invoice.customerName} ({invoice.total.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : receipt ? 'Update Receipt' : 'Create Receipt'}
        </button>
      </div>
    </form>
  );
}

