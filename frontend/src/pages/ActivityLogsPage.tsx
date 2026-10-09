import React, { useEffect, useState } from 'react'
import { Activity, RefreshCw, ShieldCheck } from 'lucide-react'
import { apiService } from '../services/api'

interface ActivityLog {
    id: number
    userEmail: string
    action: string
    details: string
    logType: string
    timestamp: string
}

interface ActivityLogsPageProps {
    onNotify: (message: string) => void
}

export default function ActivityLogsPage({
                                             onNotify
                                         }: ActivityLogsPageProps) {
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [loading, setLoading] = useState(true)

    const loadLogs = async () => {
        try {
            setLoading(true)

            const data = await apiService.getActivityLogs()

            setLogs(data)
        } catch (error: any) {
            console.error('Failed to load activity logs:', error)
            onNotify(error.message || 'Failed to load activity logs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadLogs()
    }, [])

    return (
        <div className="min-h-screen bg-[#f7f8fc] p-5 md:p-8">

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#6d55ed]">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#18213a]">
                        Activity Logs
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Monitor recent user and security activities.
                    </p>
                </div>

                <button
                    onClick={loadLogs}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? 'animate-spin' : ''}
                    />
                    Refresh
                </button>

            </div>

            {/* Summary */}
            <div className="mb-5 grid gap-4 md:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50">
                            <Activity size={20} className="text-violet-600" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Recent Activities
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-800">
                                {logs.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50">
                            <ShieldCheck size={20} className="text-emerald-600" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Security Monitoring
                            </p>

                            <p className="mt-1 text-sm font-semibold text-emerald-600">
                                Active
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Logs Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-500">
                        Loading activity logs...
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-500">
                        No activity logs found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px]">

                            <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">

                                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    ID
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    User
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Action
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Details
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Type
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Timestamp
                                </th>

                            </tr>
                            </thead>

                            <tbody>

                            {logs.map(log => (
                                <tr
                                    key={log.id}
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                >

                                    <td className="px-5 py-4 text-sm font-medium text-slate-500">
                                        #{log.id}
                                    </td>

                                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                                        {log.userEmail}
                                    </td>

                                    <td className="px-5 py-4">
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">
                        {log.action}
                      </span>
                                    </td>

                                    <td className="max-w-[320px] px-5 py-4 text-sm text-slate-600">
                                        {log.details}
                                    </td>

                                    <td className="px-5 py-4">
                      <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                              log.logType === 'SECURITY'
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-emerald-50 text-emerald-600'
                          }`}
                      >
                        {log.logType}
                      </span>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>

                                </tr>
                            ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    )
}