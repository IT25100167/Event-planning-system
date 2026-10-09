import React, { useEffect, useState } from 'react';
import { HandCoins, RefreshCw } from 'lucide-react';
import FinanceShell from '../../components/finance/FinanceShell';
import {
  financeService,
  VendorPayment,
  VendorPaymentStatus,
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

export default function VendorPaymentsPage({ onBack, onNotify }: Props) {
  const [items, setItems] = useState<VendorPayment[]>([]);
  const [form, setForm] = useState({
    eventId: '',
    vendorId: '',
    serviceDescription: '',
    amount: '',
    dueDate: '',
  });

  const load = async () => {
    try {
      setItems(await financeService.getVendorPayments());
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
      await financeService.createVendorPayment({
        eventId: Number(form.eventId),
        vendorId: Number(form.vendorId),
        serviceDescription: form.serviceDescription.trim(),
        amount: Number(form.amount),
        dueDate: form.dueDate,
      });
      onNotify?.('Vendor payment created successfully');
      setForm({
        eventId: '',
        vendorId: '',
        serviceDescription: '',
        amount: '',
        dueDate: '',
      });
      await load();
    } catch (error) {
      onNotify?.((error as Error).message);
    }
  };

  const update = async (
    id: string,
    status: VendorPaymentStatus,
    currentReference?: string | null
  ) => {
    const reference =
      status === 'PAID'
        ? window.prompt('Payment reference', currentReference || '') || undefined
        : currentReference || undefined;
    try {
      await financeService.updateVendorPaymentStatus(id, status, reference);
      onNotify?.('Vendor payment status updated');
      await load();
    } catch (error) {
      onNotify?.((error as Error).message);
    }
  };

  return (
    <FinanceShell
      title="Vendor Payments"
      subtitle="Create vendor payment obligations and manage settlement status."
      onBack={onBack}
    >
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form
          onSubmit={create}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2">
            <HandCoins size={18} className="text-violet-600" />
            <h2 className="font-bold text-slate-900">New Vendor Payment</h2>
          </div>

          {[
            ['Event ID', 'eventId', 'number'],
            ['Vendor ID', 'vendorId', 'number'],
            ['Service Description', 'serviceDescription', 'text'],
            ['Amount (LKR)', 'amount', 'number'],
            ['Due Date', 'dueDate', 'date'],
          ].map(([label, key, type]) => (
            <label key={key} className="mb-4 block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
              </span>
              <input
                required
                type={type}
                min={type === 'number' ? 0 : undefined}
                step={key === 'amount' ? '0.01' : undefined}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </label>
          ))}

          <button className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
            Create Vendor Payment
          </button>
        </form>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 className="font-bold text-slate-900">Vendor Payment Register</h2>
              <p className="text-sm text-slate-500">{items.length} record(s)</p>
            </div>
            <button
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Event / Vendor</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.vendorPaymentId}>
                    <td className="px-5 py-4 font-semibold">{item.vendorPaymentId}</td>
                    <td className="px-5 py-4">
                      <div>Event #{item.eventId}</div>
                      <div className="text-xs text-slate-500">
                        Vendor #{item.vendorId}
                      </div>
                    </td>
                    <td className="px-5 py-4">{item.serviceDescription}</td>
                    <td className="px-5 py-4">{money(item.amount)}</td>
                    <td className="px-5 py-4">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          void update(
                            item.vendorPaymentId,
                            e.target.value as VendorPaymentStatus,
                            item.paymentReference
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5"
                      >
                        <option>PENDING</option>
                        <option>PAID</option>
                        <option>CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                      No vendor payment records found.
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
