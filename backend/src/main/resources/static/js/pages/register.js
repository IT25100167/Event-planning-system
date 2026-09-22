import { api } from '../api.js';
import { toast } from '../toast.js';

export const RegisterPage = {
  render() {
    return `
      <div class="auth-wrapper">
        <div class="auth-card" style="max-width: 520px;">
          <div class="auth-header">
            <div class="logo-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
            </div>
            <h2>Create Account</h2>
            <p>Join the Event Planning & Management Platform</p>
          </div>

          <form id="register-form">
            <div class="form-group">
              <label class="form-label" for="reg-name">Full Name</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <input type="text" id="reg-name" class="form-control" placeholder="Jane Doe" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-email">Email Address</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <input type="email" id="reg-email" class="form-control" placeholder="jane@example.com" required autocomplete="email" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label" for="reg-password">Password</label>
                <div class="input-with-icon">
                  <span class="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </span>
                  <input type="password" id="reg-password" class="form-control" placeholder="••••••••" required minlength="6" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="reg-phone">Phone Number</label>
                <div class="input-with-icon">
                  <span class="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </span>
                  <input type="tel" id="reg-phone" class="form-control" placeholder="0771234567" required />
                </div>
              </div>
            </div>

            

            <button type="submit" id="register-submit-btn" class="btn btn-primary" style="width: 100%; margin-top: 10px; padding: 13px;">
              <span>Register Account</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </form>

          <div class="auth-footer-text">
            Already have an account? <a href="#/login">Sign in</a>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    const form = document.getElementById('register-form');
    const submitBtn = document.getElementById('register-submit-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        name: document.getElementById('reg-name').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        password: document.getElementById('reg-password').value,
        phoneNum: document.getElementById('reg-phone').value.trim(),
      };

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Registering...</span>`;

      try {
        await api.auth.register(payload);
        toast.success('Registration successful! Please sign in.');
        window.location.hash = '#/login';
      } catch (error) {
        toast.error(error.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Register Account</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
      }
    });
  }
};
