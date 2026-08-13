'use client';

import { useEffect, useState } from 'react';

interface AgentStats {
  allocatedPhones: number;
  soldPhones: number;
  inStockPhones: number;
  totalRevenue: number;
  pendingSales: number;
  conversionRate: number;
}

export default function AgentDashboard() {
  const [stats, setStats] = useState<AgentStats>({
    allocatedPhones: 0,
    soldPhones: 0,
    inStockPhones: 0,
    totalRevenue: 0,
    pendingSales: 0,
    conversionRate: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const agentId = localStorage.getItem('agent_id');

    // Load agent's data
    const allocations = localStorage.getItem('agentAllocations');
    const soldPhones = localStorage.getItem('soldPhones');
    const pendingSales = localStorage.getItem('pendingSales');

    if (allocations && agentId) {
      try {
        const allocList = JSON.parse(allocations);
        const agentPhones = allocList.filter((a: any) => a.agentId === agentId);

        const sold = soldPhones ? JSON.parse(soldPhones).filter((s: any) => s.agentName === localStorage.getItem('agent_name')).length : 0;
        const allocated = agentPhones.length;
        const inStock = allocated - sold;
        const pending = pendingSales ? JSON.parse(pendingSales).filter((s: any) => s.agentName === localStorage.getItem('agent_name') && s.status === 'pending').length : 0;

        setStats({
          allocatedPhones: allocated,
          soldPhones: sold,
          inStockPhones: inStock,
          totalRevenue: sold * 20000, // Mock calculation
          pendingSales: pending,
          conversionRate: allocated > 0 ? Math.round((sold / allocated) * 100) : 0,
        });
      } catch (e) {
        console.error('Failed to load stats:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 My Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your sales, stock, and performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Allocated Phones */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Allocated Phones</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.allocatedPhones}</p>
          <p className="text-xs text-gray-500 mt-1">total assigned</p>
        </div>

        {/* In Stock */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">In Stock</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.inStockPhones}</p>
          <p className="text-xs text-gray-500 mt-1">available to sell</p>
        </div>

        {/* Sold */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">Sold</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.soldPhones}</p>
          <p className="text-xs text-gray-500 mt-1">completed sales</p>
        </div>

        {/* Pending */}
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingSales}</p>
          <p className="text-xs text-gray-500 mt-1">awaiting admin</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.conversionRate}%</p>
          <p className="text-xs text-gray-500 mt-1">sold / allocated</p>
        </div>

        {/* Revenue */}
        <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
          <p className="text-sm text-gray-600">Est. Revenue</p>
          <p className="text-2xl font-bold text-rose-600 mt-2">KES {stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">from sales</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium">
            + Add Customer
          </button>
          <button className="px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition font-medium">
            + Create Sale
          </button>
          <button className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
            📥 Download Receipt
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Register customers, create sales, and track your performance. Admin will review and approve all sales submissions.
        </p>
      </div>
    </div>
  );
}
