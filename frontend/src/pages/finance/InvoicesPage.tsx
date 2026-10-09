import React, { useEffect, useState } from 'react';
import { Download, Plus, RefreshCw } from 'lucide-react';
import FinanceShell from '../../components/finance/FinanceShell';
import {
  financeService,
  Invoice,
  PaymentStatus,
} from '../../services/financeService';

interface Props {
  onBack: () => void;
  onNotify?: (message: string) => void;
}

const money = (value: number) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(Number(value || 0));

export default function InvoicesPage({ onBack, onNotify }: Props) {
  const [items, setItems] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('');
  const [bookingFilter, setBookingFilter] = useState('');
  const [form, setForm] = useState({
    bookingId: '',
    customerEmail: '',
    baseAmount: '',
    discountPercent: '0',
    dueDate: '',
  });

  const load = async () => {
    try {
      setItems(
        await financeService.getInvoices(
          bookingFilter || undefined,
          statusFilter
        )
      );
    } catch (error) {
      onNotify?.((error as Error).message);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await financeService.createInvoice({
        bookingId: form.bookingId.trim(),
        customerEmail: form.customerEmail.trim(),
        baseAmount: Number(form.baseAmount),
        discountPercent: Number(form.discountPercent || 0),
        dueDate: form.dueDate || undefined,
      });
      onNotify?.('Invoice created successfully');
      setForm({
        bookingId: '',
        customerEmail: '',
        baseAmount: '',
        discountPercent: '0',
        dueDate: '',
      });
      await load();
    } catch (error) {
      onNotify?.((error as Error).message);
    }
  };

  const downloadPdf = async (invoiceId: string) => {
    try {
      await financeService.downloadInvoicePdf(invoiceId);
      onNotify?.('Invoice PDF downloaded successfully');
    } catch (error) {
      onNotify?.((error as Error).message);
    }
  };

  return (
    <FinanceShell
      title="Invoices"
      subtitle="Create invoices, monitor balances and download invoice PDFs."
      onBack={onBack}
    >
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form
          onSubmit={create}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2">
            <Plus size={18} className="text-violet-600" />
            <h2 className="font-bold text-slate-900">New Invoice</h2>
          </div>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Booking ID
            </span>
            <input
              required
              value={form.bookingId}
              onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Customer Email
            </span>
            <input
              required
              type="email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Base Amount
              </span>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.baseAmount}
                onChange={(e) => setForm({ ...form, baseAmount: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              />
            </label>
            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Discount %
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.discountPercent}
                onChange={(e) =>
                  setForm({ ...form, discountPercent: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              />
            </label>
          </div>

          <label className="mb-5 block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Due Date
            </span>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
            />
          </label>

          <button className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
            Create Invoice
          </button>
        </form>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Invoice Register</h2>
              <p className="text-sm text-slate-500">{items.length} invoice(s)</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                placeholder="Booking ID"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | '')}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">All statuses</option>
                {['PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'].map(
                  (status) => (
                    <option key={status}>{status}</option>
                  )
                )}
              </select>
              <button
                onClick={() => void load()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <RefreshCw size={15} />
                Load
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Final</th>
                  <th className="px-5 py-3">Outstanding</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.invoiceId}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{item.invoiceId}</p>
                      <p className="text-xs text-slate-500">{item.bookingId}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.customerEmail}</td>
                    <td className="px-5 py-4">{money(item.finalAmount)}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {money(item.outstandingAmount)}
                    </td>
                    <td className="px-5 py-4">{item.paymentStatus}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => void downloadPdf(item.invoiceId)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Download size={14} />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </FinanceShell>
  );
}
