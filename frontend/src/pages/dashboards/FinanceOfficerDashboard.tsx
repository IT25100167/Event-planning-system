import React from 'react'

interface FinanceOfficerDashboardProps {
    onNotify?: (message: string) => void
    onNavigateToPublic?: () => void
}

export default function FinanceOfficerDashboard({
                                                    onNotify,
                                                    onNavigateToPublic
                                                }: FinanceOfficerDashboardProps) {

    const cards = [
        {
            title: 'Quotations',
            description: 'Prepare, review and manage event quotations.',
            icon: '📄'
        },
        {
            title: 'Invoices',
            description: 'Create and manage customer invoices and billing records.',
            icon: '🧾'
        },
        {
            title: 'Payments',
            description: 'Track customer payments and payment status.',
            icon: '💳'
        },
        {
            title: 'Budgets',
            description: 'Monitor event budgets and financial allocations.',
            icon: '💰'
        },
        {
            title: 'Financial Reports',
            description: 'Review income, expenses and financial summaries.',
            icon: '📊'
        },
        {
            title: 'Outstanding Payments',
            description: 'Identify unpaid and overdue customer payments.',
            icon: '⚠️'
        }
    ]

    const handleAction = (title: string) => {
        onNotify?.(`${title} module selected`)
    }

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-6">
                <div className="max-w-7xl mx-auto">

                    <p className="text-sm text-violet-600 font-semibold uppercase tracking-wide">
                        Financial Management
                    </p>

                    <h1 className="text-3xl font-bold text-slate-900 mt-1">
                        Finance Officer Dashboard
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage quotations, invoices, payments, budgets and financial reports.
                    </p>

                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Invoices
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            0
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Paid Payments
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            0
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Pending Payments
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            0
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Active Budgets
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            0
                        </p>
                    </div>

                </div>

                {/* Finance Functions */}
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Finance Functions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    {cards.map((card) => (
                        <button
                            key={card.title}
                            onClick={() => handleAction(card.title)}
                            className="text-left bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-violet-300 transition"
                        >
                            <div className="flex items-start gap-4">

                                <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center text-2xl">
                                    {card.icon}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {card.title}
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1 leading-5">
                                        {card.description}
                                    </p>
                                </div>

                            </div>
                        </button>
                    ))}

                </div>

                {/* Recent Financial Activity */}
                <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

                    <h2 className="text-lg font-bold text-slate-900">
                        Recent Financial Activity
                    </h2>

                    <div className="mt-5 text-sm text-slate-500 text-center py-8">
                        No recent financial activity available.
                    </div>

                </div>

                {/* Public Site */}
                <div className="mt-6 flex justify-end">

                    <button
                        onClick={onNavigateToPublic}
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition"
                    >
                        Public Site
                    </button>

                </div>

            </div>
        </div>
    )
}