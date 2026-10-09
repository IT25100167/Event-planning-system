import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';

interface FinanceShellProps {
  title: string;
  subtitle: string;
  userName?: string;
  children: React.ReactNode;
  onBack: () => void;
  onLogout?: () => void;
}

export default function FinanceShell({
  title,
  subtitle,
  userName,
  children,
  onBack,
  onLogout,
}: FinanceShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
              aria-label="Back to finance dashboard"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                Financial Management
              </p>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userName && (
              <span className="hidden text-sm text-slate-500 md:inline">
                {userName}
              </span>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut size={16} />
                Log out
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
