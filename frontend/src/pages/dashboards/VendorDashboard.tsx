import React, { useState, useEffect } from 'react';
import {
  Bell, CheckCircle2, ChevronRight, ClipboardList,
  LayoutDashboard, Menu, MoreHorizontal,
  Package, Search, Settings, Sparkles, UserRound,
  X, CalendarDays, WalletCards, Briefcase, Plus, Trash2, Edit2
} from 'lucide-react';

const VENDOR_ID = 1; // Hardcoded for MVP
const API_BASE = 'http://localhost:8080';

// Helper function for authenticated fetch
const authFetch = async (url: string, options?: RequestInit) => {
  const token = localStorage.getItem('authToken');
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    }
  });
};

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

export default function VendorDashboard({ onNavigateToPublic, onNotify }: any) {
  const [active, setActive] = useState('Dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  
  // Data
  const [profile, setProfile] = useState<any>({});
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);

  // Modals
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({ id: '', name: '', category: '', price: '', capacity: '' });
  
  const [showAvailModal, setShowAvailModal] = useState(false);
  const [availForm, setAvailForm] = useState({ id: '', date: '', start: '08:00', end: '17:00', blocked: false });

  // Custom UI Modals for Confirm and Prompt
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void}>({isOpen: false, title: '', message: '', onConfirm: () => {}});
  const [promptDialog, setPromptDialog] = useState<{isOpen: boolean, title: string, message: string, onSubmit: (val: string) => void}>({isOpen: false, title: '', message: '', onSubmit: () => {}});
  const [promptInput, setPromptInput] = useState('');

  const fetchData = async () => {
    try {
      const [profRes, servRes, bookRes, availRes] = await Promise.all([
        authFetch(`${API_BASE}/api/vendor/${VENDOR_ID}/profile`),
        authFetch(`${API_BASE}/api/vendor/${VENDOR_ID}/services`),
        authFetch(`${API_BASE}/api/vendor/${VENDOR_ID}/bookings`),
        authFetch(`${API_BASE}/api/vendor/${VENDOR_ID}/availability`)
      ]);
      if(profRes.ok) setProfile(await profRes.json());
      if(servRes.ok) setServices(await servRes.json());
      if(bookRes.ok) setBookings(await bookRes.json());
      if(availRes.ok) setAvailability(await availRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();
    try {
      await authFetch(`${API_BASE}/api/vendor/${VENDOR_ID}/profile`, {
        method: 'PUT',
        body: JSON.stringify(profile)
      });
      onNotify('Profile updated successfully!');
    } catch(e) {
      onNotify('Error updating profile');
    }
  };

  const handleSaveService = async (e: any) => {
    e.preventDefault();
    const isEdit = !!serviceForm.id;
    const url = isEdit ? `${API_BASE}/api/vendor/services/${serviceForm.id}` : `${API_BASE}/api/vendor/services`;
    const payload = { vendorId: VENDOR_ID, ...serviceForm, description: '' };
    try {
      await authFetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });
      onNotify('Service saved!');
      setShowServiceModal(false);
      fetchData();
    } catch {
      onNotify('Error saving service');
    }
  };

  const handleDeleteService = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Service',
      message: 'Are you sure you want to delete this service?',
      onConfirm: async () => {
        try {
          const res = await authFetch(`${API_BASE}/api/vendor/services/${id}`, { method: 'DELETE' });
          if(!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message || "Cannot delete because of active bookings.");
          }
          onNotify('Service deleted');
          fetchData();
        } catch(e: any) {
          onNotify(e.message || 'Error deleting');
        }
      }
    });
  };

  const handleSaveAvail = async (e: any) => {
    e.preventDefault();
    const payload = {
      vendorId: VENDOR_ID,
      id: availForm.id || null,
      slotDate: availForm.date,
      startTime: availForm.start.length === 5 ? availForm.start + ':00' : availForm.start,
      endTime: availForm.end.length === 5 ? availForm.end + ':00' : availForm.end,
      blocked: availForm.blocked
    };
    try {
      await authFetch(`${API_BASE}/api/vendor/availability`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      onNotify('Availability saved!');
      setShowAvailModal(false);
      fetchData();
    } catch {
      onNotify('Error saving availability');
    }
  };

  const handleDeleteAvail = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Availability',
      message: 'Are you sure you want to delete this availability slot?',
      onConfirm: async () => {
        try {
          await authFetch(`${API_BASE}/api/vendor/availability/${id}`, { method: 'DELETE' });
          onNotify('Slot deleted');
          fetchData();
        } catch {
          onNotify('Error deleting');
        }
      }
    });
  };

  const handleBookingStatus = async (id: number, status: string) => {
    try {
      await authFetch(`${API_BASE}/api/vendor/bookings/${id}/status?status=${status}`, { method: 'PATCH' });
      onNotify(`Booking ${status.toLowerCase()}`);
      fetchData();
    } catch {
      onNotify('Error updating status');
    }
  };

  const handleRejectBooking = (id: number) => {
    setPromptInput('');
    setPromptDialog({
      isOpen: true,
      title: 'Reject Booking',
      message: 'Please provide a reason for rejection:',
      onSubmit: async (reason: string) => {
        try {
          await authFetch(`${API_BASE}/api/vendor/bookings/${id}/status?status=CANCELLED&reason=${encodeURIComponent(reason)}`, { method: 'PATCH' });
          onNotify(`Booking rejected`);
          fetchData();
        } catch {
          onNotify('Error updating status');
        }
      }
    });
  };

  const navItems = [
    ['Dashboard', LayoutDashboard],
    ['Profile', UserRound],
    ['Services', Package],
    ['Availability', CalendarDays],
    ['Bookings', ClipboardList],
    ['Payments', WalletCards]
  ];

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
          <p className="mt-2 text-sm font-semibold">Vendor / Service</p>
          <p className="mt-1 text-[11px] text-slate-500">{profile.name || 'Loading...'}</p>
        </div>
        <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {navItems.map(([label, Icon]: any) => (
            <button key={label} onClick={() => {setActive(label);setMobileNav(false)}} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold ${active === label ? 'bg-[#eeeaff] text-[#6048d7]' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Icon size={16}/>
              {label}
            </button>
          ))}
        </nav>
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
            <button onClick={onNavigateToPublic} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 sm:block">
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic View */}
        <main className="mx-auto max-w-[1500px] p-5 md:p-8">
          
          {active === 'Dashboard' && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">Dashboard</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 mb-1">COMPANY</p>
                  <p className="text-xl font-bold">{profile.name || 'N/A'}</p>
                  <p className="text-xs text-slate-400 mt-1">{profile.email}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 mb-1">TOTAL SERVICES</p>
                  <p className="text-2xl font-bold">{services.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 mb-1">TOTAL BOOKINGS</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </div>
          )}

          {active === 'Profile' && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">Vendor Profile</h2>
              <form onSubmit={handleUpdateProfile} className="max-w-md bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">COMPANY NAME</label>
                  <input required value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">PHONE</label>
                  <input required value={profile.phoneNum || ''} onChange={e => setProfile({...profile, phoneNum: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">EMAIL</label>
                  <input required type="email" value={profile.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
                <button type="submit" className="w-full rounded-xl bg-[#6d55ed] py-2 text-sm font-semibold text-white hover:bg-[#5b43d6]">Save Changes</button>
              </form>
            </div>
          )}

          {active === 'Services' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Services</h2>
                <button onClick={() => { setServiceForm({id:'', name:'', category:'', price:'', capacity:''}); setShowServiceModal(true); }} className="rounded-xl bg-[#6d55ed] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5b43d6]">Add Service</button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr><th className="p-4 font-semibold">NAME</th><th className="p-4 font-semibold">CATEGORY</th><th className="p-4 font-semibold">PRICE</th><th className="p-4 font-semibold">CAPACITY</th><th className="p-4 font-semibold"></th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {services.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium">{s.name}</td>
                        <td className="p-4 text-slate-500">{s.category}</td>
                        <td className="p-4 text-slate-500">LKR {s.price}</td>
                        <td className="p-4 text-slate-500">{s.capacity}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => { setServiceForm(s); setShowServiceModal(true); }} className="text-violet-600 hover:text-violet-800 mr-3 text-xs font-semibold">Edit</button>
                          <button onClick={() => handleDeleteService(s.id)} className="text-red-600 hover:text-red-800 text-xs font-semibold">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {services.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-slate-500">No services found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === 'Availability' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Availability Slots</h2>
                <button onClick={() => { setAvailForm({id:'', date:'', start:'08:00', end:'17:00', blocked:false}); setShowAvailModal(true); }} className="rounded-xl bg-[#6d55ed] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5b43d6]">Add Slot</button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr><th className="p-4 font-semibold">DATE</th><th className="p-4 font-semibold">START</th><th className="p-4 font-semibold">END</th><th className="p-4 font-semibold">BLOCKED</th><th className="p-4 font-semibold"></th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {availability.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium">{a.slotDate}</td>
                        <td className="p-4 text-slate-500">{a.startTime.substring(0,5)}</td>
                        <td className="p-4 text-slate-500">{a.endTime.substring(0,5)}</td>
                        <td className="p-4 text-slate-500"><Badge tone={a.blocked ? 'red' : 'green'}>{a.blocked ? 'Yes' : 'No'}</Badge></td>
                        <td className="p-4 text-right">
                          <button onClick={() => { setAvailForm({id:a.id, date:a.slotDate, start:a.startTime.substring(0,5), end:a.endTime.substring(0,5), blocked:a.blocked}); setShowAvailModal(true); }} className="text-violet-600 hover:text-violet-800 mr-3 text-xs font-semibold">Edit</button>
                          <button onClick={() => handleDeleteAvail(a.id)} className="text-red-600 hover:text-red-800 text-xs font-semibold">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {availability.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-slate-500">No availability slots.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === 'Bookings' && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">Event Bookings</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr><th className="p-4 font-semibold">ID</th><th className="p-4 font-semibold">DATE</th><th className="p-4 font-semibold">SERVICE</th><th className="p-4 font-semibold">STATUS</th><th className="p-4 font-semibold text-right">ACTIONS</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium">#{b.id}</td>
                        <td className="p-4 text-slate-500">{b.bookingDate}</td>
                        <td className="p-4 text-slate-500">Service #{b.serviceId}</td>
                        <td className="p-4"><Badge tone={b.status === 'CONFIRMED' ? 'green' : b.status === 'CANCELLED' ? 'red' : 'amber'}>{b.status}</Badge></td>
                        <td className="p-4 text-right">
                          {b.status !== 'CONFIRMED' && b.status !== 'CANCELLED' && (
                            <button onClick={() => handleBookingStatus(b.id, 'CONFIRMED')} className="text-emerald-600 hover:text-emerald-800 mr-3 text-xs font-semibold">Confirm</button>
                          )}
                          {b.status !== 'CANCELLED' && (
                            <button onClick={() => handleRejectBooking(b.id)} className="text-red-600 hover:text-red-800 text-xs font-semibold">Reject</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-slate-500">No bookings found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === 'Payments' && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">Payments</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr><th className="p-4 font-semibold">BOOKING</th><th className="p-4 font-semibold">DATE</th><th className="p-4 font-semibold">PAYMENT STATUS</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium">#{b.id}</td>
                        <td className="p-4 text-slate-500">{b.bookingDate}</td>
                        <td className="p-4"><Badge tone={b.paymentStatus === 'PAID' ? 'green' : 'amber'}>{b.paymentStatus === 'PAID' ? 'RECEIVED' : 'PENDING'}</Badge></td>
                      </tr>
                    ))}
                    {bookings.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-slate-500">No payments found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <form onSubmit={handleSaveService} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold">{serviceForm.id ? 'Edit' : 'Add'} Service</h3>
            <div className="space-y-4">
              <div><label className="text-xs font-semibold text-slate-500">NAME</label><input required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500" /></div>
              <div><label className="text-xs font-semibold text-slate-500">CATEGORY</label><input required value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500" /></div>
              <div><label className="text-xs font-semibold text-slate-500">PRICE</label><input required type="number" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500" /></div>
              <div><label className="text-xs font-semibold text-slate-500">CAPACITY</label><input required type="number" value={serviceForm.capacity} onChange={e => setServiceForm({...serviceForm, capacity: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500" /></div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowServiceModal(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Avail Modal */}
      {showAvailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <form onSubmit={handleSaveAvail} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold">{availForm.id ? 'Edit' : 'Add'} Availability</h3>
            <div className="space-y-4">
              <div><label className="text-xs font-semibold text-slate-500">DATE</label><input required type="date" value={availForm.date} onChange={e => setAvailForm({...availForm, date: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500" /></div>
              <div><label className="text-xs font-semibold text-slate-500">START</label><input required type="time" value={availForm.start} onChange={e => setAvailForm({...availForm, start: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500" /></div>
              <div><label className="text-xs font-semibold text-slate-500">END</label><input required type="time" value={availForm.end} onChange={e => setAvailForm({...availForm, end: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={availForm.blocked} onChange={e => setAvailForm({...availForm, blocked: e.target.checked})} /> <label className="text-sm font-semibold">Blocked</label></div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowAvailModal(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Custom Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold">{confirmDialog.title}</h3>
            <p className="text-sm text-slate-600 mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog({...confirmDialog, isOpen: false}); }} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Prompt Dialog */}
      {promptDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <form onSubmit={(e) => { e.preventDefault(); promptDialog.onSubmit(promptInput); setPromptDialog({...promptDialog, isOpen: false}); }} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold">{promptDialog.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{promptDialog.message}</p>
            <input autoFocus required value={promptInput} onChange={e => setPromptInput(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 mb-6" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setPromptDialog({...promptDialog, isOpen: false})} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Submit</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}