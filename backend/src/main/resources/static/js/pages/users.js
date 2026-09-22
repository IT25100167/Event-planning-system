import { api } from '../api.js';
import { modal } from '../modal.js';
import { toast } from '../toast.js';

export const UsersPage = {
  allUsers: [],

  render() {
    return `
      <div class="animate-fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 style="font-size: 26px; margin-bottom: 4px;">User Management</h1>
            <p style="color: var(--text-muted); font-size: 14px;">Manage accounts, roles, permissions, and security credentials</p>
          </div>
          <button id="add-user-btn" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>Add New User</span>
          </button>
        </div>

        <!-- Filter & Search Bar -->
        <div class="glass-panel" style="padding: 16px 20px; margin-bottom: 24px; display: flex; gap: 16px; flex-wrap: wrap;">
          <div class="input-with-icon" style="flex: 1; min-width: 240px;">
            <span class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input type="text" id="user-search-input" class="form-control" placeholder="Search by name, email, or phone..." />
          </div>

          <div style="width: 200px;">
            <select id="user-role-filter" class="form-control">
              <option value="">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="OPERATIONS_MANAGER">OPERATIONS MANAGER</option>
              <option value="EVENT_COORDINATOR">EVENT COORDINATOR</option>
              <option value="FINANCE_OFFICER">FINANCE OFFICER</option>
              <option value="VENDOR">VENDOR</option>
              <option value="CUSTOMER">CUSTOMER</option>
            </select>
          </div>
        </div>

        <!-- Users Table -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 70px;">ID</th>
                <th>User Details</th>
                <th>Phone Number</th>
                <th>System Role</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody id="users-table-body">
              <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-dim);">
                  Loading users from server...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async attachEvents() {
    await this.loadUsers();

    // Search and filter listeners
    const searchInput = document.getElementById('user-search-input');
    const roleFilter = document.getElementById('user-role-filter');
    const addUserBtn = document.getElementById('add-user-btn');

    searchInput.addEventListener('input', () => this.filterAndRenderTable());
    roleFilter.addEventListener('change', () => this.filterAndRenderTable());

    addUserBtn.addEventListener('click', () => this.openAddUserModal());
  },

  async loadUsers() {
    try {
      const users = await api.users.getAll();
      this.allUsers = Array.isArray(users) ? users : [];
      this.filterAndRenderTable();
    } catch (error) {
      console.warn('Backend unavailable, using demo users:', error.message);
      this.allUsers = [
        { userId: 1, name: 'Kasun Bandara', email: 'admin@sliit.lk', phoneNum: '0771234567', role: 'ADMIN' },
        { userId: 2, name: 'Saman Perera', email: 'saman@sliit.lk', phoneNum: '0719876543', role: 'EVENT_COORDINATOR' },
        { userId: 3, name: 'Anura Fernando', email: 'anura@sliit.lk', phoneNum: '0723456789', role: 'OPERATIONS_MANAGER' },
        { userId: 4, name: 'Nalaka Jayasuriya', email: 'finance@sliit.lk', phoneNum: '0754567890', role: 'FINANCE_OFFICER' },
        { userId: 5, name: 'Sound & Light Techs', email: 'vendor@audio.lk', phoneNum: '0785678901', role: 'VENDOR' },
        { userId: 6, name: 'Chamari Silva', email: 'chamari@gmail.com', phoneNum: '0766789012', role: 'CUSTOMER' }
      ];
      this.filterAndRenderTable();
      toast.info('Displaying preview users (start Spring Boot on :8080 for live DB)');
    }
  },

  filterAndRenderTable() {
    const query = document.getElementById('user-search-input')?.value.toLowerCase() || '';
    const selectedRole = document.getElementById('user-role-filter')?.value || '';

    const filtered = this.allUsers.filter(u => {
      const matchesQuery = (u.name && u.name.toLowerCase().includes(query)) ||
                           (u.email && u.email.toLowerCase().includes(query)) ||
                           (u.phoneNum && u.phoneNum.includes(query));
      const matchesRole = selectedRole ? u.role === selectedRole : true;
      return matchesQuery && matchesRole;
    });

    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-dim);">
            No users found matching your criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(user => `
      <tr>
        <td style="color: var(--text-dim); font-weight: 600;">#${user.userId}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="user-avatar" style="width: 38px; height: 38px; font-size: 14px;">
              ${(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style="font-weight: 600; color: var(--text-main);">${user.name}</div>
              <div style="font-size: 13px; color: var(--text-muted);">${user.email}</div>
            </div>
          </div>
        </td>
        <td>${user.phoneNum || '<span style="color: var(--text-dim)">N/A</span>'}</td>
        <td>
          <span class="badge badge-${user.role}">
            <span class="badge-dot"></span>
            ${user.role}
          </span>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm edit-user-btn" data-id="${user.userId}" title="Edit User">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              <span>Edit</span>
            </button>
            <button class="btn btn-secondary btn-sm change-pwd-btn" data-id="${user.userId}" title="Change Password">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>Key</span>
            </button>
            <button class="btn btn-danger btn-sm delete-user-btn" data-id="${user.userId}" data-name="${user.name}" title="Delete User">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              <span>Delete</span>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach row button actions
    tbody.querySelectorAll('.edit-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const user = this.allUsers.find(u => u.userId === id);
        if (user) this.openEditModal(user);
      });
    });

    tbody.querySelectorAll('.change-pwd-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        this.openChangePasswordModal(id);
      });
    });

    tbody.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const name = btn.getAttribute('data-name');
        this.openDeleteModal(id, name);
      });
    });
  },

  openEditModal(user) {
    modal.open({
      title: `Edit User: ${user.name}`,
      bodyHtml: `
        <form id="edit-user-form">
          <div class="form-group">
            <label class="form-label" for="edit-name">Full Name</label>
            <input type="text" id="edit-name" class="form-control" value="${user.name || ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="edit-email">Email Address</label>
            <input type="email" id="edit-email" class="form-control" value="${user.email || ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="edit-phone">Phone Number</label>
            <input type="tel" id="edit-phone" class="form-control" value="${user.phoneNum || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="edit-role">Role</label>
            <select id="edit-role" class="form-control" required>
              <option value="CUSTOMER" ${user.role === 'CUSTOMER' ? 'selected' : ''}>CUSTOMER</option>
              <option value="EVENT_COORDINATOR" ${user.role === 'EVENT_COORDINATOR' ? 'selected' : ''}>EVENT COORDINATOR</option>
              <option value="OPERATIONS_MANAGER" ${user.role === 'OPERATIONS_MANAGER' ? 'selected' : ''}>OPERATIONS MANAGER</option>
              <option value="FINANCE_OFFICER" ${user.role === 'FINANCE_OFFICER' ? 'selected' : ''}>FINANCE OFFICER</option>
              <option value="VENDOR" ${user.role === 'VENDOR' ? 'selected' : ''}>VENDOR</option>
              <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
            </select>
          </div>
        </form>
      `,
      footerHtml: `
        <button class="btn btn-secondary" onclick="window.closeModal()">Cancel</button>
        <button class="btn btn-primary" id="save-edit-btn">Save Changes</button>
      `
    });

    window.closeModal = () => modal.close();

    document.getElementById('save-edit-btn').addEventListener('click', async () => {
      const payload = {
        name: document.getElementById('edit-name').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        phoneNum: document.getElementById('edit-phone').value.trim(),
        role: document.getElementById('edit-role').value,
      };

      try {
        await api.users.update(user.userId, payload);
        toast.success('User updated successfully');
        modal.close();
        await this.loadUsers();
      } catch (error) {
        toast.error(error.message);
      }
    });
  },

  openChangePasswordModal(userId) {
    modal.open({
      title: 'Change User Password',
      bodyHtml: `
        <form id="change-pwd-form">
          <div class="form-group">
            <label class="form-label" for="current-pwd">Current Password</label>
            <input type="password" id="current-pwd" class="form-control" placeholder="Enter current password" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="new-pwd">New Password</label>
            <input type="password" id="new-pwd" class="form-control" placeholder="Enter new password (min 6 chars)" required minlength="6" />
          </div>
        </form>
      `,
      footerHtml: `
        <button class="btn btn-secondary" onclick="window.closeModal()">Cancel</button>
        <button class="btn btn-primary" id="save-pwd-btn">Update Password</button>
      `
    });

    window.closeModal = () => modal.close();

    document.getElementById('save-pwd-btn').addEventListener('click', async () => {
      const currentPassword = document.getElementById('current-pwd').value;
      const newPassword = document.getElementById('new-pwd').value;

      if (!currentPassword || !newPassword) {
        toast.warning('Please provide both current and new password.');
        return;
      }

      try {
        await api.users.changePassword(userId, { currentPassword, newPassword });
        toast.success('Password changed successfully');
        modal.close();
      } catch (error) {
        toast.error(error.message);
      }
    });
  },

  openDeleteModal(userId, userName) {
    modal.open({
      title: 'Confirm Deletion',
      bodyHtml: `
        <p style="color: var(--text-muted); line-height: 1.6;">
          Are you sure you want to delete the user account for <strong style="color: var(--text-main);">${userName}</strong> (ID: #${userId})?
        </p>
        <p style="color: var(--danger); font-size: 13px; margin-top: 12px;">
          This action cannot be undone and will revoke all access for this user.
        </p>
      `,
      footerHtml: `
        <button class="btn btn-secondary" onclick="window.closeModal()">Cancel</button>
        <button class="btn btn-danger" id="confirm-delete-btn">Yes, Delete Account</button>
      `
    });

    window.closeModal = () => modal.close();

    document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
      try {
        await api.users.delete(userId);
        toast.success(`User ${userName} deleted successfully`);
        modal.close();
        await this.loadUsers();
      } catch (error) {
        toast.error(error.message);
      }
    });
  },

  openAddUserModal() {
    modal.open({
      title: 'Create New User Account',
      bodyHtml: `
        <form id="add-user-modal-form">
          <div class="form-group">
            <label class="form-label" for="add-name">Full Name</label>
            <input type="text" id="add-name" class="form-control" placeholder="John Smith" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="add-email">Email Address</label>
            <input type="email" id="add-email" class="form-control" placeholder="john@example.com" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="add-password">Temporary Password</label>
            <input type="password" id="add-password" class="form-control" placeholder="••••••••" required minlength="6" />
          </div>
          <div class="form-group">
            <label class="form-label" for="add-phone">Phone Number</label>
            <input type="tel" id="add-phone" class="form-control" placeholder="0771234567" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="add-role">System Role</label>
            <select id="add-role" class="form-control" required>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="EVENT_COORDINATOR">EVENT COORDINATOR</option>
              <option value="OPERATIONS_MANAGER">OPERATIONS MANAGER</option>
              <option value="FINANCE_OFFICER">FINANCE OFFICER</option>
              <option value="VENDOR">VENDOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </form>
      `,
      footerHtml: `
        <button class="btn btn-secondary" onclick="window.closeModal()">Cancel</button>
        <button class="btn btn-primary" id="save-new-user-btn">Create User</button>
      `
    });

    window.closeModal = () => modal.close();

    document.getElementById('save-new-user-btn').addEventListener('click', async () => {
      const payload = {
        name: document.getElementById('add-name').value.trim(),
        email: document.getElementById('add-email').value.trim(),
        password: document.getElementById('add-password').value,
        phoneNum: document.getElementById('add-phone').value.trim(),
        role: document.getElementById('add-role').value,
      };

      if (!payload.name || !payload.email || !payload.password) {
        toast.warning('Please fill in all required fields.');
        return;
      }

      try {
        await api.users.create(payload);
        toast.success(`User ${payload.name} created successfully!`);
        modal.close();
        await this.loadUsers();
      } catch (error) {
        toast.error(error.message);
      }
    });
  }
};
