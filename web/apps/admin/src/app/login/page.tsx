'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_ADMINS } from '../../types/admins';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('james@watucredit.co.ke');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Find admin by email and password
      const admin = SAMPLE_ADMINS.find(
        (a) => a.email === email && a.password === password && a.status === 'active'
      );

      if (!admin) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      // Store admin info and token
      localStorage.setItem('auth_token', 'admin-token-' + Date.now());
      localStorage.setItem('admin', JSON.stringify({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,
        permissions: admin.permissions,
      }));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lipa Mdogo</h1>
          <p className="text-gray-600 mt-2">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@watucredit.co.ke"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm font-semibold text-gray-900 mb-4">Test Admin Accounts:</p>
          <div className="space-y-3">
            <div className="bg-purple-50 p-3 rounded-lg text-sm">
              <p className="font-semibold text-purple-900">👑 Super Admin</p>
              <p className="text-xs text-gray-600">james@watucredit.co.ke</p>
              <p className="text-xs text-gray-600">password123</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="font-semibold text-blue-900">📊 Admin</p>
              <p className="text-xs text-gray-600">sarah@watucredit.co.ke</p>
              <p className="text-xs text-gray-600">password123</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg text-sm">
              <p className="font-semibold text-amber-900">🔒 Restricted Admin</p>
              <p className="text-xs text-gray-600">peter@watucredit.co.ke</p>
              <p className="text-xs text-gray-600">password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
