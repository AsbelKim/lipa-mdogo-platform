'use client';

import { useState } from 'react';
import { SALES_AGENTS } from '../types/agents';
import Modal from './Modal';

interface IndividualPhoneAllocation {
  id: string;
  agentId: string;
  phoneId: string;
  model: string;
  imei: string;
  serialNumber: string;
  condition: 'new' | 'refurbished' | 'used';
  status: 'in-stock' | 'sold' | 'damaged' | 'lost';
  dateAllocated: string;
  dateSold?: string;
  customerName?: string;
}

export default function AgentAllocationManager() {
  const [agents, setAgents] = useState(SALES_AGENTS);
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  const [selectedAgentView, setSelectedAgentView] = useState<string | null>(null);
  const [detailModalAgent, setDetailModalAgent] = useState<typeof SALES_AGENTS[0] | null>(null);
  const [isEditingAgent, setIsEditingAgent] = useState(false);
  const [editedAgent, setEditedAgent] = useState<typeof SALES_AGENTS[0] | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedPhoneImei, setSelectedPhoneImei] = useState<string>('');

  // Sample allocated phones data
  const [allocatedPhones, setAllocatedPhones] = useState<IndividualPhoneAllocation[]>([
    {
      id: 'alloc-1',
      agentId: 'agent-1',
      phoneId: 'phone-1',
      model: 'Samsung Galaxy A56 5G',
      imei: '359072080276522',
      serialNumber: 'RF9DL1A20GU',
      condition: 'new',
      status: 'in-stock',
      dateAllocated: new Date().toISOString(),
    },
    {
      id: 'alloc-2',
      agentId: 'agent-1',
      phoneId: 'phone-2',
      model: 'Samsung Galaxy A56 5G',
      imei: '359072080276523',
      serialNumber: 'RF9DL1A20GV',
      condition: 'new',
      status: 'sold',
      dateAllocated: new Date().toISOString(),
      dateSold: new Date().toISOString(),
      customerName: 'John Doe',
    },
    {
      id: 'alloc-3',
      agentId: 'agent-2',
      phoneId: 'phone-3',
      model: 'Samsung Galaxy A36 5G',
      imei: '359072080276524',
      serialNumber: 'RF9DL1A20GW',
      condition: 'refurbished',
      status: 'in-stock',
      dateAllocated: new Date().toISOString(),
    },
  ]);

  // Available phones for allocation (in-stock phones not yet allocated)
  const availablePhones: IndividualPhoneAllocation[] = [
    {
      id: 'phone-4',
      agentId: '',
      phoneId: 'phone-4',
      model: 'Samsung Galaxy A05',
      imei: '359072080276525',
      serialNumber: 'RF9DL1A20GX',
      condition: 'new',
      status: 'in-stock',
      dateAllocated: '',
    },
    {
      id: 'phone-5',
      agentId: '',
      phoneId: 'phone-5',
      model: 'Samsung Galaxy A06',
      imei: '359072080276526',
      serialNumber: 'RF9DL1A20GY',
      condition: 'refurbished',
      status: 'in-stock',
      dateAllocated: '',
    },
  ];

  const getAgentPhones = (agentId: string) => {
    return allocatedPhones.filter((p) => p.agentId === agentId);
  };

  const getAgentStats = (agentId: string) => {
    const phones = getAgentPhones(agentId);
    const totalAllocated = phones.length;
    const totalSold = phones.filter((p) => p.status === 'sold').length;
    const totalUnsold = phones.filter((p) => p.status === 'in-stock').length;
    const conversionRate = totalAllocated > 0 ? Math.round((totalSold / totalAllocated) * 100) : 0;

    return { totalAllocated, totalSold, totalUnsold, conversionRate };
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

    if (!selectedAgent || !selectedPhoneImei) {
      alert('Please select agent and phone');
      return;
    }

    const phoneToAllocate = availablePhones.find((p) => p.imei === selectedPhoneImei);
    if (phoneToAllocate) {
      const newAllocation: IndividualPhoneAllocation = {
        ...phoneToAllocate,
        agentId: selectedAgent,
        dateAllocated: new Date().toISOString(),
      };
      setAllocatedPhones([...allocatedPhones, newAllocation]);
      setSelectedAgent('');
      setSelectedPhoneImei('');
      setShowAllocationForm(false);
      alert('✅ Phone allocated successfully!');
    }
  };

  const handleEditAgent = (agent: typeof SALES_AGENTS[0]) => {
    setEditedAgent({ ...agent });
    setIsEditingAgent(true);
  };

  const handleSaveAgent = () => {
    if (!editedAgent) return;

    setAgents(agents.map((a) => (a.id === editedAgent.id ? editedAgent : a)));
    if (detailModalAgent) {
      setDetailModalAgent(editedAgent);
    }
    setIsEditingAgent(false);
    setEditedAgent(null);
    alert('✅ Agent details updated successfully!');
  };

  const handleRemovePhoneFromAgent = (phoneId: string) => {
    setAllocatedPhones(allocatedPhones.filter((p) => p.id !== phoneId));
    alert('✅ Phone removed from agent!');
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
      <Modal isOpen={showAllocationForm} onClose={() => setShowAllocationForm(false)} title="Allocate Phone to Agent">
        <form onSubmit={handleAllocate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sales Agent *</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Phone (IMEI) *</label>
            <select
              value={selectedPhoneImei}
              onChange={(e) => setSelectedPhoneImei(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a phone...</option>
              {availablePhones.map((phone) => (
                <option key={phone.imei} value={phone.imei}>
                  {phone.model} - IMEI: {phone.imei}
                </option>
              ))}
            </select>
          </div>

          {selectedPhoneImei && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-medium">Phone Details:</p>
              {availablePhones.find((p) => p.imei === selectedPhoneImei) && (
                <>
                  <p>Model: {availablePhones.find((p) => p.imei === selectedPhoneImei)?.model}</p>
                  <p>Serial: {availablePhones.find((p) => p.imei === selectedPhoneImei)?.serialNumber}</p>
                  <p>Condition: {availablePhones.find((p) => p.imei === selectedPhoneImei)?.condition}</p>
                </>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAllocationForm(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
            >
              Allocate Phone
            </button>
          </div>
        </form>
      </Modal>

      {/* Agents Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const agentPhones = getAgentPhones(agent.id);
          const stats = getAgentStats(agent.id);

          return (
            <div
              key={agent.id}
              className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition cursor-pointer"
              onClick={() => setDetailModalAgent(agent)}
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
                    <p className="text-lg font-bold text-blue-600">{stats.totalAllocated}</p>
                    <p className="text-xs text-gray-600">Allocated</p>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <p className="text-lg font-bold text-green-600">{stats.totalSold}</p>
                    <p className="text-xs text-gray-600">Sold</p>
                  </div>
                  <div className="bg-amber-50 rounded p-2">
                    <p className="text-lg font-bold text-amber-600">{stats.totalUnsold}</p>
                    <p className="text-xs text-gray-600">In Stock</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-xl font-bold text-primary">{stats.conversionRate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-bold text-gray-900">{formatCurrency(agent.totalRevenue)}</p>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 text-center">
                  Click to view details, stocks & edit
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg shadow text-white p-6">
        <h3 className="text-lg font-bold mb-4">Overall Team Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm opacity-90">Total Agents</p>
            <p className="text-3xl font-bold">{agents.length}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Total Allocated</p>
            <p className="text-3xl font-bold">{allocatedPhones.length}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Total Sold</p>
            <p className="text-3xl font-bold">
              {allocatedPhones.filter((p) => p.status === 'sold').length}
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
