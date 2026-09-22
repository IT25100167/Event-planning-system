import { api } from '../api.js';
import { auth } from '../auth.js';
import { toast } from '../toast.js';

export const LoginPage = {
  render() {
    return `
      <div class="auth-wrapper">
        <div class="auth-card">
          <div class="auth-header">
            <div class="logo-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to your Event Planning account</p>
          </div>

          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Email Address</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <input type="email" id="login-email" class="form-control" placeholder="name@domain.com" required autocomplete="email" />
              </div>
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label class="form-label" for="login-password">Password</label>
              </div>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input type="password" id="login-password" class="form-control" placeholder="Enter your password" required autocomplete="current-password" />
              </div>
            </div>

            <button type="submit" id="login-submit-btn" class="btn btn-primary" style="width: 100%; margin-top: 10px; padding: 13px;">
              <span>Sign In</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </form>

           

          <div class="auth-footer-text">
            Don't have an account? <a href="#/register">Create one here</a>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    const form = document.getElementById('login-form');
    const submitBtn = document.getElementById('login-submit-btn');


    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      if (!email || !password) {
        toast.warning('Please enter both email and password.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Signing In...</span>`;

      try {
        const response = await api.auth.login({ email, password });
        auth.setUserSession(response);
        toast.success(`Welcome back, ${response.name || 'User'}!`);
        window.location.hash = '#/dashboard';
      } catch (error) {
        toast.error(error.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Sign In</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
      }
    });
  }
};
