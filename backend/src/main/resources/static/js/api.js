/**
 * Centralized API Client for Spring Boot Backend
 */
const API_BASE_URL = 'http://localhost:8080';

export const api = {
  /**
   * Generic fetch wrapper with Authorization header injection
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized globally
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.hash = '#/login';
        throw new Error('Session expired. Please log in again.');
      }

      // Check if response is JSON or Plain Text
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        let errorMessage = 'An error occurred';
        if (typeof data === 'object' && data !== null) {
          errorMessage = data.message || data.error || JSON.stringify(data);
        } else if (typeof data === 'string' && data.length > 0) {
          errorMessage = data;
        }
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to backend server (http://localhost:8080). Make sure Spring Boot is running.');
      }
      throw error;
    }
  },

  // Auth endpoints
  auth: {
    register: (payload) => api.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    login: (payload) => api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  },

  // User management endpoints
  users: {
    getAll: () => api.request('/users', { method: 'GET' }),
    getById: (id) => api.request(`/users/${id}`, { method: 'GET' }),
    create: (payload) => api.request('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

    update: (id, payload) => api.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
    changePassword: (id, payload) => api.request(`/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
    delete: (id) => api.request(`/users/${id}`, { method: 'DELETE' }),
  },

};
