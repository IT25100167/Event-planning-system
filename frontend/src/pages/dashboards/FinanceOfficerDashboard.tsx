import React, { useEffect, useState } from 'react';
import {
  BadgeDollarSign,
  Banknote,
  FileText,
  HandCoins,
  Landmark,
  ReceiptText,
  TrendingUp,
  WalletCards,
} from 'lucide-react';
import { financeService, FinancialSummary } from '../../services/financeService';

interface FinanceOfficerDashboardProps {
  onNotify?: (message: string) => void;
  onNavigateToPublic?: () => void;
  onNavigate?: (page: string) => void;
}

const money = (value: number | undefined) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export default function FinanceOfficerDashboard({
  onNotify,
  onNavigateToPublic,
  onNavigate,
}: FinanceOfficerDashboardProps) {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const cards = [
    {
      title: 'Quotations',
      description: 'Create, review and update customer quotations.',
      icon: FileText,
      page: 'financeQuotations',
    },
    {
      title: 'Invoices',
      description: 'Create invoices, review balances and download PDFs.',
      icon: ReceiptText,
      page: 'financeInvoices',
    },
    {
      title: 'Customer Payments',
      description: 'Record payments against invoices and review history.',
      icon: WalletCards,
      page: 'financeCustomerPayments',
    },
    {
      title: 'Vendor Payments',
      description: 'Track vendor liabilities and update settlement status.',
      icon: HandCoins,
      page: 'financeVendorPayments',
    },
    {
      title: 'Event Budgets',
      description: 'Create and manage allocated budgets by event.',
      icon: Landmark,
      page: 'financeBudgets',
    },
    {
      title: 'Financial Summary',
      description: 'Review income, expenses, receivables and cash flow.',
      icon: TrendingUp,
      page: 'financeSummary',
    },
  ];

  useEffect(() => {
    let active = true;
    financeService
      .getSummary()
      .then((data) => active && setSummary(data))
      .catch((error: Error) => {
        if (active) onNotify?.(`Unable to load finance summary: ${error.message}`);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [onNotify]);

  const handleAction = (page: string) => {
    onNavigate?.(page);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
            Financial Management
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Finance Officer Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            Manage quotations, invoices, customer payments, vendor payments,
            event budgets and financial reporting.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Customer Revenue',
              value: money(summary?.totalCustomerRevenue),
              icon: BadgeDollarSign,
            },
            {
              label: 'Outstanding Receivables',
              value: money(summary?.outstandingCustomerReceivables),
              icon: WalletCards,
            },
            {
              label: 'Vendor Payables',
              value: money(summary?.outstandingVendorPayables),
              icon: HandCoins,
            },
            {
              label: 'Net Cash Flow',
              value: money(summary?.netCashFlow),
              icon: Banknote,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {loading ? '...' : item.value}
                    </p>
                  </div>
                  <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Finance Functions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a module to manage its financial workflow.
            </p>
          </div>
          <button
            onClick={onNavigateToPublic}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Public Site
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => handleAction(card.page)}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-100">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {card.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Invoices</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? '...' : summary?.invoiceCount || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Paid Invoices</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {loading ? '...' : summary?.paidInvoiceCount || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pending Vendor Payments</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {loading ? '...' : summary?.pendingVendorPaymentCount || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
