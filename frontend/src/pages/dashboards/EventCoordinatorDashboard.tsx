import React from 'react'

interface EventCoordinatorDashboardProps {
    onNotify?: (message: string) => void
    onNavigateToPublic?: () => void
}

export default function EventCoordinatorDashboard({
                                                      onNotify,
                                                      onNavigateToPublic
                                                  }: EventCoordinatorDashboardProps) {

    const cards = [
        {
            title: 'My Events',
            description: 'View and manage events assigned to you.',
            icon: '📅',
            action: 'events'
        },
        {
            title: 'Task Management',
            description: 'Create, assign and update event-related tasks.',
            icon: '✓',
            action: 'tasks'
        },
        {
            title: 'Schedules',
            description: 'Manage event schedules, deadlines and important dates.',
            icon: '🕒',
            action: 'schedules'
        },
        {
            title: 'Vendor Coordination',
            description: 'Coordinate vendors and track their arrangements.',
            icon: '🤝',
            action: 'vendors'
        },
        {
            title: 'Event Progress',
            description: 'Monitor event progress and update task statuses.',
            icon: '📊',
            action: 'progress'
        },
        {
            title: 'Notifications',
            description: 'View important event and vendor updates.',
            icon: '🔔',
            action: 'notifications'
        }
    ]

    const handleAction = (action: string) => {
        onNotify?.(`${action} module selected`)
    }

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <p className="text-sm text-violet-600 font-semibold uppercase tracking-wide">
                        Event Coordination
                    </p>

                    <h1 className="text-3xl font-bold text-slate-900 mt-1">
                        Event Coordinator Dashboard
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage assigned events, tasks, schedules and vendor coordination.
                    </p>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Quick Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Assigned Events
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            0
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Pending Tasks
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            0
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Upcoming Deadlines
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            0
                        </p>
                    </div>

                </div>

                {/* Main Functions */}
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Coordinator Functions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    {cards.map((card) => (
                        <button
                            key={card.action}
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