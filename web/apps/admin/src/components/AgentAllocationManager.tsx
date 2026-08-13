'use client';

import { useState, useEffect } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);

  // Sample allocated phones data with localStorage persistence
  const [allocatedPhones, setAllocatedPhones] = useState<IndividualPhoneAllocation[]>([]);

  // All phones in inventory
  const allInventoryPhones: IndividualPhoneAllocation[] = [
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
    {
      id: 'phone-6',
      agentId: '',
      phoneId: 'phone-6',
      model: 'Samsung Galaxy A16 5G',
      imei: '359072080276527',
      serialNumber: 'RF9DL1A20GZ',
      condition: 'new',
      status: 'in-stock',
      dateAllocated: '',
    },
    {
      id: 'phone-7',
      agentId: '',
      phoneId: 'phone-7',
      model: 'Samsung Galaxy A26 5G',
      imei: '359072080276528',
      serialNumber: 'RF9DL1A20HA',
      condition: 'new',
      status: 'in-stock',
      dateAllocated: '',
    },
    {
      id: 'phone-8',
      agentId: '',
      phoneId: 'phone-8',
      model: 'Samsung Galaxy A36 5G',
      imei: '359072080276529',
      serialNumber: 'RF9DL1A20HB',
      condition: 'refurbished',
      status: 'in-stock',
      dateAllocated: '',
    },
  ];

  // Calculate available phones (not yet allocated)
  const availablePhones = allInventoryPhones.filter(
    (phone) => !allocatedPhones.some((alloc) => alloc.phoneId === phone.phoneId)
  );

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
    if (!phoneToAllocate) {
      alert('Phone is no longer available or already allocated');
      return;
    }

    const selectedAgentName = agents.find((a) => a.id === selectedAgent)?.name || 'Agent';
    const newAllocation: IndividualPhoneAllocation = {
      ...phoneToAllocate,
      agentId: selectedAgent,
      dateAllocated: new Date().toISOString(),
    };
    setAllocatedPhones([...allocatedPhones, newAllocation]);
    setSelectedAgent('');
    setSelectedPhoneImei('');
    setShowAllocationForm(false);
    alert(`✅ ${phoneToAllocate.model} allocated to ${selectedAgentName}!\n\nIMEI: ${phoneToAllocate.imei}`);
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

      {/* Inventory Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow text-white p-6">
        <h3 className="text-lg font-bold mb-4">📦 Inventory Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm opacity-90">Total Inventory</p>
            <p className="text-3xl font-bold">{allInventoryPhones.length}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Available (Unallocated)</p>
            <p className="text-3xl font-bold text-green-300">{availablePhones.length}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Allocated to Agents</p>
            <p className="text-3xl font-bold text-amber-300">{allocatedPhones.length}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Allocation Rate</p>
            <p className="text-3xl font-bold">
              {allInventoryPhones.length > 0
                ? Math.round((allocatedPhones.length / allInventoryPhones.length) * 100)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg shadow text-white p-6">
        <h3 className="text-lg font-bold mb-4">👥 Overall Team Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm opacity-90">Total Agents</p>
            <p className="text-3xl font-bold">{agents.length}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Total Sold</p>
            <p className="text-3xl font-bold">
              {allocatedPhones.filter((p) => p.status === 'sold').length}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-90">In Stock with Agents</p>
            <p className="text-3xl font-bold">
              {allocatedPhones.filter((p) => p.status === 'in-stock').length}
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

      {/* Agent Detail Modal */}
      {detailModalAgent && (
        <Modal
          isOpen={!!detailModalAgent}
          onClose={() => {
            setDetailModalAgent(null);
            setIsEditingAgent(false);
            setEditedAgent(null);
          }}
          title={`Agent Details - ${detailModalAgent.name}`}
        >
          <div className="space-y-6">
            {/* Agent Information */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Agent Information</h3>
                {!isEditingAgent && (
                  <button
                    onClick={() => handleEditAgent(detailModalAgent)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {isEditingAgent && editedAgent ? (
                <div className="space-y-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editedAgent.name}
                      onChange={(e) => setEditedAgent({ ...editedAgent, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editedAgent.phone}
                      onChange={(e) => setEditedAgent({ ...editedAgent, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editedAgent.email}
                      onChange={(e) => setEditedAgent({ ...editedAgent, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editedAgent.location}
                      onChange={(e) => setEditedAgent({ ...editedAgent, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveAgent}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                    >
                      ✓ Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingAgent(false);
                        setEditedAgent(null);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{detailModalAgent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{detailModalAgent.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{detailModalAgent.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{detailModalAgent.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Performance Stats */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                {(() => {
                  const stats = getAgentStats(detailModalAgent.id);
                  return (
                    <>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-600">Total Allocated</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalAllocated}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-gray-600">Units Sold</p>
                        <p className="text-2xl font-bold text-green-600">{stats.totalSold}</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <p className="text-sm text-gray-600">In Stock</p>
                        <p className="text-2xl font-bold text-amber-600">{stats.totalUnsold}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-sm text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Allocated Phones */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Assigned to Agent</h3>
              {(() => {
                const agentPhones = getAgentPhones(detailModalAgent.id);
                if (agentPhones.length === 0) {
                  return (
                    <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                      No phones allocated to this agent yet
                    </div>
                  );
                }

                return (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {agentPhones.map((phone) => (
                      <div key={phone.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{phone.model}</p>
                            <p className="text-xs text-gray-600 font-mono mt-1">IMEI: {phone.imei}</p>
                            <p className="text-xs text-gray-600">Serial: {phone.serialNumber}</p>
                          </div>
                          <div className="flex gap-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                                phone.status === 'sold'
                                  ? 'bg-green-100 text-green-800'
                                  : phone.status === 'in-stock'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {phone.status === 'sold' ? '✓ Sold' : phone.status === 'in-stock' ? '📱 In Stock' : 'Damaged'}
                            </span>
                            <button
                              onClick={() => handleRemovePhoneFromAgent(phone.id)}
                              className="px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-600">
                          <span>Condition: <strong>{phone.condition}</strong></span>
                          <span>Allocated: <strong>{new Date(phone.dateAllocated).toLocaleDateString()}</strong></span>
                          {phone.status === 'sold' && phone.customerName && (
                            <span>Customer: <strong>{phone.customerName}</strong></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Allocate New Phone */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Phone to Agent</h3>
              <div className="space-y-3 bg-green-50 rounded-lg p-4 border border-green-200">
                <select
                  value={selectedPhoneImei}
                  onChange={(e) => setSelectedPhoneImei(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a phone from available stock...</option>
                  {availablePhones.map((phone) => (
                    <option key={phone.imei} value={phone.imei}>
                      {phone.model} - IMEI: {phone.imei}
                    </option>
                  ))}
                </select>
                {selectedPhoneImei && (
                  <>
                    <div className="bg-white rounded p-3 text-sm text-gray-700 border border-green-300">
                      {availablePhones.find((p) => p.imei === selectedPhoneImei) && (
                        <>
                          <p>Model: <strong>{availablePhones.find((p) => p.imei === selectedPhoneImei)?.model}</strong></p>
                          <p>Serial: <strong>{availablePhones.find((p) => p.imei === selectedPhoneImei)?.serialNumber}</strong></p>
                          <p>Condition: <strong>{availablePhones.find((p) => p.imei === selectedPhoneImei)?.condition}</strong></p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const phoneToAllocate = availablePhones.find((p) => p.imei === selectedPhoneImei);
                        if (phoneToAllocate) {
                          const newAllocation: IndividualPhoneAllocation = {
                            ...phoneToAllocate,
                            agentId: detailModalAgent.id,
                            dateAllocated: new Date().toISOString(),
                          };
                          setAllocatedPhones([...allocatedPhones, newAllocation]);
                          setSelectedPhoneImei('');
                          alert('✅ Phone assigned to agent!');
                        }
                      }}
                      className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                    >
                      ✓ Assign Phone to {detailModalAgent.name}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
