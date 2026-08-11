'use client';

import { useState } from 'react';
import { Phone, PHONE_CATALOG } from '../types/phones';

export default function PhoneInventory() {
  const [phones] = useState<Phone[]>(PHONE_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null);

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
          <p className="text-gray-600 mt-1">Manage available phones and pricing</p>
        </div>
        <button className="px-4 py-2 bg-primary hover:bg-emerald-700 text-white rounded-lg transition">
          + Add Phone Model
        </button>
      </div>

      {/* Quick Stats */}
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
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{phone.model}</td>
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
                      onClick={() => setSelectedPhone(phone)}
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
    </div>
  );
}
