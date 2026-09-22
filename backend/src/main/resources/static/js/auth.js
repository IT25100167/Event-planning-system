/**
 * Authentication and Session Management
 */
export const auth = {
  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  },

  setUserSession(loginResponse) {
    if (loginResponse.token) {
      localStorage.setItem('token', loginResponse.token);
    }
    const user = {
      userId: loginResponse.userId,
      name: loginResponse.name,
      email: loginResponse.email,
      phoneNum: loginResponse.phoneNum,
      role: loginResponse.role,
    };
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth:change', { detail: user }));
  },

  updateUserInSession(updatedFields) {
    const current = this.getUser() || {};
    const updated = { ...current, ...updatedFields };
    localStorage.setItem('user', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('auth:change', { detail: updated }));
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth:change', { detail: null }));
    window.location.hash = '#/login';
  },

  hasRole(...allowedRoles) {
    const user = this.getUser();
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role);
  },

  isAdmin() {
    return this.hasRole('ADMIN');
  }
};
