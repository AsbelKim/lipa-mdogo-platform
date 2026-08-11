'use client';

import { useState } from 'react';
import { SALES_AGENTS, AGENT_INVENTORY, AgentInventorySummary } from '../types/agents';
import { PHONE_CATALOG } from '../types/phones';

export default function AgentAllocationManager() {
  const [agents] = useState(SALES_AGENTS);
  const [inventory] = useState(AGENT_INVENTORY);
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedPhoneModel, setSelectedPhoneModel] = useState<string>('');
  const [allocationQty, setAllocationQty] = useState('');
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const getAgentInventorySummary = (agentId: string): AgentInventorySummary => {
    const agentInv = inventory.filter((item) => item.agentId === agentId);
    const agent = agents.find((a) => a.id === agentId);

    const totalAllocated = agentInv.length;
    const totalSold = agentInv.filter((item) => item.status === 'sold').length;
    const totalUnsold = agentInv.filter((item) => item.status === 'in-stock').length;
    const conversionRate = totalAllocated > 0 ? Math.round((totalSold / totalAllocated) * 100) : 0;

    return {
      agentId,
      agentName: agent?.name || '',
      totalAllocated,
      totalSold,
      totalUnsold,
      totalRevenue: agent?.totalRevenue || 0,
      conversionRate,
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would call backend API
    console.log('Allocating:', {
      agentId: selectedAgent,
      phoneModelId: selectedPhoneModel,
      quantity: allocationQty,
    });
    // Reset form
    setSelectedAgent('');
    setSelectedPhoneModel('');
    setAllocationQty('');
    setShowAllocationForm(false);
    alert('✅ Phones allocated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👥 Sales Agent Management</h1>
          <p className="text-gray-600 mt-1">Allocate phones to agents and track inventory</p>
        </div>
        <button
          onClick={() => setShowAllocationForm(true)}
          className="px-4 py-2 bg-primary hover:bg-emerald-700 text-white rounded-lg transition font-medium"
        >
          + Allocate Phones to Agent
        </button>
      </div>

      {/* Allocation Form Modal */}
      {showAllocationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Allocate Phones to Agent</h2>

            <form onSubmit={handleAllocate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sales Agent</label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select an agent...</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Model</label>
                <select
                  value={selectedPhoneModel}
                  onChange={(e) => setSelectedPhoneModel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a phone model...</option>
                  {PHONE_CATALOG.map((phone) => (
                    <option key={phone.id} value={phone.id}>
                      {phone.model} ({phone.specs}) - {phone.stockQuantity} available
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={allocationQty}
                  onChange={(e) => setAllocationQty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Number of phones to allocate"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                ℹ️ These phones will be deducted from general stock and assigned to the agent.
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary hover:bg-emerald-700 text-white rounded-lg transition font-medium"
                >
                  Allocate
                </button>
                <button
                  type="button"
                  onClick={() => setShowAllocationForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Agents Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const summary = getAgentInventorySummary(agent.id);
          return (
            <div
              key={agent.id}
              className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition cursor-pointer"
              onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-600">{agent.location}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                  <div className="bg-blue-50 rounded p-2">
                    <p className="text-lg font-bold text-blue-600">{summary.totalAllocated}</p>
                    <p className="text-xs text-gray-600">Allocated</p>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <p className="text-lg font-bold text-green-600">{summary.totalSold}</p>
                    <p className="text-xs text-gray-600">Sold</p>
                  </div>
                  <div className="bg-amber-50 rounded p-2">
                    <p className="text-lg font-bold text-amber-600">{summary.totalUnsold}</p>
                    <p className="text-xs text-gray-600">Unsold</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-xl font-bold text-primary">{summary.conversionRate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-bold text-gray-900">{formatCurrency(agent.totalRevenue)}</p>
                  </div>
                </div>

                {expandedAgent === agent.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Detailed Inventory</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {inventory
                        .filter((item) => item.agentId === agent.id)
                        .map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.phoneModel}</p>
                              <p className="text-xs text-gray-600">{item.phoneModel}</p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                item.status === 'sold'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.status === 'sold' ? '✓ Sold' : '📱 In Stock'}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-primary to-emerald-600 rounded-lg shadow text-white p-6">
        <h3 className="text-lg font-bold mb-4">Overall Team Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm opacity-90">Total Agents</p>
            <p className="text-3xl font-bold">{agents.length}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Total Allocated</p>
            <p className="text-3xl font-bold">
              {inventory.length}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-90">Total Sold</p>
            <p className="text-3xl font-bold">
              {inventory.filter((i) => i.status === 'sold').length}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-90">Team Revenue</p>
            <p className="text-3xl font-bold">
              {formatCurrency(agents.reduce((sum, a) => sum + a.totalRevenue, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
