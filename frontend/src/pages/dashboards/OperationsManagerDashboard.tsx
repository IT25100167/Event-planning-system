import React, { useState, useEffect } from 'react'
import {
  ArrowRight, Bell, CalendarDays, ChevronDown, ChevronRight, CircleDollarSign, ClipboardList,
  Clock3, Download, LayoutDashboard, Menu, MoreHorizontal,
  Package, PanelLeft, Plus, Search, Settings, ShieldCheck, Sparkles, Target, TrendingUp, UserRound,
  Users, WalletCards, X, Zap, BarChart3, Building2, CheckCircle2, AlertTriangle
} from 'lucide-react'
import { apiService, EventResponse, UserResponse, AssignEventRequest } from '../../services/api'

// Logo Component
function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${light ? 'bg-white/15 text-white' : 'bg-[#5b43d6] text-white'}`}>
        <Sparkles size={18} />
      </div>
      <span className={`text-[17px] font-semibold tracking-[-0.02em] ${light ? 'text-white' : 'text-[#18213a]'}`}>
        Event<span className={light ? 'text-violet-200' : 'text-[#6d55ed]'}>Flow</span>
      </span>
    </div>
  )
}

// Badge Component
function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) {
  const colors: Record<string, string> = {
    violet: 'bg-violet-50 text-violet-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    neutral: 'bg-slate-100 text-slate-600'
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${colors[tone] || colors.neutral}`}>
      {children}
    </span>
  )
}

// Event Type Interface
interface EventType {
  id: string
  name: string
  client: string
  date: string
  venue: string
  progress: number
  status: string
  color: string
}

// Helper function to convert backend event to frontend format
function convertEventToFrontendFormat(event: EventResponse): EventType {
  const progressMap: Record<string, number> = {
    'PLANNING': 25,
    'IN_PROGRESS': 60,
    'COMPLETED': 100,
    'CANCELLED': 0
  }
  
  const statusMap: Record<string, string> = {
    'PLANNING': 'Planning',
    'IN_PROGRESS': 'In progress',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
  }
  
  const colorMap: Record<string, string> = {
    'PLANNING': 'amber',
    'IN_PROGRESS': 'violet',
    'COMPLETED': 'green',
    'CANCELLED': 'slate'
  }
  
  return {
    id: `EVT-${event.eventId}`,
    name: event.eventName,
    client: event.coordinatorName || 'Unassigned',
    date: new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    venue: event.notes || 'TBD',
    progress: progressMap[event.status] || 0,
    status: statusMap[event.status] || event.status,
    color: colorMap[event.status] || 'slate'
  }
}

interface OperationsManagerDashboardProps {
  onNavigateToPublic: () => void
  onNotify: (message: string) => void
}

export default function OperationsManagerDashboard({ onNavigateToPublic, onNotify }: OperationsManagerDashboardProps) {
  const [active, setActive] = useState('Dashboard')
  const [mobileNav, setMobileNav] = useState(false)
  const [search, setSearch] = useState('')
  const [events, setEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [coordinators, setCoordinators] = useState<UserResponse[]>([])
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    deadline: '',
    coordinatorId: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [showManageDialog, setShowManageDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [manageFormData, setManageFormData] = useState({
    eventName: '',
    eventDate: '',
    deadline: '',
    coordinatorId: '',
    notes: '',
    status: ''
  })

  // Navigation items for Operations Manager
  const managerNav = [
    ['Dashboard', LayoutDashboard],
    ['All Events', CalendarDays],
    ['Event Assignments', ClipboardList],
    ['Event Monitoring', Target],
    ['Deadlines', Clock3],
    ['Vendors', Building2],
    ['Reports', BarChart3],
    ['Notifications', Bell]
  ]

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        console.log('Fetching events from backend...')
        const backendEvents = await apiService.getAllEvents()
        console.log('Backend events received:', backendEvents)
        const frontendEvents = backendEvents.map(convertEventToFrontendFormat)
        console.log('Frontend events converted:', frontendEvents)
        setEvents(frontendEvents)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch events:', err)
        setError('Failed to load events. Please check if the backend is running.')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Fetch coordinators when dialog opens
  useEffect(() => {
    const fetchCoordinators = async () => {
      if (showAssignDialog || showManageDialog) {
        try {
          console.log('Fetching coordinators...')
          const coords = await apiService.getAllCoordinators()
          console.log('Coordinators loaded:', coords)
          setCoordinators(coords)
        } catch (err) {
          console.error('Failed to fetch coordinators:', err)
          onNotify('Failed to load coordinators')
        }
      }
    }

    fetchCoordinators()
  }, [showAssignDialog, showManageDialog])

  const handleAssignEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const request: AssignEventRequest = {
        eventName: formData.eventName,
        eventDate: formData.eventDate,
        deadline: formData.deadline,
        coordinatorId: parseInt(formData.coordinatorId),
        notes: formData.notes || undefined
      }

      const newEvent = await apiService.assignEvent(request)
      
      const frontendEvent = convertEventToFrontendFormat(newEvent)
      setEvents(prev => [frontendEvent, ...prev])
      
      setFormData({
        eventName: '',
        eventDate: '',
        deadline: '',
        coordinatorId: '',
        notes: ''
      })
      setShowAssignDialog(false)
      onNotify('Event assigned successfully!')
    } catch (err: any) {
      console.error('Failed to assign event:', err)
      onNotify(err.message || 'Failed to assign event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleManageEvent = async (event: EventType) => {
    setSelectedEvent(event)
    setSubmitting(true)
    
    try {
      const eventId = parseInt(event.id.replace('EVT-', ''))
      const fullEventData = await apiService.getEventById(eventId)
      
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }
      
      setManageFormData({
        eventName: fullEventData.eventName || '',
        eventDate: formatDateForInput(fullEventData.eventDate) || '',
        deadline: formatDateForInput(fullEventData.deadline) || '',
        coordinatorId: fullEventData.coordinatorId?.toString() || '',
        notes: fullEventData.notes || '',
        status: fullEventData.status || ''
      })
      setShowManageDialog(true)
    } catch (err: any) {
      console.error('Failed to fetch event details:', err)
      onNotify('Failed to load event details')
      setManageFormData({
        eventName: event.name,
        eventDate: event.date,
        deadline: event.date,
        coordinatorId: '',
        notes: event.venue,
        status: event.status
      })
      setShowManageDialog(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent) return
    
    setSubmitting(true)

    try {
      const eventId = parseInt(selectedEvent.id.replace('EVT-', ''))
      
      const request: any = {}

      if (manageFormData.eventName && manageFormData.eventName.trim()) {
        request.eventName = manageFormData.eventName
      }
      if (manageFormData.eventDate && manageFormData.eventDate.trim()) {
        request.eventDate = manageFormData.eventDate
      }
      if (manageFormData.deadline && manageFormData.deadline.trim()) {
        request.deadline = manageFormData.deadline
      }
      if (manageFormData.notes && manageFormData.notes.trim()) {
        request.notes = manageFormData.notes
      }
      if (manageFormData.coordinatorId && manageFormData.coordinatorId.trim()) {
        request.coordinatorId = parseInt(manageFormData.coordinatorId)
      }

      if (Object.keys(request).length === 0) {
        onNotify('Please update at least one field')
        setSubmitting(false)
        return
      }

      console.log('🚀 Sending update request:', request)

      const updatedEvent = await apiService.updateEvent(eventId, request)
      
      const frontendEvent = convertEventToFrontendFormat(updatedEvent)
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? frontendEvent : e))
      
      setShowManageDialog(false)
      setSelectedEvent(null)
      onNotify('Event updated successfully!')
    } catch (err: any) {
      console.error('❌ Failed to update event:', err)
      
      let errorMessage = 'Failed to update event'
      
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.error || errorMessage
      } else if (err.message) {
        errorMessage = err.message
      }
      
      onNotify(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return
    
    if (!window.confirm(`Are you sure you want to delete "${selectedEvent.name}"? This action cannot be undone.`)) {
      return
    }

    setSubmitting(true)

    try {
      const eventId = parseInt(selectedEvent.id.replace('EVT-', ''))
      console.log('🗑️ Deleting event:', eventId, selectedEvent)
      
      await apiService.deleteEvent(eventId)
      
      console.log('✅ Delete successful, updating state...')
      
      setEvents(prev => {
        const updated = prev.filter(e => e.id !== selectedEvent.id)
        console.log('📋 Events before:', prev.length, 'after:', updated.length)
        return updated
      })
      
      setShowManageDialog(false)
      setSelectedEvent(null)
      onNotify('Event deleted successfully!')
    } catch (err: any) {
      console.error('❌ Failed to delete event:', err)
      
      let errorMessage = 'Failed to delete event'
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.error || errorMessage
      } else if (err.message) {
        errorMessage = err.message
      }
      
      onNotify(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate statistics from events
  const totalEvents = events.length
  const pendingEvents = events.filter(e => e.status === 'Planning').length
  const inProgressEvents = events.filter(e => e.status === 'In progress').length
  const completedEvents = events.filter(e => e.status === 'Completed').length
  const overdueEvents = events.filter(e => {
    const eventDate = new Date(e.date)
    return eventDate < new Date() && e.status !== 'Completed'
  }).length
  
  const managerStats = [
    ['Total Events', totalEvents.toString(), `+${Math.round((totalEvents / 24) * 100)}%`, CalendarDays, 'violet'],
    ['Pending Events', pendingEvents.toString(), `${pendingEvents} waiting`, Clock3, 'amber'],
    ['In Progress', inProgressEvents.toString(), `${Math.round((inProgressEvents / totalEvents) * 100) || 0}%`, TrendingUp, 'blue'],
    ['Completed Events', completedEvents.toString(), `${Math.round((completedEvents / totalEvents) * 100) || 0}%`, CheckCircle2, 'green'],
    ['Overdue Events', overdueEvents.toString(), overdueEvents > 0 ? 'Needs attention' : 'On track', AlertTriangle, overdueEvents > 0 ? 'red' : 'green']
  ]
  
  const rows = active === 'All Events' ? events : events

  console.log('Current state:', { active, search, eventsCount: events.length, rowsCount: rows.length })

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#18213a]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <Logo/>
          <button onClick={() => setMobileNav(false)} className="lg:hidden">
            <X size={18}/>
          </button>
        </div>
        <div className="mt-8 rounded-2xl bg-[#f5f3ff] p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6d55ed]">Current role</p>
          <p className="mt-2 text-sm font-semibold">Event Operations Manager</p>
          <p className="mt-1 text-[11px] text-slate-500">All workspace access</p>
        </div>
        <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {managerNav.map(([label, Icon]: any) => (
            <button key={label} onClick={() => {setActive(label);setMobileNav(false)}} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold ${active === label ? 'bg-[#eeeaff] text-[#6048d7]' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Icon size={16}/>
              {label}
              {label === 'Notifications' && <span className="ml-auto h-2 w-2 rounded-full bg-rose-500"/>}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#dce9ff] text-xs font-bold text-[#4165a5]">
              SC
            </div>
            <div>
              <p className="text-xs font-semibold">Sarah Chen</p>
              <p className="text-[10px] text-slate-500">Operations Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNav(true)} className="lg:hidden">
              <Menu size={20}/>
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Workspace</p>
              <p className="text-sm font-semibold">{active}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
              <input 
                value={search} 
                onChange={(e) => {
                  console.log('Search value:', e.target.value);
                  setSearch(e.target.value);
                }} 
                placeholder="Search by name, ID, or coordinator..." 
                className="h-9 w-64 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-violet-300"
              />
            </div>
            <button onClick={() => onNotify('Notifications opened')} className="rounded-xl p-2 text-slate-500">
              <Bell size={18}/>
            </button>
            <button onClick={onNavigateToPublic} className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 sm:block">
              Public site
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mx-auto max-w-[1500px] p-5 md:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold text-[#6d55ed]">Monday, September 28, 2026</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Operations overview</h1>
              <p className="mt-1 text-sm text-slate-500">Monitor every event, assignment, deadline, and vendor in one place.</p>
            </div>
            <button onClick={() => setShowAssignDialog(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#654ce6] px-4 text-xs font-semibold text-white">
              <Plus size={16}/>Assign event
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-600" />
                <p className="text-sm font-semibold text-red-900">Error loading data</p>
              </div>
              <p className="mt-1 text-xs text-red-700">{error}</p>
              <p className="mt-2 text-xs text-red-600">Make sure your backend is running on http://localhost:8080</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mt-6 flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600"></div>
                <p className="mt-3 text-sm text-slate-500">Loading events...</p>
              </div>
            </div>
          )}

          {/* Dashboard Content - Only show when not loading */}
          {!loading && (
            <>
              {/* Statistics Cards */}
              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {managerStats.map(([label, value, change, Icon, tone]: any) => (
                  <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_rgba(30,41,80,0.035)]">
                    <div className="flex items-start justify-between">
                      <div className={`grid h-9 w-9 place-items-center rounded-xl ${tone === 'green' ? 'bg-emerald-50 text-emerald-600' : tone === 'red' ? 'bg-red-50 text-red-600' : tone === 'amber' ? 'bg-amber-50 text-amber-600' : tone === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-violet-50 text-violet-600'}`}>
                        <Icon size={17}/>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600">{change}</span>
                    </div>
                    <p className="mt-4 text-2xl font-semibold">{value}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              {/* Two Column Layout */}
              <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
                {/* Event Progress Overview */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold">Event progress overview</h2>
                      <p className="mt-1 text-xs text-slate-500">Current status across all events</p>
                    </div>
                    <button onClick={() => onNotify('Report exported')} className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold">Export</button>
                  </div>
                  <div className="mt-6 space-y-4">
                    {[
                      ['Pending', 7, 'bg-amber-400'],
                      ['Assigned', 4, 'bg-blue-400'],
                      ['In Progress', 11, 'bg-violet-500'],
                      ['Completed', 18, 'bg-emerald-500'],
                      ['Cancelled', 2, 'bg-slate-400']
                    ].map(([name, count, color]: any) => (
                      <div key={name as string} className="flex items-center gap-3">
                        <span className="w-24 text-xs text-slate-600">{name}</span>
                        <div className="h-2.5 flex-1 rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${color}`} style={{width: `${Math.min(100, (count as number) / 18 * 100)}%`}}/>
                        </div>
                        <span className="w-7 text-right text-xs font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Operational Readiness */}
                <section className="rounded-2xl border border-[#e0dbff] bg-[#f5f3ff] p-5">
                  <div className="flex items-center gap-2 text-[#654ce6]">
                    <ShieldCheck size={17}/>
                    <h2 className="text-sm font-semibold">Operational readiness</h2>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-600">3 events need attention before the end of the day. Review overdue deadlines and assign pending events.</p>
                  <button onClick={() => setActive('Event Monitoring')} className="mt-5 rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-[#654ce6]">Review now <ArrowRight size={13} className="ml-1 inline"/></button>
                </section>
              </div>

              {/* Events Table */}
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-sm font-semibold">Recent events</h2>
                    <p className="mt-1 text-xs text-slate-500">Monitor and take action on every event</p>
                  </div>
                  <button onClick={() => setActive('All Events')} className="rounded-lg bg-[#eeeaff] px-3 py-2 text-[11px] font-semibold text-[#654ce6]">View all <ArrowRight size={13} className="ml-1 inline"/></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                        <th className="px-5 py-3">Event</th>
                        <th className="px-5 py-3">Customer</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Progress</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.filter((e: EventType) => {
                        const searchText = `${e.name} ${e.client} ${e.id}`.toLowerCase();
                        const searchTerm = search.toLowerCase();
                        const matches = searchText.includes(searchTerm);
                        if (search) {
                          console.log(`Event: ${e.name}, Search: "${search}", Matches: ${matches}`);
                        }
                        return matches;
                      }).map((e: EventType) => (
                        <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                          <td className="px-5 py-4">
                            <p className="text-xs font-semibold">{e.name}</p>
                            <p className="mt-1 text-[10px] text-slate-400">{e.id}</p>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-600">{e.client}</td>
                          <td className="px-5 py-4 text-xs text-slate-600">{e.date}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-[#765fe9]" style={{width: `${e.progress}%`}}/>
                              </div>
                              <span className="text-[11px] text-slate-500">{e.progress}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <Badge tone={e.status === 'In progress' ? 'violet' : 'amber'}>{e.status}</Badge>
                          </td>
                          <td className="px-5 py-4">
                            <button onClick={() => handleManageEvent(e)} className="text-[11px] font-semibold text-[#654ce6]">Manage</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </main>

        {/* Assign Event Dialog */}
        {showAssignDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <button
                onClick={() => setShowAssignDialog(false)}
                className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

              <h2 className="text-lg font-semibold">Assign New Event</h2>
              <p className="mt-1 text-xs text-slate-500">Create and assign an event to a coordinator</p>

              <form onSubmit={handleAssignEvent} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Event Name</label>
                  <input
                    type="text"
                    required
                    value={formData.eventName}
                    onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                    placeholder="e.g., Wedding Reception"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Event Date</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Assign to Coordinator</label>
                  <select
                    required
                    value={formData.coordinatorId}
                    onChange={(e) => setFormData({...formData, coordinatorId: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  >
                    <option value="">Select coordinator</option>
                    {coordinators.map((coord) => (
                      <option key={coord.userId} value={coord.userId}>
                        {coord.name} ({coord.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                    rows={3}
                    placeholder="Additional details about the event"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAssignDialog(false)}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-[#654ce6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5741cb] disabled:opacity-50"
                  >
                    {submitting ? 'Assigning...' : 'Assign Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manage Event Dialog */}
        {showManageDialog && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <button
                onClick={() => setShowManageDialog(false)}
                className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

              <h2 className="text-lg font-semibold">Manage Event</h2>
              <p className="mt-1 text-xs text-slate-500">{selectedEvent.id} - Update or delete this event</p>

              <form onSubmit={handleUpdateEvent} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Event Name <span className="text-slate-400">(Optional)</span></label>
                  <input
                    type="text"
                    value={manageFormData.eventName}
                    onChange={(e) => setManageFormData({...manageFormData, eventName: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Event Date <span className="text-slate-400">(Optional)</span></label>
                  <input
                    type="date"
                    value={manageFormData.eventDate}
                    onChange={(e) => setManageFormData({...manageFormData, eventDate: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Deadline <span className="text-slate-400">(Optional)</span></label>
                  <input
                    type="date"
                    value={manageFormData.deadline}
                    onChange={(e) => setManageFormData({...manageFormData, deadline: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Reassign Coordinator (Optional)</label>
                  <select
                    value={manageFormData.coordinatorId}
                    onChange={(e) => setManageFormData({...manageFormData, coordinatorId: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  >
                    <option value="">Keep current coordinator</option>
                    {coordinators.map((coord) => (
                      <option key={coord.userId} value={coord.userId}>
                        {coord.name} ({coord.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Notes <span className="text-slate-400">(Optional)</span></label>
                  <textarea
                    value={manageFormData.notes}
                    onChange={(e) => setManageFormData({...manageFormData, notes: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDeleteEvent}
                    disabled={submitting}
                    className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowManageDialog(false)}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || (!manageFormData.eventName && !manageFormData.eventDate && !manageFormData.deadline && !manageFormData.notes && !manageFormData.coordinatorId)}
                    className="flex-1 rounded-lg bg-[#654ce6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5741cb] disabled:opacity-50"
                  >
                    {submitting ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
