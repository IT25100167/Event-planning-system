import { auth } from './auth.js';
import { toast } from './toast.js';
import { LoginPage } from './pages/login.js';
import { RegisterPage } from './pages/register.js';
import { DashboardPage } from './pages/dashboard.js';
import { UsersPage } from './pages/users.js';
import { ProfilePage } from './pages/profile.js';
import { EventsPage } from './pages/events.js';

const routes = {
  '/login': { page: LoginPage, isPublic: true, title: 'Sign In' },
  '/register': { page: RegisterPage, isPublic: true, title: 'Create Account' },
  '/dashboard': { page: DashboardPage, isPublic: false, title: 'Dashboard' },
  '/users': { page: UsersPage, isPublic: false, adminOnly: true, title: 'User Management' },
  '/events': { page: EventsPage, isPublic: false, title: 'Events Workspace' },
  '/profile': { page: ProfilePage, isPublic: false, title: 'My Profile' },
};

export const router = {
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  async handleRoute() {
    const rawHash = window.location.hash.slice(1) || '/dashboard';
    const cleanPath = rawHash.split('?')[0] || '/dashboard';

    const route = routes[cleanPath] || routes['/dashboard'];

    // Auth guard
    if (!route.isPublic && !auth.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    // Redirect logged in users away from login/register
    if (route.isPublic && auth.isAuthenticated()) {
      window.location.hash = '#/dashboard';
      return;
    }

    // Role guard for Admin-only routes
    if (route.adminOnly && !auth.isAdmin()) {
      toast.warning('Access denied: Administrator permissions required.');
      window.location.hash = '#/dashboard';
      return;
    }

    // Render Shell Layout vs Auth Layout
    const appContainer = document.getElementById('app');
    const isAuthPage = route.isPublic;

    document.getElementById('sidebar-container').style.display = isAuthPage ? 'none' : 'flex';
    document.getElementById('topbar-container').style.display = isAuthPage ? 'none' : 'flex';
    appContainer.className = isAuthPage ? 'auth-mode' : 'app-container';

    // Update Title
    document.title = `${route.title} - SLIIT Event Planning`;
    const titleEl = document.getElementById('page-current-title');
    if (titleEl) titleEl.innerText = route.title;

    // Update active nav links
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href === `#${cleanPath}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Render View
    const contentArea = document.getElementById('content-viewport');
    contentArea.innerHTML = await route.page.render();
    if (typeof route.page.attachEvents === 'function') {
      route.page.attachEvents();
    }
  }
};
