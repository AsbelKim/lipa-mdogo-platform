'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SALES_AGENTS } from '../../types/agents';
import { DEALER_CONFIG } from '../../config/dealer';

export default function AgentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      const agent = SALES_AGENTS.find(
        (a) => a.email === email && a.password === password && a.status === 'active'
      );

      if (agent) {
        // Save agent session
        localStorage.setItem('agent_token', `agent_${agent.id}_${Date.now()}`);
        localStorage.setItem('agent_id', agent.id);
        localStorage.setItem('agent_name', agent.name);
        localStorage.setItem('agent_email', agent.email);
        localStorage.setItem('agent_phone', agent.phone);
        localStorage.setItem('agent_location', agent.location);

        // Redirect to agent dashboard
        router.push('/agent/dashboard');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📱</div>
            <h1 className="text-3xl font-bold text-gray-900">{DEALER_CONFIG.name}</h1>
            <p className="text-primary font-semibold mt-2">Sales Agent Portal</p>
            <p className="text-gray-600 text-sm mt-1">Track sales, manage customers & get real-time updates</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@dakiro.ke"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm font-medium">❌ {error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '🔄 Logging in...' : '✓ Login'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-3">📋 Demo Login Credentials:</p>
            <div className="space-y-2 bg-gray-50 rounded-lg p-4">
              <div className="text-xs">
                <p className="font-medium text-gray-700">👤 Agent 1 - Michael Kipchoge</p>
                <p className="text-gray-600">📧 michael.kipchoge@dakiro.ke</p>
                <p className="text-gray-600">🔐 Agent@123</p>
              </div>
              <hr className="my-2" />
              <div className="text-xs">
                <p className="font-medium text-gray-700">👤 Agent 2 - Rose Tata</p>
                <p className="text-gray-600">📧 rose.tata@dakiro.ke</p>
                <p className="text-gray-600">🔐 Agent@123</p>
              </div>
              <hr className="my-2" />
              <div className="text-xs">
                <p className="font-medium text-gray-700">👤 Agent 3 - James Omondi</p>
                <p className="text-gray-600">📧 james.omondi@dakiro.ke</p>
                <p className="text-gray-600">🔐 Agent@123</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Admin?{' '}
              <a href="/" className="text-primary font-semibold hover:underline">
                Go to Admin Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
