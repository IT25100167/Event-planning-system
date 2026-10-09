import React, { useState } from 'react';
import { Landmark, Search } from 'lucide-react';
import FinanceShell from '../../components/finance/FinanceShell';
import { EventBudget, financeService } from '../../services/financeService';

interface Props {
  onBack: () => void;
  onNotify?: (message: string) => void;
}

const money = (value: number) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(Number(value || 0));

export default function EventBudgetsPage({ onBack, onNotify }: Props) {
  const [eventId, setEventId] = useState('');
  const [allocatedBudget, setAllocatedBudget] = useState('');
  const [budget, setBudget] = useState<EventBudget | null>(null);

  const load = async () => {
    if (!eventId) return onNotify?.('Enter an event ID');
    try {
      const data = await financeService.getBudget(Number(eventId));
      setBudget(data);
      setAllocatedBudget(String(data.allocatedBudget));
    } catch (error) {
      setBudget(null);
      onNotify?.((error as Error).message);
    }
  };

  const save = async (mode: 'create' | 'update') => {
    if (!eventId || !allocatedBudget) {
      onNotify?.('Event ID and allocated budget are required');
      return;
    }
    try {
      const data =
        mode === 'create'
          ? await financeService.createBudget(Number(eventId), Number(allocatedBudget))
          : await financeService.updateBudget(Number(eventId), Number(allocatedBudget));
      setBudget(data);
      onNotify?.(
        mode === 'create'
          ? 'Event budget created successfully'
          : 'Event budget updated successfully'
      );
    } catch (error) {
      onNotify?.((error as Error).message);
    }
  };

  return (
    <FinanceShell
      title="Event Budgets"
      subtitle="Create and monitor allocated budgets for individual events."
      onBack={onBack}
    >
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Event ID
            </span>
            <input
              type="number"
              min="1"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Allocated Budget (LKR)
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={allocatedBudget}
              onChange={(e) => setAllocatedBudget(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>
          <div className="flex items-end">
            <button
              onClick={() => void load()}
              className="inline-flex h-[42px] items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold hover:bg-slate-50"
            >
              <Search size={16} />
              Load
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => void save('create')}
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Create Budget
          </button>
          <button
            onClick={() => void save('update')}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Update Budget
          </button>
        </div>
      </div>

      {budget ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          {[
            ['Allocated', money(budget.allocatedBudget)],
            ['Actual Spend', money(budget.actualSpend)],
            ['Variance', money(budget.variance)],
            ['Utilization', `${Number(budget.utilizationPercentage || 0).toFixed(2)}%`],
            ['Status', budget.status],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Landmark size={18} />
              </div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          Enter an event ID and load a budget to view financial utilization.
        </div>
      )}
    </FinanceShell>
  );
}
