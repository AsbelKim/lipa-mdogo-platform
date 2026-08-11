'use client';

import { useState } from 'react';
import { Phone, PHONE_CATALOG } from '../types/phones';
import IndividualPhoneList from './IndividualPhoneList';
import PhoneModelDetail from './PhoneModelDetail';
import BulkUploadModal from './BulkUploadModal';

interface IndividualPhone {
  id: string;
  model: string;
  imei: string;
  serialNumber: string;
  status: 'in-stock' | 'allocated' | 'sold' | 'damaged' | 'lost';
  dateAdded: string;
  condition: 'new' | 'refurbished' | 'used';
}

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

export default function PhoneInventory() {
  const [phones] = useState<Phone[]>(PHONE_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null);
  const [viewMode, setViewMode] = useState<'models' | 'individual'>('models');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedModelUnits, setSelectedModelUnits] = useState<PhoneUnit[]>([]);
  const [selectedModelName, setSelectedModelName] = useState('');
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  // Generate sample phone units for a model
  const generatePhoneUnits = (model: Phone): PhoneUnit[] => {
    const units: PhoneUnit[] = [];
    const statuses: Array<'in-stock' | 'allocated' | 'sold' | 'damaged' | 'lost'> = [
      'in-stock',
      'allocated',
      'sold',
      'in-stock',
      'damaged',
    ];
    const conditions: Array<'new' | 'refurbished' | 'used'> = ['new', 'refurbished', 'used'];
    const sampleAgents = ['Michael Kipchoge', 'Rose Tata', 'James Mwangi', 'Fatima Hassan'];
    const sampleCustomers = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Wilson'];

    for (let i = 0; i < model.stockQuantity; i++) {
      const status = statuses[i % statuses.length];
      const condition = conditions[i % conditions.length];
      const unit: PhoneUnit = {
        id: `${model.id}-unit-${i}`,
        imei: `35907208027652${String(i).padStart(2, '0')}`,
        serialNumber: `RF9DL1A${String(i).padStart(3, '0')}`,
        condition,
        status,
        dateAdded: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        allocatedAgent: status === 'allocated' ? sampleAgents[i % sampleAgents.length] : undefined,
        allocatedDate: status === 'allocated' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        soldTo: status === 'sold' ? sampleCustomers[i % sampleCustomers.length] : undefined,
        soldDate: status === 'sold' ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      };
      units.push(unit);
    }
    return units;
  };

  const openModelDetail = (phone: Phone) => {
    setSelectedModelName(phone.model);
    setSelectedModelUnits(generatePhoneUnits(phone));
    setDetailModalOpen(true);
  };

  const handleBulkUpload = (uploadedPhones: Array<{ model: string; imei: string; serialNumber: string; condition: string }>) => {
    const newPhones: IndividualPhone[] = uploadedPhones.map((phone, index) => ({
      id: `phone-${Date.now()}-${index}`,
      model: phone.model,
      imei: phone.imei,
      serialNumber: phone.serialNumber,
      status: 'in-stock' as const,
      dateAdded: new Date().toISOString(),
      condition: phone.condition as 'new' | 'refurbished' | 'used',
    }));
    setIndividualPhones(prev => [...prev, ...newPhones]);
    setBulkUploadOpen(false);
  };

  const [individualPhones, setIndividualPhones] = useState<IndividualPhone[]>([
    {
      id: 'phone-1',
      model: 'Samsung Galaxy A56 5G',
      imei: '359072080276522',
      serialNumber: 'RF9DL1A20GU',
      status: 'in-stock',
      dateAdded: new Date().toISOString(),
      condition: 'new',
    },
    {
      id: 'phone-2',
      model: 'Samsung Galaxy A56 5G',
      imei: '359072080276523',
      serialNumber: 'RF9DL1A20GV',
      status: 'in-stock',
      dateAdded: new Date().toISOString(),
      condition: 'new',
    },
    {
      id: 'phone-3',
      model: 'Samsung Galaxy A36 5G',
      imei: '359072080276524',
      serialNumber: 'RF9DL1A20GW',
      status: 'allocated',
      dateAdded: new Date().toISOString(),
      condition: 'refurbished',
    },
  ]);

  const filteredPhones = phones.filter((phone) => {
    const categoryMatch = selectedCategory === 'all' || phone.category === selectedCategory;
    const searchMatch =
      phone.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.specs.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const totalStock = phones.reduce((sum, p) => sum + p.stockQuantity, 0);
  const lowStockCount = phones.filter((p) => p.status === 'low-stock').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📱 Phone Inventory</h1>
          <p className="text-gray-600 mt-1">
            {viewMode === 'models' ? 'Manage phone models and pricing' : 'Track individual phones with IMEI numbers'}
          </p>
        </div>
        <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition">
          + {viewMode === 'models' ? 'Add Phone Model' : 'Add Phone'}
        </button>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setViewMode('models')}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            viewMode === 'models'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📊 Phone Models ({phones.length})
        </button>
        <button
          onClick={() => setViewMode('individual')}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            viewMode === 'individual'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📱 Individual Phones ({individualPhones.length})
        </button>
      </div>

      {viewMode === 'individual' && (
        <>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            💡 <strong>IMEI Tracking:</strong> Each phone has a unique 15-digit IMEI number for identification and tracking. Serial numbers help identify specific devices for warranty and support.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setBulkUploadOpen(true)}
            className="px-4 py-2 bg-secondary hover:bg-orange-600 text-white rounded-lg transition font-medium"
          >
            📤 Bulk Upload CSV
          </button>
        </div>
        </>
      )}

      {/* Quick Stats */}
      {viewMode === 'models' && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Stock</p>
          <p className="text-3xl font-bold text-blue-600">{totalStock}</p>
          <p className="text-xs text-gray-500 mt-1">units in stock</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Active Models</p>
          <p className="text-3xl font-bold text-green-600">{phones.length}</p>
          <p className="text-xs text-gray-500 mt-1">phone variants</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Low Stock Alert</p>
          <p className="text-3xl font-bold text-amber-600">{lowStockCount}</p>
          <p className="text-xs text-gray-500 mt-1">models</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Avg. Price</p>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(
              phones.reduce((sum, p) => sum + (p.estimatedTotalMin + p.estimatedTotalMax) / 2, 0) /
                phones.length
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">estimated</p>
        </div>
      </div>
      )}

      {viewMode === 'models' && (
      <>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search by model or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'budget', 'mid-range', 'premium'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'All' : cat.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Phone List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone Model</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Specs</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Down Payment</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Daily Payment</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Est. Price Range</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPhones.map((phone) => (
                <tr key={phone.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {phone.model}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{phone.specs}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">
                    <span className="font-semibold">{formatCurrency(phone.downPayment)}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">
                    <span className="font-semibold">{formatCurrency(phone.dailyInstallment)}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-600">
                    {formatCurrency(phone.estimatedTotalMin)} – {formatCurrency(phone.estimatedTotalMax)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        phone.stockQuantity > 20
                          ? 'bg-green-100 text-green-800'
                          : phone.stockQuantity > 10
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {phone.stockQuantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        phone.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : phone.status === 'low-stock'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {phone.status === 'low-stock' ? '⚠️ Low Stock' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button
                      onClick={() => openModelDetail(phone)}
                      className="text-primary hover:underline font-medium"
                    >
                      View
                    </button>
                    <button className="text-blue-600 hover:underline font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPhone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedPhone.model}</h2>
                <p className="text-gray-600">Specs: {selectedPhone.specs}</p>
              </div>
              <button
                onClick={() => setSelectedPhone(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Down Payment (Deposit)</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedPhone.downPayment)}</p>
                <p className="text-xs text-gray-500 mt-2">Required upfront</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Daily Installment</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedPhone.dailyInstallment)}</p>
                <p className="text-xs text-gray-500 mt-2">Per day payment</p>
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Estimated Cash Price</p>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(selectedPhone.estimatedTotalMin)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Range: {formatCurrency(selectedPhone.estimatedTotalMin)} – {formatCurrency(selectedPhone.estimatedTotalMax)}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Stock Available</p>
                <p className="text-2xl font-bold text-purple-600">{selectedPhone.stockQuantity}</p>
                <p className="text-xs text-gray-500 mt-2">units in warehouse</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Financing Overview (52-week loan)</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Weekly Cost:</strong> {formatCurrency(selectedPhone.dailyInstallment * 7)} (7 days)
                </p>
                <p>
                  <strong>Monthly Estimate:</strong> {formatCurrency(selectedPhone.dailyInstallment * 30)} (~30 days)
                </p>
                <p>
                  <strong>52-Week Total:</strong> {formatCurrency(selectedPhone.dailyInstallment * 364)} (includes interest)
                </p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  Note: Actual total will be higher due to interest accrual on asset financing
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-primary hover:bg-emerald-700 text-white rounded-lg transition font-medium">
                Edit Phone
              </button>
              <button
                onClick={() => setSelectedPhone(null)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredPhones.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">No phones found matching your filters</p>
        </div>
      )}
      </>
      )}

      {viewMode === 'individual' && (
        <div className="bg-white rounded-lg shadow p-6">
          <IndividualPhoneList
            phones={individualPhones}
            onDelete={(phoneId) => {
              setIndividualPhones(individualPhones.filter(p => p.id !== phoneId));
            }}
          />
        </div>
      )}

      {/* Phone Model Detail Modal */}
      <PhoneModelDetail
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        modelName={selectedModelName}
        units={selectedModelUnits}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        onUpload={handleBulkUpload}
      />
    </div>
  );
}
