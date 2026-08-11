'use client';

import { useState } from 'react';

interface IndividualPhone {
  id: string;
  model: string;
  imei: string;
  serialNumber: string;
  status: 'in-stock' | 'allocated' | 'sold' | 'damaged' | 'lost';
  dateAdded: string;
  condition: 'new' | 'refurbished' | 'used';
}

interface IndividualPhoneListProps {
  phones: IndividualPhone[];
  onDelete?: (phoneId: string) => void;
}

export default function IndividualPhoneList({ phones, onDelete }: IndividualPhoneListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPhones = phones.filter(phone => {
    const searchMatch =
      phone.imei.includes(searchQuery) ||
      phone.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.serialNumber.includes(searchQuery);
    const statusMatch = filterStatus === 'all' || phone.status === filterStatus;
    return searchMatch && statusMatch;
  });

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

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'new':
        return <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">New</span>;
      case 'refurbished':
        return <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Refurbished</span>;
      case 'used':
        return <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded">Used</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-green-50 rounded p-3">
          <p className="text-xs text-gray-600">In Stock</p>
          <p className="text-xl font-bold text-green-600">{phones.filter(p => p.status === 'in-stock').length}</p>
        </div>
        <div className="bg-blue-50 rounded p-3">
          <p className="text-xs text-gray-600">Allocated</p>
          <p className="text-xl font-bold text-blue-600">{phones.filter(p => p.status === 'allocated').length}</p>
        </div>
        <div className="bg-purple-50 rounded p-3">
          <p className="text-xs text-gray-600">Sold</p>
          <p className="text-xl font-bold text-purple-600">{phones.filter(p => p.status === 'sold').length}</p>
        </div>
        <div className="bg-red-50 rounded p-3">
          <p className="text-xs text-gray-600">Damaged</p>
          <p className="text-xl font-bold text-red-600">{phones.filter(p => p.status === 'damaged').length}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-600">Total Units</p>
          <p className="text-xl font-bold text-gray-600">{phones.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by IMEI, Model, or Serial..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
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
      </div>

      {/* Phone List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Model</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">IMEI Number</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Serial</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Condition</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Date Added</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPhones.length > 0 ? (
                filteredPhones.map((phone) => (
                  <tr key={phone.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{phone.model}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono text-xs">{phone.imei}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{phone.serialNumber}</td>
                    <td className="px-4 py-3 text-center">{getConditionBadge(phone.condition)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(phone.status)}`}>
                        {phone.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {new Date(phone.dateAdded).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {onDelete && (
                        <button
                          onClick={() => onDelete(phone.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No phones found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
