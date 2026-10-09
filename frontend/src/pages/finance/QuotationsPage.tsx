import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import FinanceShell from '../../components/finance/FinanceShell';
import {
  financeService,
  Quotation,
  QuotationStatus,
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

export default function QuotationsPage({ onBack, onNotify }: Props) {
  const [items, setItems] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingFilter, setBookingFilter] = useState('');
  const [form, setForm] = useState({
    bookingId: '',
    packageId: '',
    subtotal: '',
    discountPercent: '0',
  });

  const load = async () => {
    setLoading(true);
    try {
      setItems(await financeService.getQuotations(bookingFilter || undefined));
    } catch (error) {
      onNotify?.((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // Initial data load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await financeService.createQuotation({
        bookingId: form.bookingId.trim(),
        packageId: form.packageId.trim() || undefined,
        subtotal: Number(form.subtotal),
        discountPercent: Number(form.discountPercent || 0),
      });
      onNotify?.('Quotation created successfully');
      setForm({ bookingId: '', packageId: '', subtotal: '', discountPercent: '0' });
      await load();
    } catch (error) {
      onNotify?.((error as Error).message);
    }
  };

  const updateStatus = async (quotationId: string, status: QuotationStatus) => {
    try {
      await financeService.updateQuotationStatus(quotationId, status);
      onNotify?.('Quotation status updated');
      await load();
    } catch (error) {
      onNotify?.((error as Error).message);
    }
  };

  return (
    <FinanceShell
      title="Quotations"
      subtitle="Create quotations and manage quotation status."
      onBack={onBack}
    >
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form
          onSubmit={create}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2">
            <Plus size={18} className="text-violet-600" />
            <h2 className="font-bold text-slate-900">New Quotation</h2>
          </div>

          {[
            ['Booking ID', 'bookingId', 'BK-001'],
            ['Package ID', 'packageId', 'PKG-001'],
            ['Subtotal (LKR)', 'subtotal', '100000'],
            ['Discount %', 'discountPercent', '0'],
          ].map(([label, key, placeholder]) => (
            <label key={key} className="mb-4 block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
              </span>
              <input
                required={key === 'bookingId' || key === 'subtotal'}
                type={key === 'subtotal' || key === 'discountPercent' ? 'number' : 'text'}
                min={key === 'subtotal' || key === 'discountPercent' ? 0 : undefined}
                step={key === 'subtotal' || key === 'discountPercent' ? '0.01' : undefined}
                value={form[key as keyof typeof form]}
                placeholder={placeholder}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </label>
          ))}

          <button className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700">
            Create Quotation
          </button>
        </form>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Quotation Register</h2>
              <p className="text-sm text-slate-500">{items.length} quotation(s)</p>
            </div>
            <div className="flex gap-2">
              <input
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                placeholder="Filter by booking ID"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
              <button
                onClick={() => void load()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={15} />
                Load
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Quotation</th>
                  <th className="px-5 py-3">Booking</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.quotationId} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {item.quotationId}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.bookingId}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {money(item.estimatedTotal)}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          void updateStatus(
                            item.quotationId,
                            e.target.value as QuotationStatus
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
                      >
                        {['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'].map(
                          (status) => (
                            <option key={status}>{status}</option>
                          )
                        )}
                      </select>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                      No quotations found.
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
