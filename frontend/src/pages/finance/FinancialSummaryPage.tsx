import React, { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import FinanceShell from '../../components/finance/FinanceShell';
import {
  financeService,
  FinancialRecord,
  FinancialSummary,
  TransactionType,
} from '../../services/financeService';

interface Props {
  onBack: () => void;
  onNotify?: (message: string) => void;
}

const money = (value: number | undefined) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(Number(value || 0));

export default function FinancialSummaryPage({ onBack, onNotify }: Props) {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [type, setType] = useState<TransactionType | ''>('');

  const load = async () => {
    try {
      const [summaryData, recordData] = await Promise.all([
        financeService.getSummary(),
        financeService.getFinancialRecords({ type }),
      ]);
      setSummary(summaryData);
      setRecords(recordData);
    } catch (error) {
      onNotify?.((error as Error).message);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FinanceShell
      title="Financial Summary"
      subtitle="Consolidated revenue, expenses, receivables, payables and transaction history."
      onBack={onBack}
    >
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Customer Revenue', money(summary?.totalCustomerRevenue)],
          ['Vendor Expenses', money(summary?.totalVendorExpenses)],
          ['Receivables', money(summary?.outstandingCustomerReceivables)],
          ['Vendor Payables', money(summary?.outstandingVendorPayables)],
          ['Net Cash Flow', money(summary?.netCashFlow)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <TrendingUp size={18} />
            </div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Financial Records</h2>
            <p className="text-sm text-slate-500">{records.length} transaction(s)</p>
          </div>
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType | '')}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">All transaction types</option>
              <option>CUSTOMER_PAYMENT</option>
              <option>VENDOR_PAYMENT</option>
              <option>REFUND</option>
              <option>ADJUSTMENT</option>
            </select>
            <button
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              <RefreshCw size={15} />
              Apply
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Transaction</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((record) => {
                const incoming = record.direction?.toUpperCase() === 'IN';
                return (
                  <tr key={record.transactionId}>
                    <td className="px-5 py-4 font-semibold">{record.transactionId}</td>
                    <td className="px-5 py-4">{record.type}</td>
                    <td className="px-5 py-4">{record.reference || '—'}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          incoming ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {incoming ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                        {money(record.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {new Date(record.transactionDate).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                    No financial records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </FinanceShell>
  );
}
