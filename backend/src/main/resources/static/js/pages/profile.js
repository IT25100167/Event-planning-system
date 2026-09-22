import { api } from '../api.js';
import { auth } from '../auth.js';
import { toast } from '../toast.js';

export const ProfilePage = {
  render() {
    const user = auth.getUser() || {};

    return `
      <div class="animate-fade-in" style="max-width: 900px;">
        <div style="margin-bottom: 24px;">
          <h1 style="font-size: 26px; margin-bottom: 4px;">My Account Profile</h1>
          <p style="color: var(--text-muted); font-size: 14px;">Manage your personal credentials, contact information, and security</p>
        </div>

        <!-- Profile Overview Card -->
        <div class="glass-panel" style="padding: 28px; margin-bottom: 24px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
          <div class="user-avatar" style="width: 72px; height: 72px; font-size: 26px;">
            ${(user.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
              <h2 style="font-size: 22px;">${user.name || 'User'}</h2>
              <span class="badge badge-${user.role || 'CUSTOMER'}">
                <span class="badge-dot"></span>
                ${user.role || 'CUSTOMER'}
              </span>
            </div>
            <p style="color: var(--text-muted); font-size: 14px;">${user.email || 'No email provided'} • User ID: #${user.userId}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <!-- Edit Information Form -->
          <div class="glass-panel" style="padding: 28px;">
            <h3 style="font-size: 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Personal Details</span>
            </h3>

            <form id="profile-info-form">
              <div class="form-group">
                <label class="form-label" for="profile-name">Full Name</label>
                <input type="text" id="profile-name" class="form-control" value="${user.name || ''}" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="profile-email">Email Address</label>
                <input type="email" id="profile-email" class="form-control" value="${user.email || ''}" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="profile-phone">Phone Number</label>
                <input type="tel" id="profile-phone" class="form-control" value="${user.phoneNum || ''}" />
              </div>

              <button type="submit" id="profile-save-btn" class="btn btn-primary" style="margin-top: 12px; width: 100%;">
                Save Changes
              </button>
            </form>
          </div>

          <!-- Change Password Form -->
          <div class="glass-panel" style="padding: 28px;">
            <h3 style="font-size: 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>Security & Password</span>
            </h3>

            <form id="profile-pwd-form">
              <div class="form-group">
                <label class="form-label" for="profile-curr-pwd">Current Password</label>
                <input type="password" id="profile-curr-pwd" class="form-control" placeholder="••••••••" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="profile-new-pwd">New Password</label>
                <input type="password" id="profile-new-pwd" class="form-control" placeholder="••••••••" required minlength="4" />
              </div>

              <div class="form-group">
                <label class="form-label" for="profile-confirm-pwd">Confirm New Password</label>
                <input type="password" id="profile-confirm-pwd" class="form-control" placeholder="••••••••" required minlength="4" />
              </div>

              <button type="submit" id="profile-pwd-btn" class="btn btn-secondary" style="margin-top: 12px; width: 100%;">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    const user = auth.getUser();
    if (!user) return;

    // Profile Details Form
    const infoForm = document.getElementById('profile-info-form');
    infoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('profile-name').value.trim(),
        email: document.getElementById('profile-email').value.trim(),
        phoneNum: document.getElementById('profile-phone').value.trim(),
        role: user.role,
      };

      try {
        await api.users.update(user.userId, payload);
        auth.updateUserInSession(payload);
        toast.success('Profile details updated successfully!');
      } catch (error) {
        toast.error(error.message);
      }
    });

    // Change Password Form
    const pwdForm = document.getElementById('profile-pwd-form');
    pwdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById('profile-curr-pwd').value;
      const newPassword = document.getElementById('profile-new-pwd').value;
      const confirmPassword = document.getElementById('profile-confirm-pwd').value;

      if (newPassword !== confirmPassword) {
        toast.warning('New password and confirmation do not match.');
        return;
      }

      try {
        await api.users.changePassword(user.userId, { currentPassword, newPassword });
        toast.success('Your password has been changed successfully!');
        pwdForm.reset();
      } catch (error) {
        toast.error(error.message);
      }
    });
  }
};
