import React, { useState } from 'react';
import { CreditCard, Search } from 'lucide-react';
import FinanceShell from '../../components/finance/FinanceShell';
import {
  CustomerPayment,
  financeService,
  Invoice,
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

export default function CustomerPaymentsPage({ onBack, onNotify }: Props) {
  const [invoiceId, setInvoiceId] = useState('');
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [form, setForm] = useState({
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    reference: '',
  });

  const loadInvoice = async () => {
    if (!invoiceId.trim()) {
      onNotify?.('Enter an invoice ID');
      return;
    }
    try {
      const [invoiceData, paymentData] = await Promise.all([
        financeService.getInvoice(invoiceId.trim()),
        financeService.getCustomerPayments(invoiceId.trim()),
      ]);
      setInvoice(invoiceData);
      setPayments(paymentData);
    } catch (error) {
      setInvoice(null);
      setPayments([]);
      onNotify?.((error as Error).message);
    }
  };

  const recordPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!invoiceId.trim()) {
      onNotify?.('Load an invoice before recording a payment');
      return;
    }
    try {
      await financeService.recordCustomerPayment(invoiceId.trim(), {
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
        reference: form.reference.trim() || undefined,
      });
      onNotify?.('Customer payment recorded successfully');
      setForm({ amount: '', paymentMethod: 'BANK_TRANSFER', reference: '' });
      await loadInvoice();
    } catch (error) {
      onNotify?.((error as Error).message);
    }
  };

  return (
    <FinanceShell
      title="Customer Payments"
      subtitle="Find an invoice, review outstanding balance and record payments."
      onBack={onBack}
    >
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            placeholder="Invoice ID (e.g. INV-...)"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400"
          />
          <button
            onClick={() => void loadInvoice()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Search size={16} />
            Load Invoice
          </button>
        </div>
      </div>

      {invoice && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            ['Invoice', invoice.invoiceId],
            ['Final Amount', money(invoice.finalAmount)],
            ['Paid Amount', money(invoice.paidAmount)],
            ['Outstanding', money(invoice.outstandingAmount)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form
          onSubmit={recordPayment}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2">
            <CreditCard size={18} className="text-violet-600" />
            <h2 className="font-bold text-slate-900">Record Payment</h2>
          </div>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Amount
            </span>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Payment Method
            </span>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
            >
              <option>BANK_TRANSFER</option>
              <option>CASH</option>
              <option>CARD</option>
              <option>ONLINE</option>
              <option>CHEQUE</option>
            </select>
          </label>

          <label className="mb-5 block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Reference
            </span>
            <input
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>

          <button
            disabled={!invoice}
            className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Record Payment
          </button>
        </form>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-bold text-slate-900">Payment History</h2>
            <p className="text-sm text-slate-500">{payments.length} payment(s)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Paid At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment.paymentId}>
                    <td className="px-5 py-4 font-semibold">{payment.paymentId}</td>
                    <td className="px-5 py-4">{money(payment.amount)}</td>
                    <td className="px-5 py-4">{payment.paymentMethod}</td>
                    <td className="px-5 py-4">{payment.reference || '—'}</td>
                    <td className="px-5 py-4">
                      {new Date(payment.paidAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                      Load an invoice to view payment history.
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
