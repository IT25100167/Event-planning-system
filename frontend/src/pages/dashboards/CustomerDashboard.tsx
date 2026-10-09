import React from 'react'

interface CustomerDashboardProps {
    onNotify?: (message: string) => void
    onNavigateToPublic?: () => void
}

export default function CustomerDashboard({
                                              onNotify,
                                              onNavigateToPublic
                                          }: CustomerDashboardProps) {

    const cards = [
        {
            title: 'Browse Event Packages',
            description: 'Explore available packages for weddings, conferences, seminars and other events.',
            icon: '📦'
        },
        {
            title: 'My Bookings',
            description: 'View your submitted event bookings and their current status.',
            icon: '📅'
        },
        {
            title: 'Submit Booking',
            description: 'Submit a new event booking request with the required details.',
            icon: '📝'
        },
        {
            title: 'Upload Documents',
            description: 'Upload documents required for your event booking.',
            icon: '📎'
        },
        {
            title: 'Payments',
            description: 'View payment information and manage your event payments.',
            icon: '💳'
        },
        {
            title: 'Notifications',
            description: 'View booking confirmations, updates and important notifications.',
            icon: '🔔'
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
                        Customer Portal
                    </p>

                    <h1 className="text-3xl font-bold text-slate-900 mt-1">
                        Customer Dashboard
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Browse event packages, manage bookings, documents and payments.
                    </p>

                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            My Bookings
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            0
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Pending Bookings
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            0
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Confirmed Events
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

                </div>

                {/* Customer Functions */}
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Customer Functions
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

                {/* Recent Activity */}
                <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

                    <h2 className="text-lg font-bold text-slate-900">
                        Recent Activity
                    </h2>

                    <div className="mt-5 text-sm text-slate-500 text-center py-8">
                        No recent activity available.
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