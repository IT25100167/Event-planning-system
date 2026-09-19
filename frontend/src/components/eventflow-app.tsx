import React, { useMemo, useState, useEffect } from 'react'
import {
  ArrowRight, Bell, CalendarDays, Check, ChevronDown, ChevronRight, CircleDollarSign, ClipboardList,
  Clock3, Download, FileText, Globe2, LayoutDashboard, Menu, MessageSquare, MoreHorizontal,
  Package, PanelLeft, Plus, Search, Settings, ShieldCheck, Sparkles, Target, TrendingUp, UserRound,
  Users, WalletCards, X, Zap, BarChart3, Building2, CheckCircle2, AlertTriangle
} from 'lucide-react'
import { apiService, EventResponse, UserResponse, AssignEventRequest } from '../services/api'

const nav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Events', icon: CalendarDays },
  { label: 'Bookings', icon: ClipboardList },
  { label: 'Vendors', icon: Building2 },
  { label: 'Finance', icon: CircleDollarSign },
  { label: 'Reports', icon: BarChart3 },
]

const events = [
  { id: 'EVT-1048', name: 'Grand Wedding Reception', client: 'Amelia & James', date: 'Oct 18, 2026', venue: 'The Glasshouse', progress: 82, status: 'In progress', color: 'violet' },
  { id: 'EVT-1047', name: 'Annual Leadership Summit', client: 'Northstar Labs', date: 'Oct 24, 2026', venue: 'Harbor Convention', progress: 64, status: 'In progress', color: 'blue' },
  { id: 'EVT-1046', name: 'Maya\'s 30th Birthday', client: 'Maya Perera', date: 'Nov 02, 2026', venue: 'The Courtyard', progress: 38, status: 'Planning', color: 'amber' },
  { id: 'EVT-1045', name: 'Product Launch Evening', client: 'Lumen Studio', date: 'Nov 12, 2026', venue: 'Skyline Atrium', progress: 21, status: 'Planning', color: 'slate' },
]

const tasks = [
  ['Confirm floral concept', 'Grand Wedding Reception', 'Today', 'High', 'In progress'],
  ['Review AV production plan', 'Annual Leadership Summit', 'Tomorrow', 'High', 'Pending'],
  ['Send menu tasting invite', 'Maya\'s 30th Birthday', 'Oct 08', 'Medium', 'Pending'],
  ['Approve venue floor plan', 'Product Launch Evening', 'Oct 10', 'Medium', 'Completed'],
]

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

function Stat({ icon: Icon, label, value, change, tone }: any) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,80,0.035)]">
      <div className="flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
          <Icon size={18} />
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
          <TrendingUp size={12} />{change}
        </span>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#1d2944]">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  )
}

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
  // Calculate progress based on status
  const progressMap: Record<string, number> = {
    'PLANNING': 25,
    'IN_PROGRESS': 60,
    'COMPLETED': 100,
    'CANCELLED': 0
  }
  
  // Map status to display format
  const statusMap: Record<string, string> = {
    'PLANNING': 'Planning',
    'IN_PROGRESS': 'In progress',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
  }
  
  // Assign colors based on status
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

function RoleDashboard({ role, active, setActive, search, setSearch, notify, onPublic, mobileNav, setMobileNav }: any) {
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
          notify('Failed to load coordinators')
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
      
      // Add new event to the list
      const frontendEvent = convertEventToFrontendFormat(newEvent)
      setEvents(prev => [frontendEvent, ...prev])
      
      // Reset form and close dialog
      setFormData({
        eventName: '',
        eventDate: '',
        deadline: '',
        coordinatorId: '',
        notes: ''
      })
      setShowAssignDialog(false)
      notify('Event assigned successfully!')
    } catch (err: any) {
      console.error('Failed to assign event:', err)
      notify(err.message || 'Failed to assign event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleManageEvent = (event: EventType) => {
    setSelectedEvent(event)
    // Parse the event ID to get the numeric part
    const eventId = parseInt(event.id.replace('EVT-', ''))
    
    setManageFormData({
      eventName: event.name,
      eventDate: event.date,
      deadline: event.date, // You might want to fetch the actual deadline
      coordinatorId: '',
      notes: event.venue,
      status: event.status
    })
    setShowManageDialog(true)
  }

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent) return
    
    setSubmitting(true)

    try {
      const eventId = parseInt(selectedEvent.id.replace('EVT-', ''))
      
      const request: Partial<AssignEventRequest> = {
        eventName: manageFormData.eventName,
        eventDate: manageFormData.eventDate,
        deadline: manageFormData.deadline,
        notes: manageFormData.notes
      }

      if (manageFormData.coordinatorId) {
        request.coordinatorId = parseInt(manageFormData.coordinatorId)
      }

      const updatedEvent = await apiService.updateEvent(eventId, request)
      
      // Update the event in the list
      const frontendEvent = convertEventToFrontendFormat(updatedEvent)
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? frontendEvent : e))
      
      setShowManageDialog(false)
      setSelectedEvent(null)
      notify('Event updated successfully!')
    } catch (err: any) {
      console.error('Failed to update event:', err)
      notify(err.message || 'Failed to update event')
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
      await apiService.deleteEvent(eventId)
      
      // Remove the event from the list
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id))
      
      setShowManageDialog(false)
      setSelectedEvent(null)
      notify('Event deleted successfully!')
    } catch (err: any) {
      console.error('Failed to delete event:', err)
      notify(err.message || 'Failed to delete event')
    } finally {
      setSubmitting(false)
    }
  }

  const manager = role === 'operations'
  const managerNav = [['Dashboard', LayoutDashboard], ['All Events', CalendarDays], ['Event Assignments', ClipboardList], ['Event Monitoring', Target], ['Deadlines', Clock3], ['Vendors', Building2], ['Reports', BarChart3], ['Notifications', Bell]]
  const coordinatorNav = [['Dashboard', LayoutDashboard], ['My Events', CalendarDays], ['Tasks', ClipboardList], ['Calendar', CalendarDays], ['Event Timeline', Target], ['Vendors', Building2], ['Customers', Users], ['Notifications', Bell]]
  const navItems = manager ? managerNav : coordinatorNav
  
  // Calculate real statistics from events
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
  
  const coordStats = [
    ['My Events', manager ? '08' : events.slice(0, 8).length.toString(), '3 this month', CalendarDays, 'violet'],
    ['Active Events', inProgressEvents.toString(), '+2 this week', TrendingUp, 'blue'],
    ['Upcoming Events', pendingEvents.toString(), pendingEvents > 0 ? `Next: ${events.find(e => e.status === 'Planning')?.date || 'TBD'}` : 'None', Clock3, 'amber'],
    ['Pending Tasks', '12', '5 due this week', ClipboardList, 'violet'],
    ['Completed Tasks', '32', '+14.2%', CheckCircle2, 'green'],
    ['Overdue Tasks', overdueEvents.toString(), overdueEvents > 0 ? 'Needs attention' : 'On track', AlertTriangle, overdueEvents > 0 ? 'red' : 'green']
  ]
  
  const rows = active === 'All Events' ? events : (manager ? events : events.slice(0, 3))

  console.log('Current state:', { active, search, eventsCount: events.length, rowsCount: rows.length, manager })

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#18213a]">
      <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <Logo/>
          <button onClick={() => setMobileNav(false)} className="lg:hidden">
            <X size={18}/>
          </button>
        </div>
        <div className="mt-8 rounded-2xl bg-[#f5f3ff] p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6d55ed]">Current role</p>
          <p className="mt-2 text-sm font-semibold">{manager ? 'Event Operations Manager' : 'Event Coordinator'}</p>
          <p className="mt-1 text-[11px] text-slate-500">{manager ? 'All workspace access' : 'Assigned events only'}</p>
        </div>
        <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {navItems.map(([label, Icon]: any) => (
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
              {manager ? 'SC' : 'PN'}
            </div>
            <div>
              <p className="text-xs font-semibold">{manager ? 'Sarah Chen' : 'Priya Nair'}</p>
              <p className="text-[10px] text-slate-500">{manager ? 'Operations Manager' : 'Event Coordinator'}</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="lg:pl-[260px]">
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
            <button onClick={() => notify('Notifications opened')} className="rounded-xl p-2 text-slate-500">
              <Bell size={18}/>
            </button>
            <button onClick={onPublic} className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 sm:block">
              Public site
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-5 md:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold text-[#6d55ed]">Monday, September 28, 2026</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">{manager ? 'Operations overview' : 'My workspace'}</h1>
              <p className="mt-1 text-sm text-slate-500">{manager ? 'Monitor every event, assignment, deadline, and vendor in one place.' : 'Stay on top of your assigned events, tasks, and upcoming deadlines.'}</p>
            </div>
            <button onClick={() => setShowAssignDialog(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#654ce6] px-4 text-xs font-semibold text-white">
              <Plus size={16}/>{manager ? 'Assign event' : 'Create task'}
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
          <div className={`mt-7 grid gap-4 ${manager ? 'sm:grid-cols-2 xl:grid-cols-5' : 'sm:grid-cols-2 xl:grid-cols-6'}`}>
            {(manager ? managerStats : coordStats).map(([label,value,change,Icon,tone]: any) => (
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
          <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">{manager ? 'Event progress overview' : 'Task progress'}</h2>
                  <p className="mt-1 text-xs text-slate-500">{manager ? 'Current status across all events' : 'Your work across active events'}</p>
                </div>
                <button onClick={() => notify('Report exported')} className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold">Export</button>
              </div>
              <div className="mt-6 space-y-4">
                {(manager ? [['Pending',7,'bg-amber-400'],['Assigned',4,'bg-blue-400'],['In Progress',11,'bg-violet-500'],['Completed',18,'bg-emerald-500'],['Cancelled',2,'bg-slate-400']] : [['To do',8,'bg-slate-400'],['In progress',12,'bg-violet-500'],['Blocked',2,'bg-red-400'],['Completed',32,'bg-emerald-500']]).map(([name,count,color]: any) => (
                  <div key={name as string} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-slate-600">{name}</span>
                    <div className="h-2.5 flex-1 rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${color}`} style={{width: `${Math.min(100, (count as number) / (manager ? 18 : 32) * 100)}%`}}/>
                    </div>
                    <span className="w-7 text-right text-xs font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-[#e0dbff] bg-[#f5f3ff] p-5">
              <div className="flex items-center gap-2 text-[#654ce6]">
                <ShieldCheck size={17}/>
                <h2 className="text-sm font-semibold">{manager ? 'Operational readiness' : 'Today\'s focus'}</h2>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-600">{manager ? '3 events need attention before the end of the day. Review overdue deadlines and assign pending events.' : 'You have 5 tasks due this week. Start with the high priority vendor confirmations.'}</p>
              <button onClick={() => setActive(manager ? 'Event Monitoring' : 'Tasks')} className="mt-5 rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-[#654ce6]">Review now <ArrowRight size={13} className="ml-1 inline"/></button>
            </section>
          </div>
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold">{manager ? 'Recent events' : 'My upcoming events'}</h2>
                <p className="mt-1 text-xs text-slate-500">{manager ? 'Monitor and take action on every event' : 'Events assigned to you'}</p>
              </div>
              <button onClick={() => setActive(manager ? 'All Events' : 'My Events')} className="rounded-lg bg-[#eeeaff] px-3 py-2 text-[11px] font-semibold text-[#654ce6]">View all <ArrowRight size={13} className="ml-1 inline"/></button>
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
                        <button onClick={() => manager ? handleManageEvent(e) : notify(`Tasks opened for ${e.id}`)} className="text-[11px] font-semibold text-[#654ce6]">{manager ? 'Manage' : 'View tasks'}</button>
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
                  <label className="text-xs font-semibold text-slate-700">Event Name</label>
                  <input
                    type="text"
                    required
                    value={manageFormData.eventName}
                    onChange={(e) => setManageFormData({...manageFormData, eventName: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Event Date</label>
                  <input
                    type="date"
                    required
                    value={manageFormData.eventDate}
                    onChange={(e) => setManageFormData({...manageFormData, eventDate: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Deadline</label>
                  <input
                    type="date"
                    required
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
                  <label className="text-xs font-semibold text-slate-700">Notes</label>
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
                    disabled={submitting}
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

function Landing({ onEnter, onBooking }: { onEnter: () => void; onBooking: () => void }) {
  return (
    <div className="min-h-screen bg-[#fcfbff] text-[#1d2944]">
      <header className="sticky top-0 z-30 border-b border-white/20 bg-[#211d4a]/95 text-white backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo light/>
          <nav className="hidden items-center gap-7 text-xs text-violet-100 md:flex">
            <a href="#services">Services</a>
            <a href="#packages">Packages</a>
            <a href="#how">How it works</a>
            <a href="#stories">Stories</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={onEnter} className="hidden text-xs font-semibold text-violet-100 sm:block">Login</button>
            <button onClick={onBooking} className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-[#5741cb] shadow-lg">
              Plan your event <ArrowRight size={14} className="ml-1 inline"/>
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="relative overflow-hidden bg-[#211d4a] text-white">
          <div className="absolute -right-20 top-0 h-[480px] w-[480px] rounded-full bg-violet-500/20 blur-3xl"/>
          <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
            <div className="relative z-10">
              <Badge tone="violet">The smarter way to celebrate</Badge>
              <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.03] tracking-[-0.06em] sm:text-6xl">
                Plan your perfect event, <span className="text-violet-300">without the stress.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-violet-100/75">
                From venue selection and trusted vendors to payments and event coordination, manage your entire event from one simple platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={onBooking} className="rounded-xl bg-[#8069ef] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30">
                  Start planning <ArrowRight size={16} className="ml-1 inline"/>
                </button>
                <button onClick={() => document.getElementById('packages')?.scrollIntoView({behavior:'smooth'})} className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white">
                  Explore packages
                </button>
              </div>
              <div className="mt-10 flex items-center gap-8 border-t border-white/10 pt-6">
                <div>
                  <p className="text-xl font-semibold">500+</p>
                  <p className="text-[11px] text-violet-200/60">Events managed</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">98%</p>
                  <p className="text-[11px] text-violet-200/60">Client satisfaction</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">24/7</p>
                  <p className="text-[11px] text-violet-200/60">Event support</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-2 shadow-2xl shadow-black/20">
                <div className="relative h-[380px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#d5b0b0] via-[#8f7895] to-[#3d365f]">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center mix-blend-overlay opacity-80"/>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <p className="text-xs text-white/70">Featured celebration</p>
                    <p className="mt-1 text-lg font-semibold">Amelia & James · The Glasshouse</p>
                  </div>
                  <div className="absolute left-5 top-5 rounded-2xl bg-white/95 p-3 text-slate-800 shadow-xl">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100 text-violet-600">
                        <CalendarDays size={15}/>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold">Wedding package</p>
                        <p className="text-[9px] text-slate-500">Oct 18, 2026</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-5 rounded-2xl bg-white/95 p-3 text-slate-800 shadow-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={17} className="text-emerald-500"/>
                      <div>
                        <p className="text-[10px] font-bold">Booking confirmed</p>
                        <p className="text-[9px] text-slate-500">87% event progress</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-b border-slate-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-14 gap-y-5 px-5 text-center lg:justify-between lg:px-8">
            <div>
              <p className="text-2xl font-semibold text-[#1d2944]">500<span className="text-violet-500">+</span></p>
              <p className="text-xs text-slate-500">Events managed</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1d2944]">120<span className="text-violet-500">+</span></p>
              <p className="text-xs text-slate-500">Trusted vendors</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1d2944]">98<span className="text-violet-500">%</span></p>
              <p className="text-xs text-slate-500">Customer satisfaction</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1d2944]">24<span className="text-violet-500">/7</span></p>
              <p className="text-xs text-slate-500">Event support</p>
            </div>
          </div>
        </section>
        <section id="services" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Everything in one place</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Everything you need to plan an unforgettable event.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">One beautifully simple workspace for every detail, every decision, and every person involved.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[[Building2,'Venue management','Find the perfect space and keep every detail on schedule.'],[Package,'Catering','Curated menus and seamless service for every guest.'],[Sparkles,'Decoration','Bring your vision to life with our creative partners.'],[Users,'Event coordination','A dedicated team to make it all feel effortless.']].map(([Icon,title,desc]:any)=>(
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f0edff] text-[#684fe1]">
                  <Icon size={19}/>
                </div>
                <h3 className="mt-5 text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
                <button onClick={onBooking} className="mt-5 text-xs font-semibold text-violet-600">Explore <ArrowRight size={13} className="ml-1 inline"/></button>
              </div>
            ))}
          </div>
        </section>
        <section id="packages" className="bg-[#f4f2ff] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Made for your moment</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Popular event packages</h2>
                <p className="mt-3 text-sm text-slate-500">Start with a proven plan, then make it entirely yours.</p>
              </div>
              <button onClick={onBooking} className="text-xs font-semibold text-violet-600">View all packages <ArrowRight size={14} className="ml-1 inline"/></button>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[['Elegant Wedding','A timeless celebration, beautifully coordinated.','LKR 450,000','photo-1519225421980-715cb0215aed'],['Corporate Conference','A polished experience for your next big idea.','LKR 280,000','photo-1497366754035-f200968a6e72'],['Birthday Celebration','Make their day feel like the main event.','LKR 160,000','photo-1530103862676-de8c9debad1d']].map(([title,desc,price,img])=>(
                <article key={title as string} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="h-44 bg-cover bg-center" style={{backgroundImage:`url(https://images.unsplash.com/${img}?auto=format&fit=crop&w=800&q=80)`}}/>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{title}</h3>
                      <span className="text-amber-500 text-xs">★★★★★</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400">Starting from</p>
                        <p className="mt-0.5 text-base font-semibold">{price}</p>
                      </div>
                      <button onClick={onBooking} className="rounded-lg bg-[#654ce6] px-3 py-2 text-[11px] font-semibold text-white">View package</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="how" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Simple by design</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">From idea to unforgettable.</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[['01','Choose your package','Pick a starting point that feels like you.'],['02','Submit your booking','Tell us the details and we\'ll take it from here.'],['03','Coordinate with our team','Collaborate with your dedicated event team.'],['04','Enjoy your event','Be present for the moments that matter.']].map(([n,t,d])=>(
              <div key={n} className="relative text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#211d4a] text-sm font-semibold text-white">{n}</div>
                <h3 className="mt-5 text-sm font-semibold">{t}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="stories" className="bg-[#211d4a] px-5 py-16 text-white lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-300">Your next chapter starts here</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.05em]">Ready to start planning your event?</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-violet-100/70">Create your event, choose your services, and let our team handle the details.</p>
            <div className="mt-7 flex gap-3">
              <button onClick={onBooking} className="rounded-xl bg-[#8069ef] px-5 py-3 text-sm font-semibold">Start planning <ArrowRight size={15} className="ml-1 inline"/></button>
              <button onClick={onEnter} className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold">Log in</button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#15132f] px-5 py-12 text-violet-100/60 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row">
          <div>
            <Logo light/>
            <p className="mt-4 max-w-xs text-xs leading-5">The calmer way to plan remarkable events.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-xs sm:grid-cols-3">
            <a href="#services">Services</a>
            <a href="#packages">Packages</a>
            <a href="#how">How it works</a>
            <a href="#stories">Contact</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-5 text-[10px]">© 2026 EventFlow. All rights reserved.</div>
      </footer>
    </div>
  )
}

function LoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: (role: 'operations' | 'coordinator') => void }) {
  const [selectedRole, setSelectedRole] = useState<'operations' | 'coordinator'>('operations')
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#151332]/70 p-5 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="login-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d55ed]">Team access</p>
            <h2 id="login-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#1d2944]">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Choose your workspace to continue.</p>
          </div>
          <button onClick={onClose} aria-label="Close login" className="rounded-xl p-2 text-slate-400 hover:bg-slate-50">
            <X size={18}/>
          </button>
        </div>
        <div className="mt-7 space-y-3">
          <button onClick={() => setSelectedRole('operations')} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${selectedRole === 'operations' ? 'border-[#8069ef] bg-[#f5f3ff]' : 'border-slate-200 hover:border-violet-200'}`}>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-600">
              <ShieldCheck size={20}/>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Operations Manager</p>
              <p className="mt-1 text-xs text-slate-500">Manage the whole business, finance, vendors, and team.</p>
            </div>
            {selectedRole === 'operations' && <CheckCircle2 className="ml-auto text-[#6d55ed]" size={18}/>}
          </button>
          <button onClick={() => setSelectedRole('coordinator')} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${selectedRole === 'coordinator' ? 'border-[#8069ef] bg-[#f5f3ff]' : 'border-slate-200 hover:border-violet-200'}`}>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-600">
              <CalendarDays size={20}/>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Event Coordinator</p>
              <p className="mt-1 text-xs text-slate-500">Manage assigned events, tasks, vendors, and client updates.</p>
            </div>
            {selectedRole === 'coordinator' && <CheckCircle2 className="ml-auto text-[#6d55ed]" size={18}/>}
          </button>
        </div>
        <button onClick={() => onLogin(selectedRole)} className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#654ce6] text-sm font-semibold text-white shadow-[0_6px_14px_rgba(101,76,230,0.22)] hover:bg-[#5540cb]">
          Continue to dashboard <ArrowRight size={16}/>
        </button>
        <p className="mt-4 text-center text-[11px] text-slate-400">Demo access · select a role to preview its dashboard</p>
      </div>
    </div>
  )
}

export default function EventFlowApp() {
  const [publicView, setPublicView] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [role, setRole] = useState<'operations' | 'coordinator'>('operations')
  const [active, setActive] = useState('Dashboard')
  const [mobileNav, setMobileNav] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [theme, setTheme] = useState(false)

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  if (publicView) {
    return (
      <>
        <Landing onEnter={() => setShowLogin(true)} onBooking={() => setShowLogin(true)} />
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={(selectedRole) => { setRole(selectedRole); setShowLogin(false); setPublicView(false) }} />}
      </>
    )
  }

  return <RoleDashboard role={role} active={active} setActive={setActive} search={search} setSearch={setSearch} notify={notify} onPublic={() => setPublicView(true)} mobileNav={mobileNav} setMobileNav={setMobileNav} />
}
