'use client';

import { useState } from 'react';
import Modal from './Modal';

interface SoldPhone {
  id: string;
  imei: string;
  model: string;
  serialNumber: string;
  soldDate: string;
  condition: 'new' | 'refurbished' | 'used';
  salePrice: number;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
    nationalId: string;
    location: string;
  };
  agent: {
    name: string;
    phone: string;
    email: string;
  };
  paymentMethod: 'cash' | 'mpesa' | 'bank_transfer';
  installmentMonths: number;
  monthlyPayment: number;
}

export default function SoldPhonesList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModel, setFilterModel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'price' | 'agent'>('recent');
  const [selectedPhone, setSelectedPhone] = useState<SoldPhone | null>(null);

  // Mock sold phones data
  const soldPhones: SoldPhone[] = [
    {
      id: 'sale-1',
      imei: '123456789012345',
      model: 'Samsung Galaxy A05',
      serialNumber: 'SN001',
      condition: 'new',
      soldDate: '2026-08-10',
      salePrice: 18500,
      customer: {
        id: 'cust-1',
        name: 'John Mwangi Kipchoge',
        phone: '+254712345678',
        email: 'john.kipchoge@email.com',
        nationalId: '12345678',
        location: 'Nairobi',
      },
      agent: {
        name: 'Michael Kipchoge',
        phone: '+254787654321',
        email: 'michael@watucredit.co.ke',
      },
      paymentMethod: 'mpesa',
      installmentMonths: 12,
      monthlyPayment: 1500,
    },
    {
      id: 'sale-2',
      imei: '223456789012345',
      model: 'Samsung Galaxy A06',
      serialNumber: 'SN002',
      condition: 'new',
      soldDate: '2026-08-09',
      salePrice: 22000,
      customer: {
        id: 'cust-2',
        name: 'Jane Adhiambo Smith',
        phone: '+254712345679',
        email: 'jane.smith@email.com',
        nationalId: '87654321',
        location: 'Mombasa',
      },
      agent: {
        name: 'Rose Tata',
        phone: '+254787654322',
        email: 'rose@watucredit.co.ke',
      },
      paymentMethod: 'bank_transfer',
      installmentMonths: 18,
      monthlyPayment: 1200,
    },
    {
      id: 'sale-3',
      imei: '323456789012345',
      model: 'Samsung Galaxy A16 5G',
      serialNumber: 'SN003',
      condition: 'refurbished',
      soldDate: '2026-08-08',
      salePrice: 28000,
      customer: {
        id: 'cust-3',
        name: 'Peter Johnson Otieno',
        phone: '+254712345680',
        email: 'peter.otieno@email.com',
        nationalId: '11223344',
        location: 'Kisumu',
      },
      agent: {
        name: 'James Mwangi',
        phone: '+254787654323',
        email: 'james@watucredit.co.ke',
      },
      paymentMethod: 'cash',
      installmentMonths: 24,
      monthlyPayment: 1150,
    },
    {
      id: 'sale-4',
      imei: '423456789012345',
      model: 'Samsung Galaxy A05',
      serialNumber: 'SN004',
      condition: 'new',
      soldDate: '2026-08-07',
      salePrice: 18500,
      customer: {
        id: 'cust-4',
        name: 'Alice Kariuki Njeri',
        phone: '+254712345681',
        email: 'alice.njeri@email.com',
        nationalId: '55667788',
        location: 'Nairobi',
      },
      agent: {
        name: 'Fatima Hassan',
        phone: '+254787654324',
        email: 'fatima@watucredit.co.ke',
      },
      paymentMethod: 'mpesa',
      installmentMonths: 12,
      monthlyPayment: 1500,
    },
    {
      id: 'sale-5',
      imei: '523456789012345',
      model: 'Samsung Galaxy A26 5G',
      serialNumber: 'SN005',
      condition: 'new',
      soldDate: '2026-08-06',
      salePrice: 32000,
      customer: {
        id: 'cust-5',
        name: 'Bob Wilson Kipchoge',
        phone: '+254712345682',
        email: 'bob.wilson@email.com',
        nationalId: '99887766',
        location: 'Nakuru',
      },
      agent: {
        name: 'David Kipchoge',
        phone: '+254787654325',
        email: 'david@watucredit.co.ke',
      },
      paymentMethod: 'mpesa',
      installmentMonths: 20,
      monthlyPayment: 1600,
    },
  ];

  const filteredPhones = soldPhones
    .filter((phone) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        phone.customer.name.toLowerCase().includes(searchLower) ||
        phone.customer.phone.includes(searchQuery) ||
        phone.imei.includes(searchQuery) ||
        phone.customer.nationalId.includes(searchQuery)
      );
    })
    .filter((phone) => filterModel === 'all' || phone.model === filterModel)
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.soldDate).getTime() - new Date(a.soldDate).getTime();
      } else if (sortBy === 'price') {
        return b.salePrice - a.salePrice;
      } else if (sortBy === 'agent') {
        return a.agent.name.localeCompare(b.agent.name);
      }
      return 0;
    });

  const phoneModels = [...new Set(soldPhones.map((p) => p.model))];
  const totalRevenue = soldPhones.reduce((sum, p) => sum + p.salePrice, 0);
  const totalPhonesSold = soldPhones.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-KE');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📲 Sold Phones</h1>
        <p className="text-gray-600 mt-1">Track all phones sold to customers with payment details</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Total Sold</p>
          <p className="text-3xl font-bold text-green-600">{totalPhonesSold}</p>
          <p className="text-xs text-gray-500 mt-1">phones sold</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-gray-500 mt-1">from sales</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">Average Price</p>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(totalRevenue / totalPhonesSold)}
          </p>
          <p className="text-xs text-gray-500 mt-1">per phone</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by customer name, phone, IMEI, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Model</label>
            <select
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Models</option>
              {phoneModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="price">Highest Price</option>
              <option value="agent">Agent Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sold Phones Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone Model</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">IMEI</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Agent</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Sale Price</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Payment</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Installment</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPhones.map((phone) => (
                <tr key={phone.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(phone.soldDate)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{phone.customer.name}</p>
                      <p className="text-gray-600">{phone.customer.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{phone.model}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{phone.imei}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{phone.agent.name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                    {formatCurrency(phone.salePrice)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        phone.paymentMethod === 'mpesa'
                          ? 'bg-blue-100 text-blue-800'
                          : phone.paymentMethod === 'cash'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {phone.paymentMethod === 'mpesa' ? 'M-Pesa' : phone.paymentMethod === 'cash' ? 'Cash' : 'Bank'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {phone.installmentMonths}mo @ {formatCurrency(phone.monthlyPayment)}/mo
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => setSelectedPhone(phone)}
                      className="text-primary hover:underline font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPhones.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">No sold phones found matching your criteria</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedPhone && (
        <Modal
          isOpen={!!selectedPhone}
          onClose={() => setSelectedPhone(null)}
          title={`Sale Details - ${selectedPhone.customer.name}`}
        >
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-gray-900">{selectedPhone.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">National ID</p>
                  <p className="font-medium text-gray-900">{selectedPhone.customer.nationalId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium text-gray-900">{selectedPhone.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{selectedPhone.customer.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{selectedPhone.customer.location}</p>
                </div>
              </div>
            </div>

            {/* Phone Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phone Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">Phone Model</p>
                  <p className="font-medium text-gray-900">{selectedPhone.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">IMEI</p>
                  <p className="font-medium text-gray-900 font-mono">{selectedPhone.imei}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Serial Number</p>
                  <p className="font-medium text-gray-900">{selectedPhone.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Condition</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPhone.condition === 'new'
                        ? 'bg-green-100 text-green-800'
                        : selectedPhone.condition === 'refurbished'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {selectedPhone.condition.charAt(0).toUpperCase() + selectedPhone.condition.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sale Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sale Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">Sale Date</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedPhone.soldDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sale Price</p>
                  <p className="font-bold text-green-600">{formatCurrency(selectedPhone.salePrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sales Agent</p>
                  <p className="font-medium text-gray-900">{selectedPhone.agent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agent Contact</p>
                  <p className="font-medium text-gray-900">{selectedPhone.agent.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium text-gray-900">
                    {selectedPhone.paymentMethod === 'mpesa'
                      ? 'M-Pesa'
                      : selectedPhone.paymentMethod === 'cash'
                      ? 'Cash'
                      : 'Bank Transfer'}
                  </p>
                </div>
              </div>
            </div>

            {/* Installment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Installment Details</h3>
              <div className="grid grid-cols-2 gap-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-bold text-blue-600">{selectedPhone.installmentMonths} Months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Payment</p>
                  <p className="font-bold text-blue-600">{formatCurrency(selectedPhone.monthlyPayment)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-blue-600">
                    {formatCurrency(selectedPhone.monthlyPayment * selectedPhone.installmentMonths)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
