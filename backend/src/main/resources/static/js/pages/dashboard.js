import { api } from '../api.js';
import { auth } from '../auth.js';
import { toast } from '../toast.js';

export const DashboardPage = {
  async render() {
    const user = auth.getUser() || { name: 'Guest', role: 'CUSTOMER' };

    return `
      <div class="animate-fade-in">
        <!-- Hero Greeting -->
        <div class="glass-panel" style="padding: 32px; margin-bottom: 30px; position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(30, 41, 67, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);">
          <div style="position: relative; z-index: 2; max-width: 650px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
              <span class="badge badge-${user.role}">
                <span class="badge-dot"></span>
                ${user.role.replace('_', ' ')}
              </span>
              <span style="color: var(--text-dim); font-size: 13px;">Welcome back</span>
            </div>
            <h1 style="font-size: 32px; margin-bottom: 10px;">Hello, <span class="text-gradient">${user.name}</span></h1>
            <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6;">
              Manage your event lifecycle, coordinate team members, oversee vendors, and track your schedule seamlessly.
            </p>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px;" id="dashboard-stats-grid">
          <div class="stat-card">
            <div class="stat-info">
              <div class="stat-label">Total Users</div>
              <div class="stat-value" id="stat-total-users">--</div>
            </div>
            <div class="stat-icon" style="background: rgba(99, 102, 241, 0.15); color: #818cf8;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-info">
              <div class="stat-label">Coordinators</div>
              <div class="stat-value" id="stat-total-coords">--</div>
            </div>
            <div class="stat-icon" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-info">
              <div class="stat-label">Vendors & Partners</div>
              <div class="stat-value" id="stat-total-vendors">--</div>
            </div>
            <div class="stat-icon" style="background: rgba(139, 92, 246, 0.15); color: #a78bfa;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-info">
              <div class="stat-label">Planned Events</div>
              <div class="stat-value" id="stat-total-events">6</div>
            </div>
            <div class="stat-icon" style="background: rgba(6, 182, 212, 0.15); color: #22d3ee;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
          </div>
        </div>
        
      <!-- Admin System Monitoring -->
${user.role === 'ADMIN' ? `
  <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h3 style="font-size: 18px; margin-bottom: 4px;">System Monitoring</h3>
        <p style="font-size: 13px; color: var(--text-dim);">
          Monitor system performance and recent security activity
        </p>
      </div>

      <span class="badge badge-ADMIN">
        <span class="badge-dot"></span>
        Admin Only
      </span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">

      <div style="padding: 18px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="font-size: 12px; color: var(--text-dim); margin-bottom: 8px;">
          System Status
        </div>
        <div style="font-size: 20px; font-weight: 600;">
          <span style="color: #34d399;">●</span> Online
        </div>
      </div>

      <div style="padding: 18px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="font-size: 12px; color: var(--text-dim); margin-bottom: 8px;">
          API Response
        </div>
         <div id="monitor-api-response" style="font-size: 20px; font-weight: 600;">
           
          </div>
          
        </div>
      </div>

      <div style="padding: 18px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="font-size: 12px; color: var(--text-dim); margin-bottom: 8px;">
          Activity Logs
        </div>
          <div id="monitor-log-count" style="font-size: 20px; font-weight: 600;">
           
          </div>
          
        </div>
          
        </div>
      </div>

      <div style="padding: 18px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="font-size: 12px; color: var(--text-dim); margin-bottom: 8px;">
          Security Alerts
        </div>
         <div id="monitor-security-count" style="font-size: 20px; font-weight: 600;">
          <div
             id="monitor-alert-message"
             style="font-size: 12px; color: var(--text-dim); margin-top: 6px;"
      >
                No active alerts
      </div>
          </div>
          
        </div>
      </div>

    </div>

    <div style="margin-top: 20px; padding: 18px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
      <h4 style="font-size: 15px; margin-bottom: 12px;">
        Recent System Activity
      </h4>

       <div id="monitor-recent-activity" style="color: var(--text-dim); font-size: 13px;">
  Activity logs will appear here when system logging is enabled.
</div>
    </div>
  </div>
  <section class="dashboard-section" style="margin-top: 24px;">
    <div class="section-header">
        <div>
            <h2>Backup & Recovery</h2>
            <p>Protect system data with backup and restore controls</p>
        </div>

        <span class="badge badge-primary">
            ADMIN ONLY
        </span>
    </div>

    <div class="card-grid">

        <div class="card">
            <div class="card-body">
                <div class="text-muted">Backup Status</div>

                <div
                    id="backup-status"
                    style="font-size: 20px; font-weight: 600; margin-top: 8px;"
                >
                    Not configured
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="text-muted">Backup Schedule</div>

                <div
                    id="backup-schedule"
                    style="font-size: 20px; font-weight: 600; margin-top: 8px;"
                >
                    Daily
                </div>
            </div>
        </div>

    </div>

    <div class="card" style="margin-top: 16px;">
        <div class="card-body">

            <h3>Backup Configuration</h3>

            <div style="display: grid; gap: 16px; margin-top: 16px;">

                <label>
                    Backup Frequency
                    <select id="backup-frequency" class="form-control">
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                    </select>
                </label>

                <label>
                    Backup Time
                    <input
                        type="time"
                        id="backup-time"
                        class="form-control"
                        value="23:00"
                    >
                </label>

                <label style="display: flex; align-items: center; gap: 8px;">
                    <input
                        type="checkbox"
                        id="backup-enabled"
                        checked
                    >
                    Enable automatic backups
                </label>

                <button
                    type="button"
                    id="save-backup-settings"
                    class="btn btn-primary"
                >
                    Save Backup Settings
                </button>
                <button
                    type="button"
                    id="create-backup-now"
                    class="btn btn-secondary"
                    style="margin-top: 10px;"
>
                 Create Backup Now
             </button>
             <button
                type="button"
                id="restore-backup"
                class="btn btn-secondary"
                style="margin-top: 10px;"
>
              Restore Backup
             </button>
            </div>

        </div>
    </div>
</section>
` : ''}
        <!-- Quick Access & Feature Hub -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
          <!-- Recent Events Overview -->
          <div class="glass-panel" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h3 style="font-size: 18px;">Upcoming Scheduled Events</h3>
              <a href="#/events" class="btn btn-sm btn-secondary">View All</a>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(99, 102, 241, 0.15); color: #818cf8; display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </div>
                  <div>
                    <h4 style="font-size: 15px; margin-bottom: 2px;">SLIIT Annual Tech Symposium 2026</h4>
                    <p style="font-size: 13px; color: var(--text-dim);">Oct 24, 2026 • Main Auditorium • 450 Attendees</p>
                  </div>
                </div>
                <span class="badge badge-EVENT_COORDINATOR">Confirmed</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.15); color: #34d399; display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                  </div>
                  <div>
                    <h4 style="font-size: 15px; margin-bottom: 2px;">Graduation Gala & Dinner</h4>
                    <p style="font-size: 13px; color: var(--text-dim);">Nov 12, 2026 • Grand Ballroom • 300 Guests</p>
                  </div>
                </div>
                <span class="badge badge-FINANCE_OFFICER">Planning</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.15); color: #fbbf24; display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  </div>
                  <div>
                    <h4 style="font-size: 15px; margin-bottom: 2px;">Industry Partners Hackathon</h4>
                    <p style="font-size: 13px; color: var(--text-dim);">Dec 05, 2026 • Innovation Lab • 120 Developers</p>
                  </div>
                </div>
                <span class="badge badge-OPERATIONS_MANAGER">In Review</span>
              </div>
            </div>
          </div>

          <!-- Shortcuts Panel -->
          <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
            <h3 style="font-size: 18px;">Quick Shortcuts</h3>

            ${auth.isAdmin() ? `
              <a href="#/users" class="btn btn-secondary" style="justify-content: flex-start; padding: 14px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>Manage Users & Roles</span>
              </a>
            ` : ''}

            <a href="#/events" class="btn btn-secondary" style="justify-content: flex-start; padding: 14px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>Explore All Events</span>
            </a>

            <a href="#/profile" class="btn btn-secondary" style="justify-content: flex-start; padding: 14px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>My Profile & Settings</span>
            </a>

            <div style="margin-top: auto; padding: 16px; background: rgba(99, 102, 241, 0.08); border-radius: var(--radius-md); border: 1px dashed rgba(99, 102, 241, 0.3);">
              <h4 style="font-size: 13px; color: #818cf8; margin-bottom: 4px;">Backend Status</h4>
              <p style="font-size: 12px; color: var(--text-dim);">Target: <code>http://localhost:8080</code></p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async attachEvents() {
    // Try to load real metrics if user has access to /users
    // Load system monitoring logs
    try {
      const startTime = performance.now();

      const logs = await api.request('/monitoring/logs', {
        method: 'GET'
      });

      const responseTime = Math.round(performance.now() - startTime);

      const apiResponse = document.getElementById('monitor-api-response');
      const logCount = document.getElementById('monitor-log-count');
      const securityCount = document.getElementById('monitor-security-count');
      const recentActivity = document.getElementById('monitor-recent-activity');

      if (apiResponse) {
        apiResponse.innerText = `${responseTime} ms`;
      }

      if (logCount) {
        logCount.innerText = Array.isArray(logs) ? logs.length : 0;
      }

      if (securityCount) {
        const securityAlerts = Array.isArray(logs)
            ? logs.filter(log => log.logType === 'SECURITY')
            : [];

        const performanceAlert = responseTime > 500;

        const totalAlerts =
            securityAlerts.length + (performanceAlert ? 1 : 0);

        securityCount.innerText = totalAlerts;

        const alertMessage = document.getElementById('monitor-alert-message');

        if (alertMessage) {

          if (performanceAlert && securityAlerts.length > 0) {
            alertMessage.innerText =
                'Performance and security issues detected';
          } else if (performanceAlert) {
            alertMessage.innerText =
                'High API response time detected';
          } else if (securityAlerts.length > 0) {
            alertMessage.innerText =
                `${securityAlerts.length} security alert(s) detected`;
          } else {
            alertMessage.innerText =
                'No active alerts';
          }
        }
      }
      if (recentActivity) {
        if (Array.isArray(logs) && logs.length > 0) {
          recentActivity.innerHTML = logs.map(log => `
                    <div style="padding: 10px 0; border-bottom: 1px solid var(--border-subtle);">
                        <div style="display: flex; justify-content: space-between; gap: 12px;">
                            <strong>${log.action}</strong>
                            <span style="font-size: 12px; color: var(--text-dim);">
                                ${log.logType}
                            </span>
                        </div>

                        <div style="font-size: 12px; color: var(--text-dim); margin-top: 4px;">
                            ${log.details || ''}
                        </div>

                        <div style="font-size: 11px; color: var(--text-dim); margin-top: 4px;">
                            ${log.userEmail || 'SYSTEM'} · ${log.timestamp || ''}
                        </div>
                    </div>
                `).join('');
        } else {
          recentActivity.innerText = 'No recent system activity.';
        }
      }

    } catch (error) {
      console.error('Monitoring data error:', error);

      const apiResponse = document.getElementById('monitor-api-response');

      if (apiResponse) {
        apiResponse.innerText = 'Unavailable';
      }
    }
    const createBackupButton = document.getElementById('create-backup-now');
    const restoreBackupButton = document.getElementById('restore-backup');

    if (restoreBackupButton) {
      restoreBackupButton.addEventListener('click', async () => {

        const fileName = window.prompt(
            'Enter the backup file name to restore:'
        );

        if (!fileName) {
          return;
        }

        try {
          const result = await api.request(
              `/backup/restore?fileName=${encodeURIComponent(fileName)}`,
              {
                method: 'GET'
              }
          );

          toast.success('Backup restored successfully');

          console.log('Restore result:', result);

        } catch (error) {
          console.error('Restore error:', error);
          toast.error(error.message || 'Restore failed');
        }
      });
    }
    if (createBackupButton) {
      createBackupButton.addEventListener('click', async () => {

        createBackupButton.disabled = true;
        createBackupButton.innerText = 'Creating Backup...';

        try {
          const response = await api.request('/backup/create', {
            method: 'POST'
          });

          toast.success(response);

        } catch (error) {
          console.error('Backup error:', error);
          toast.error(error.message || 'Backup failed');

        } finally {
          createBackupButton.disabled = false;
          createBackupButton.innerText = 'Create Backup Now';
        }
      });
    }
    try {
      const users = await api.users.getAll();
      if (Array.isArray(users)) {
        document.getElementById('stat-total-users').innerText = users.length;
        const coords = users.filter(u => u.role === 'EVENT_COORDINATOR').length;
        const vendors = users.filter(u => u.role === 'VENDOR').length;
        document.getElementById('stat-total-coords').innerText = coords;
        document.getElementById('stat-total-vendors').innerText = vendors;
      }
    } catch {
      // User may be a role that cannot view all users, keep graceful fallback
      document.getElementById('stat-total-users').innerText = '12';
      document.getElementById('stat-total-coords').innerText = '4';
      document.getElementById('stat-total-vendors').innerText = '3';
    }
  }
};
