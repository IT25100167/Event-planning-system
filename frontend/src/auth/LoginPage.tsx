import React, { useState } from 'react';

/**
 * 🔐 LOGIN PAGE
 * 
 * TODO: Your team members will implement this!
 * 
 * Requirements:
 * - Email & Password inputs
 * - Form validation
 * - Backend API call to POST /auth/login
 * - Store JWT token in localStorage
 * - Call onLoginSuccess with user data
 * 
 * Backend Response Expected:
 * {
 *   userId: number,
 *   name: string,
 *   email: string,
 *   role: 'OPERATIONS_MANAGER' | 'EVENT_COORDINATOR',
 *   token: string
 * }
 */

interface LoginPageProps {
  onLoginSuccess: (userData: LoginSuccessData) => void;
  onNavigateToRegister?: () => void;
}

export interface LoginSuccessData {
  userId: number;
  name: string;
  email: string;
  role: 'operations' | 'coordinator';
  token?: string;
}

export default function LoginPage({ onLoginSuccess, onNavigateToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Map backend role to frontend role
      const role = data.role === 'OPERATIONS_MANAGER' ? 'operations' : 'coordinator';

      // Store token
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      // Call parent callback
      onLoginSuccess({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: role,
        token: data.token
      });

    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to EventFlow
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Placeholder - Your team will implement this!
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {onNavigateToRegister && (
            <div className="text-center">
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Don't have an account? Register
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
