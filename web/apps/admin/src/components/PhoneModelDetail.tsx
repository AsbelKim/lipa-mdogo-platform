'use client';

import { useState } from 'react';

interface PhoneUnit {
  id: string;
  imei: string;
  serialNumber: string;
  condition: 'new' | 'refurbished' | 'used';
  status: 'in-stock' | 'allocated' | 'sold' | 'damaged' | 'lost';
  dateAdded: string;
  allocatedAgent?: string;
  allocatedDate?: string;
  soldDate?: string;
  soldTo?: string;
}

interface PhoneModelDetailProps {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
  units: PhoneUnit[];
  onAllocate?: (unit: PhoneUnit, agentId: string) => void;
}

export default function PhoneModelDetail({
  isOpen,
  onClose,
  modelName,
  units,
  onAllocate,
}: PhoneModelDetailProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<PhoneUnit | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  const agents = [
    { id: 'agent-1', name: 'Michael Kipchoge', location: 'Nairobi' },
    { id: 'agent-2', name: 'Rose Tata', location: 'Mombasa' },
    { id: 'agent-3', name: 'James Mwangi', location: 'Kisumu' },
    { id: 'agent-4', name: 'Fatima Hassan', location: 'Nakuru' },
    { id: 'agent-5', name: 'David Kipchoge', location: 'Eldoret' },
    { id: 'agent-6', name: 'Susan Njeri', location: 'Kericho' },
  ];

  const handleAllocateClick = (unit: PhoneUnit) => {
    if (unit.status === 'in-stock') {
      setSelectedUnit(unit);
      setSelectedAgent('');
      setAllocationModalOpen(true);
    } else {
      alert('Only in-stock phones can be allocated');
    }
  };

  const handleConfirmAllocation = () => {
    if (selectedUnit && selectedAgent) {
      if (onAllocate) {
        onAllocate(selectedUnit, selectedAgent);
      }
      alert(`✅ Phone allocated successfully to ${agents.find(a => a.id === selectedAgent)?.name}`);
      setAllocationModalOpen(false);
      setSelectedUnit(null);
      setSelectedAgent('');
    }
  };

  if (!isOpen) return null;

  const filteredUnits = units.filter(unit => {
    const searchMatch =
      unit.imei.includes(searchQuery) ||
      unit.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = filterStatus === 'all' || unit.status === filterStatus;
    const conditionMatch = filterCondition === 'all' || unit.condition === filterCondition;
    return searchMatch && statusMatch && conditionMatch;
  });

  const stats = {
    total: units.length,
    inStock: units.filter(u => u.status === 'in-stock').length,
    allocated: units.filter(u => u.status === 'allocated').length,
    sold: units.filter(u => u.status === 'sold').length,
    damaged: units.filter(u => u.status === 'damaged').length,
    lost: units.filter(u => u.status === 'lost').length,
    new: units.filter(u => u.condition === 'new').length,
    refurbished: units.filter(u => u.condition === 'refurbished').length,
    used: units.filter(u => u.condition === 'used').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'allocated':
        return 'bg-blue-100 text-blue-800';
      case 'sold':
        return 'bg-purple-100 text-purple-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      case 'lost':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-50 text-green-700';
      case 'refurbished':
        return 'bg-blue-50 text-blue-700';
      case 'used':
        return 'bg-amber-50 text-amber-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{modelName}</h2>
            <p className="text-sm opacity-90">Total Units: {units.length}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 px-6 py-4 bg-gray-50 border-b">
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded p-3">
            <p className="text-xs text-gray-600">In Stock</p>
            <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
          </div>
          <div className="bg-blue-50 rounded p-3">
            <p className="text-xs text-gray-600">Allocated</p>
            <p className="text-2xl font-bold text-blue-600">{stats.allocated}</p>
          </div>
          <div className="bg-purple-50 rounded p-3">
            <p className="text-xs text-gray-600">Sold</p>
            <p className="text-2xl font-bold text-purple-600">{stats.sold}</p>
          </div>
          <div className="bg-red-50 rounded p-3">
            <p className="text-xs text-gray-600">Damaged</p>
            <p className="text-2xl font-bold text-red-600">{stats.damaged}</p>
          </div>
        </div>

        {/* Condition Stats */}
        <div className="grid grid-cols-3 gap-2 px-6 py-3 border-b bg-gray-50">
          <div className="bg-green-50 rounded p-2">
            <p className="text-xs text-gray-600">New</p>
            <p className="font-bold text-green-700">{stats.new}</p>
          </div>
          <div className="bg-blue-50 rounded p-2">
            <p className="text-xs text-gray-600">Refurbished</p>
            <p className="font-bold text-blue-700">{stats.refurbished}</p>
          </div>
          <div className="bg-amber-50 rounded p-2">
            <p className="text-xs text-gray-600">Used</p>
            <p className="font-bold text-amber-700">{stats.used}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b space-y-3">
          <input
            type="text"
            placeholder="Search by IMEI or Serial Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="allocated">Allocated</option>
              <option value="sold">Sold</option>
              <option value="damaged">Damaged</option>
              <option value="lost">Lost</option>
            </select>
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="all">All Conditions</option>
              <option value="new">New</option>
              <option value="refurbished">Refurbished</option>
              <option value="used">Used</option>
            </select>
          </div>
        </div>

        {/* Units Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Unit #</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">IMEI Number</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Serial Number</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Condition</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Added Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Details</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUnits.length > 0 ? (
                filteredUnits.map((unit, index) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">#{index + 1}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono text-xs">{unit.imei}</td>
                    <td className="px-4 py-3 text-gray-700 text-sm">{unit.serialNumber}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getConditionColor(unit.condition)}`}>
                        {unit.condition}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(unit.status)}`}>
                        {unit.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {new Date(unit.dateAdded).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {unit.status === 'allocated' && unit.allocatedAgent && (
                        <div>
                          <p>Allocated to: <strong>{unit.allocatedAgent}</strong></p>
                          {unit.allocatedDate && (
                            <p className="text-gray-500">{new Date(unit.allocatedDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      )}
                      {unit.status === 'sold' && unit.soldTo && (
                        <div>
                          <p>Sold to: <strong>{unit.soldTo}</strong></p>
                          {unit.soldDate && (
                            <p className="text-gray-500">{new Date(unit.soldDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      )}
                      {unit.status === 'in-stock' && (
                        <span className="text-green-600">Available</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {unit.status === 'in-stock' && (
                        <button
                          onClick={() => handleAllocateClick(unit)}
                          className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition font-medium"
                        >
                          Allocate
                        </button>
                      )}
                      {unit.status !== 'in-stock' && (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No phones found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-3 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredUnits.length} of {units.length} units
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
          >
            Close
          </button>
        </div>
      </div>

      {/* Allocation Modal */}
      {allocationModalOpen && selectedUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Allocate Phone to Agent</h3>

            {/* Phone Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">Phone Details:</p>
              <p className="font-mono text-sm font-medium mt-1">IMEI: {selectedUnit.imei}</p>
              <p className="text-sm text-gray-600">Serial: {selectedUnit.serialNumber}</p>
              <p className="text-sm text-gray-600">Model: {modelName}</p>
              <p className="text-sm text-gray-600">Condition: <span className="font-medium">{selectedUnit.condition}</span></p>
            </div>

            {/* Agent Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Sales Agent *
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose an agent...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAllocationModalOpen(false);
                  setSelectedUnit(null);
                  setSelectedAgent('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAllocation}
                disabled={!selectedAgent}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Allocate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
