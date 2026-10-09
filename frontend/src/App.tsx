import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import { LoginSuccessData } from './auth/LoginPage';

import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import OperationsManagerDashboard from './pages/dashboards/OperationsManagerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

import UsersManagementPage from './pages/UsersManagementPage';
import ActivityLogsPage from './pages/ActivityLogsPage';
import { Bell, CheckCircle2, AlertTriangle, X } from 'lucide-react';

type Page =
    | 'landing'
    | 'login'
    | 'register'
    | 'dashboard'
    | 'activityLogs'
    | 'users';

function App() {
  // Start at landing page
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  // Initialize user from localStorage if previously logged in
  const [user, setUser] = useState<LoginSuccessData | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [toast, setToast] = useState('');

  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3500);
  };

  const handleLoginSuccess = (userData: LoginSuccessData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('dashboard');
    notify(`Welcome back, ${userData.name || 'User'}!`);
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('login');
    notify('Registration successful! Please login.');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setCurrentPage('landing');
    notify('Logged out successfully');
  };

  switch (currentPage) {
    case 'landing':
      return (
          <LandingPage
              onEnter={() => setCurrentPage('login')}
              onBooking={() => setCurrentPage('register')}
          />
      );

    case 'login':
      return (
          <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() =>
                  setCurrentPage('register')
              }
          />
      );

    case 'register':
      return (
          <RegisterPage
              onRegisterSuccess={handleRegisterSuccess}
              onNavigateToLogin={() =>
                  setCurrentPage('login')
              }
          />
      );

    case 'dashboard':
      if (!user) {
        setCurrentPage('login');
        return null;
      }

      return (
          <>
            {/* Authenticated Top Banner */}
            <div className="bg-slate-900 text-slate-200 px-6 py-2.5 flex items-center justify-between text-xs border-b border-slate-800 sticky top-0 z-50">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>

                <span className="text-slate-400">
                                Signed in as:
                            </span>

                <span className="font-semibold text-white">
                                {user.name}
                            </span>

                <span className="rounded-full bg-violet-900/60 border border-violet-500/40 text-violet-300 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                                {user.role}
                            </span>
              </div>

              <div className="flex items-center gap-3">
                {user.role === 'ADMIN' && (
                    <button
                        onClick={() =>
                            setCurrentPage('activityLogs')
                        }
                        className="text-slate-400 hover:text-white transition"
                    >
                      Activity Logs
                    </button>
                )}

                <button
                    onClick={() =>
                        setCurrentPage('landing')
                    }
                    className="text-slate-400 hover:text-white transition"
                >
                  Public Site
                </button>

                <span className="text-slate-700">|</span>

                <button
                    onClick={handleLogout}
                    className="rounded-lg bg-rose-600/90 hover:bg-rose-600 px-3 py-1 font-semibold text-white transition shadow-sm"
                >
                  Log out
                </button>
              </div>
            </div>

            {/* Admin, Operations Manager and Customer dashboards */}
            {user.role === 'ADMIN' ? (
                <AdminDashboard
                    onNavigate={(page) =>
                        setCurrentPage(page as Page)
                    }
                />
            ) : user.role === 'OPERATIONS_MANAGER' ? (
                <OperationsManagerDashboard
                    user={user}
                    onNotify={notify}
                    onNavigateToPublic={() =>
                        setCurrentPage('landing')
                    }
                />
            ) : user.role === 'CUSTOMER' ? (
                <CustomerDashboard
                    onNotify={notify}
                    onNavigateToPublic={() =>
                        setCurrentPage('landing')
                    }
                />
            ) : (
                /* Fallback for roles without an active dashboard */
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                  <div className="text-center p-8">
                    <h2 className="text-xl font-semibold text-slate-800">
                      Dashboard Unavailable
                    </h2>

                    <p className="mt-2 text-slate-600">
                      Your role does not have a dashboard
                      available. Please contact the system
                      administrator.
                    </p>

                    <button
                        onClick={handleLogout}
                        className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-white"
                    >
                      Log out
                    </button>
                  </div>
                </div>
            )}
          </>
      );

    case 'users':
      if (!user || user.role !== 'ADMIN') {
        setCurrentPage('login');
        return null;
      }

      return (
          <>
            <div className="bg-slate-900 text-slate-200 px-6 py-2.5 flex items-center justify-between text-xs border-b border-slate-800 sticky top-0 z-50">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>

                <span className="text-slate-400">
                                Signed in as:
                            </span>

                <span className="font-semibold text-white">
                                {user.name}
                            </span>

                <span className="rounded-full bg-violet-900/60 border border-violet-500/40 text-violet-300 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                                {user.role}
                            </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                    onClick={() =>
                        setCurrentPage('dashboard')
                    }
                    className="text-slate-400 hover:text-white transition"
                >
                  Admin Dashboard
                </button>

                <span className="text-slate-700">|</span>

                <button
                    onClick={handleLogout}
                    className="rounded-lg bg-rose-600/90 hover:bg-rose-600 px-3 py-1 font-semibold text-white transition shadow-sm"
                >
                  Log out
                </button>
              </div>
            </div>

            <UsersManagementPage onNotify={notify} />

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-2xl shadow-slate-900/10">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                      {toast.toLowerCase().includes('success') ||
                      toast.toLowerCase().includes('updated') ||
                      toast.toLowerCase().includes('deleted') ? (
                          <CheckCircle2
                              size={16}
                              className="text-emerald-600"
                          />
                      ) : toast.toLowerCase().includes('failed') ||
                      toast.toLowerCase().includes('error') ||
                      toast.toLowerCase().includes('cannot') ? (
                          <AlertTriangle
                              size={16}
                              className="text-red-600"
                          />
                      ) : (
                          <Bell
                              size={16}
                              className="text-violet-600"
                          />
                      )}
                    </div>

                    <p className="text-sm font-medium text-slate-800">
                      {toast}
                    </p>

                    <button
                        onClick={() => setToast('')}
                        className="ml-2 rounded-lg p-1 hover:bg-slate-100"
                    >
                      <X
                          size={14}
                          className="text-slate-400"
                      />
                    </button>
                  </div>
                </div>
            )}
          </>
      );

    case 'activityLogs':
      if (!user || user.role !== 'ADMIN') {
        setCurrentPage('login');
        return null;
      }

      return (
          <>
            <div className="bg-slate-900 text-slate-200 px-6 py-2.5 flex items-center justify-between text-xs border-b border-slate-800 sticky top-0 z-50">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>

                <span className="text-slate-400">
                                Signed in as:
                            </span>

                <span className="font-semibold text-white">
                                {user.name}
                            </span>

                <span className="rounded-full bg-violet-900/60 border border-violet-500/40 text-violet-300 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                                {user.role}
                            </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                    onClick={() =>
                        setCurrentPage('dashboard')
                    }
                    className="text-slate-400 hover:text-white transition"
                >
                  User Management
                </button>

                <span className="text-slate-700">|</span>

                <button
                    onClick={handleLogout}
                    className="rounded-lg bg-rose-600/90 hover:bg-rose-600 px-3 py-1 font-semibold text-white transition shadow-sm"
                >
                  Log out
                </button>
              </div>
            </div>

            <ActivityLogsPage onNotify={notify} />

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-2xl">
                    <p className="text-sm font-medium text-slate-800">
                      {toast}
                    </p>

                    <button
                        onClick={() => setToast('')}
                        className="rounded-lg p-1 hover:bg-slate-100"
                    >
                      <X
                          size={14}
                          className="text-slate-400"
                      />
                    </button>
                  </div>
                </div>
            )}
          </>
      );

    default:
      return (
          <LandingPage
              onEnter={() => setCurrentPage('login')}
              onBooking={() => setCurrentPage('register')}
          />
      );
  }
}

export default App;