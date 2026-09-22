import { auth } from './auth.js';
import { router } from './router.js';

function updateSidebarUser() {
  const user = auth.getUser();
  const card = document.getElementById('sidebar-user-card');
  const adminNav = document.getElementById('nav-users-link');

  if (!user) {
    if (card) card.style.display = 'none';
    if (adminNav) adminNav.style.display = 'none';
    return;
  }

  if (card) {
    card.style.display = 'flex';
    document.getElementById('sidebar-user-avatar').innerText = (user.name || 'U').charAt(0).toUpperCase();
    document.getElementById('sidebar-user-name').innerText = user.name || 'User';
    document.getElementById('sidebar-user-role').innerText = user.role || 'CUSTOMER';
  }

  // Show or hide Users menu item based on role
  if (adminNav) {
    adminNav.style.display = auth.isAdmin() ? 'flex' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateSidebarUser();

  // Listen to session changes
  window.addEventListener('auth:change', () => {
    updateSidebarUser();
  });

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      auth.logout();
    });
  }

  // Mobile sidebar toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar-container');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }

  // Start Router
  router.init();
});
