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
      // Fake Authentication since Backend Auth isn't built yet by the team
      await new Promise(resolve => setTimeout(resolve, 500)); // simulate network delay

      let data: any;

      if (email.toLowerCase() === 'vendor@ceylon.com' && password === '1234') {
        data = {
          userId: 1,
          name: 'Vendor Company',
          email: 'vendor@ceylon.com',
          role: 'VENDOR',
          token: 'fake-jwt-token-vendor'
        };
      } else if (email.toLowerCase() === 'manager@eventflow.com' && password === '1234') {
        data = {
          userId: 2,
          name: 'Operations Manager',
          email: 'manager@eventflow.com',
          role: 'OPERATIONS_MANAGER',
          token: 'fake-jwt-token-manager'
        };
      } else {
        throw new Error('Invalid credentials. Try vendor@ceylon.com or manager@eventflow.com with password 1234');
      }

      const role = data.role === 'VENDOR' ? 'VENDOR' : 'operations';

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      onLoginSuccess({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: role as any,
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
            <strong>Vendor:</strong> vendor@ceylon.com / 1234
            <br />
            <strong>Manager:</strong> manager@eventflow.com / 1234
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
