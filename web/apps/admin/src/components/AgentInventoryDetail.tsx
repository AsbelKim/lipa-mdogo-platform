'use client';

import { useState } from 'react';
import { SALES_AGENTS, AGENT_INVENTORY, AgentInventoryItem } from '../types/agents';

export default function AgentInventoryDetail() {
  const [agents] = useState(SALES_AGENTS);
  const [inventory] = useState(AGENT_INVENTORY);
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const currentAgent = agents.find((a) => a.id === selectedAgent);
  const agentInv = inventory.filter((item) => item.agentId === selectedAgent);

  const filteredInventory =
    filterStatus === 'all' ? agentInv : agentInv.filter((item) => item.status === filterStatus);

  const stats = {
    total: agentInv.length,
    sold: agentInv.filter((i) => i.status === 'sold').length,
    inStock: agentInv.filter((i) => i.status === 'in-stock').length,
    damaged: agentInv.filter((i) => i.status === 'damaged').length,
    lost: agentInv.filter((i) => i.status === 'lost').length,
  };

  const conversionRate = stats.total > 0 ? Math.round((stats.sold / stats.total) * 100) : 0;

  const groupByModel = (items: AgentInventoryItem[]) => {
    const groups: { [key: string]: AgentInventoryItem[] } = {};
    items.forEach((item) => {
      if (!groups[item.phoneModel]) {
        groups[item.phoneModel] = [];
      }
      groups[item.phoneModel].push(item);
    });
    return groups;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-KE');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold':
        return 'bg-green-100 text-green-800';
      case 'in-stock':
        return 'bg-blue-100 text-blue-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      case 'lost':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sold':
        return '✓';
      case 'in-stock':
        return '📱';
      case 'damaged':
        return '⚠️';
      case 'lost':
        return '❌';
      default:
        return '•';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 Agent Inventory Detail</h1>
        <p className="text-gray-600 mt-1">View sold and unsold phones per agent</p>
      </div>

      {/* Agent Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Sales Agent</label>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name} - {agent.location}
            </option>
          ))}
        </select>
      </div>

      {currentAgent && (
        <>
          {/* Agent Header Card */}
          <div className="bg-gradient-to-r from-primary to-emerald-600 rounded-lg shadow text-white p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentAgent.name}</h2>
                <p className="opacity-90">{currentAgent.location}</p>
                <p className="text-sm opacity-75 mt-1">Joined: {formatDate(currentAgent.joinDate)}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm opacity-90">Email</p>
                  <p className="font-semibold text-sm">{currentAgent.email}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Phone</p>
                  <p className="font-semibold text-sm">{currentAgent.phone}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Region</p>
                  <p className="font-semibold text-sm">{currentAgent.region}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Allocated</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4 text-center border-l-4 border-green-600">
              <p className="text-sm text-gray-600 mb-1">✓ Sold</p>
              <p className="text-3xl font-bold text-green-600">{stats.sold}</p>
            </div>
            <div className="bg-blue-50 rounded-lg shadow p-4 text-center border-l-4 border-blue-600">
              <p className="text-sm text-gray-600 mb-1">📱 In Stock</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inStock}</p>
            </div>
            <div className="bg-red-50 rounded-lg shadow p-4 text-center border-l-4 border-red-600">
              <p className="text-sm text-gray-600 mb-1">⚠️ Damaged</p>
              <p className="text-3xl font-bold text-red-600">{stats.damaged}</p>
            </div>
            <div className="bg-orange-50 rounded-lg shadow p-4 text-center border-l-4 border-orange-600">
              <p className="text-sm text-gray-600 mb-1">❌ Lost</p>
              <p className="text-3xl font-bold text-orange-600">{stats.lost}</p>
            </div>
          </div>

          {/* Conversion & Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Conversion Rate</p>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-4xl font-bold text-primary">{conversionRate}%</p>
                  <p className="text-sm text-gray-600">
                    {stats.sold} sold out of {stats.total}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${conversionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-4xl font-bold text-emerald-600">
                    {formatCurrency(currentAgent.totalRevenue)}
                  </p>
                  <p className="text-sm text-gray-600">From {currentAgent.totalSales} sales</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Avg per sale</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(currentAgent.totalRevenue / Math.max(currentAgent.totalSales, 1))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'all', label: 'All', count: stats.total },
                { id: 'sold', label: 'Sold', count: stats.sold },
                { id: 'in-stock', label: 'In Stock', count: stats.inStock },
                { id: 'damaged', label: 'Damaged', count: stats.damaged },
                { id: 'lost', label: 'Lost', count: stats.lost },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterStatus(filter.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === filter.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* Inventory by Model */}
          <div className="space-y-4">
            {Object.entries(groupByModel(filteredInventory)).map(([model, items]) => (
              <div key={model} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900">{model}</h3>
                  <p className="text-sm text-gray-600">
                    {items.length} units - {items.filter((i) => i.status === 'sold').length} sold,{' '}
                    {items.filter((i) => i.status === 'in-stock').length} unsold
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">IMEI</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Allocated</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sold Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Days in Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item) => {
                        const daysInStock = Math.floor(
                          (new Date(item.soldDate || new Date().toISOString()).getTime() -
                            new Date(item.allocatedDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        );

                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-mono text-gray-900">{item.imei}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                                {getStatusIcon(item.status)} {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(item.allocatedDate)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.soldDate ? formatDate(item.soldDate) : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{daysInStock} days</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {filteredInventory.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 text-lg">No inventory items with selected filter</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
