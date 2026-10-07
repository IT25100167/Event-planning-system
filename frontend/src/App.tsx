import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import { LoginSuccessData } from './auth/LoginPage';
import OperationsManagerDashboard from './pages/dashboards/OperationsManagerDashboard';
import VendorDashboard from './pages/dashboards/VendorDashboard';
import { Bell, CheckCircle2, AlertTriangle, X } from 'lucide-react';

type Page = 'landing' | 'login' | 'register' | 'dashboard';

function App() {
  // Start at landing page
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<LoginSuccessData | null>(null);
  const [toast, setToast] = useState('');

  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3500);
  };

  const handleLoginSuccess = (userData: LoginSuccessData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('dashboard');
    notify('Login successful!');
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
          onNavigateToRegister={() => setCurrentPage('register')}
        />
      );

    case 'register':
      
      return (
        <RegisterPage 
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      );

    case 'dashboard':
      if (!user) {
        setCurrentPage('login');
        return null;
      }

      return (
        <>
          {user.role === 'VENDOR' ? (
            <VendorDashboard 
              onNotify={notify}
              onNavigateToPublic={() => setCurrentPage('landing')}
            />
          ) : (
            <OperationsManagerDashboard 
              onNotify={notify}
              onNavigateToPublic={() => setCurrentPage('landing')}
            />
          )}
          
          {/* Toast Notification */}
          {toast && (
            <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-2xl shadow-slate-900/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                  {toast.toLowerCase().includes('success') || toast.toLowerCase().includes('updated') || toast.toLowerCase().includes('deleted') ? (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  ) : toast.toLowerCase().includes('error') || toast.toLowerCase().includes('failed') || toast.toLowerCase().includes('cannot') || toast.toLowerCase().includes('not') ? (
                    <AlertTriangle size={16} className="text-red-600" />
                  ) : (
                    <Bell size={16} className="text-violet-600" />
                  )}
                </div>
                <p className="text-sm font-medium text-slate-800">{toast}</p>
                <button onClick={() => setToast('')} className="ml-2 rounded-lg p-1 hover:bg-slate-100">
                  <X size={14} className="text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </>
      );

    default:
      return <LandingPage onEnter={() => setCurrentPage('login')} onBooking={() => setCurrentPage('register')} />;
  }
}

export default App;
