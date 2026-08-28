'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_AGENTS } from '../../types/agents';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('kelvin@watucredit.co.ke');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Find agent by email and password
      const agent = SAMPLE_AGENTS.find(
        (a) => a.email === email && a.password === password && a.status === 'active'
      );

      if (!agent) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      // Store auth token and agent info
      localStorage.setItem('auth_token', 'agent-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify({
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        location: agent.location,
        region: agent.region,
      }));

      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lipa Mdogo</h1>
          <p className="text-sm text-gray-600 mt-2">Sales Agent Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
              placeholder="agent@watucredit.co.ke"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
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

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-xs font-semibold text-gray-900 mb-3">Test Agents:</p>
          <div className="space-y-2 text-xs">
            <div className="bg-blue-50 p-2 rounded">
              <p className="font-semibold text-blue-900">👤 Kelvin Kimutai</p>
              <p className="text-gray-600">kelvin@watucredit.co.ke</p>
              <p className="text-gray-600">password123</p>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <p className="font-semibold text-green-900">👤 Rose Tata</p>
              <p className="text-gray-600">rose@watucredit.co.ke</p>
              <p className="text-gray-600">password123</p>
            </div>
            <div className="bg-purple-50 p-2 rounded">
              <p className="font-semibold text-purple-900">👤 James Mwangi</p>
              <p className="text-gray-600">james@watucredit.co.ke</p>
              <p className="text-gray-600">password123</p>
            </div>
            <div className="bg-amber-50 p-2 rounded">
              <p className="font-semibold text-amber-900">👤 Fatima Hassan</p>
              <p className="text-gray-600">fatima@watucredit.co.ke</p>
              <p className="text-gray-600">password123</p>
            </div>
            <div className="bg-red-50 p-2 rounded">
              <p className="font-semibold text-red-900">👤 Michael Kipchoge</p>
              <p className="text-gray-600">michael@watucredit.co.ke</p>
              <p className="text-gray-600">password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
