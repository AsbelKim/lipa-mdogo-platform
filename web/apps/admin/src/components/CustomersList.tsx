'use client';

import { useState } from 'react';
import Modal from './Modal';

interface Customer {
  id: string;
  fullName: string;
  nationalId: string;
  phone: string;
  email: string;
  location: string;
  status: 'active' | 'inactive' | 'blacklisted';
  registeredDate: string;
  totalPurchases: number;
  totalSpent: number;
  lastPurchaseDate?: string;
  lastPurchaseModel?: string;
}

export default function CustomersList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customers: Customer[] = [
    {
      id: '1',
      fullName: 'John Mwangi Kipchoge',
      nationalId: '12345678',
      phone: '+254712345678',
      email: 'john.kipchoge@email.com',
      location: 'Nairobi',
      status: 'active',
      registeredDate: '2026-01-15',
      totalPurchases: 3,
      totalSpent: 65500,
      lastPurchaseDate: '2026-08-10',
      lastPurchaseModel: 'Samsung Galaxy A05',
    },
    {
      id: '2',
      fullName: 'Jane Adhiambo Smith',
      nationalId: '87654321',
      phone: '+254712345679',
      email: 'jane.smith@email.com',
      location: 'Mombasa',
      status: 'active',
      registeredDate: '2026-02-20',
      totalPurchases: 2,
      totalSpent: 50000,
      lastPurchaseDate: '2026-08-09',
      lastPurchaseModel: 'Samsung Galaxy A06',
    },
    {
      id: '3',
      fullName: 'Peter Johnson Otieno',
      nationalId: '11223344',
      phone: '+254712345680',
      email: 'peter.otieno@email.com',
      location: 'Kisumu',
      status: 'active',
      registeredDate: '2026-03-10',
      totalPurchases: 1,
      totalSpent: 28000,
      lastPurchaseDate: '2026-08-08',
      lastPurchaseModel: 'Samsung Galaxy A16 5G',
    },
    {
      id: '4',
      fullName: 'Alice Kariuki Njeri',
      nationalId: '55667788',
      phone: '+254712345681',
      email: 'alice.njeri@email.com',
      location: 'Nairobi',
      status: 'inactive',
      registeredDate: '2026-04-05',
      totalPurchases: 0,
      totalSpent: 0,
    },
    {
      id: '5',
      fullName: 'Bob Wilson Kipchoge',
      nationalId: '99887766',
      phone: '+254712345682',
      email: 'bob.wilson@email.com',
      location: 'Nakuru',
      status: 'active',
      registeredDate: '2026-05-12',
      totalPurchases: 1,
      totalSpent: 32000,
      lastPurchaseDate: '2026-08-06',
      lastPurchaseModel: 'Samsung Galaxy A26 5G',
    },
    {
      id: '6',
      fullName: 'Grace Wanjiru Kamau',
      nationalId: '44556677',
      phone: '+254712345683',
      email: 'grace.kamau@email.com',
      location: 'Kiambu',
      status: 'blacklisted',
      registeredDate: '2026-06-01',
      totalPurchases: 1,
      totalSpent: 20000,
    },
  ];

  const filteredCustomers = customers
    .filter((customer) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        customer.fullName.toLowerCase().includes(searchLower) ||
        customer.phone.includes(searchQuery) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.nationalId.includes(searchQuery)
      );
    })
    .filter((customer) => filterStatus === 'all' || customer.status === filterStatus);

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

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'active').length;
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👥 Customers</h1>
          <p className="text-gray-600 mt-1">Manage customer information and purchase history</p>
        </div>
        <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition font-medium">
          + Add Customer
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-3xl font-bold text-blue-600">{totalCustomers}</p>
          <p className="text-xs text-gray-500 mt-1">registered</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Active Customers</p>
          <p className="text-3xl font-bold text-green-600">{activeCustomers}</p>
          <p className="text-xs text-gray-500 mt-1">active status</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalSpent)}</p>
          <p className="text-xs text-gray-500 mt-1">from customers</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, phone, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">National ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Purchases</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Total Spent</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{customer.fullName}</p>
                      <p className="text-gray-600">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{customer.nationalId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.location}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {customer.totalPurchases}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : customer.status === 'inactive'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {customer.status === 'active' ? '✓ Active' : customer.status === 'inactive' ? '○ Inactive' : '✕ Blacklisted'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
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

      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">No customers found matching your criteria</p>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Details - ${selectedCustomer.fullName}`}
        >
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">National ID</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.nationalId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.location}</p>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCustomer.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : selectedCustomer.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registered Date</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedCustomer.registeredDate)}</p>
                </div>
              </div>
            </div>

            {/* Purchase History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase History</h3>
              <div className="grid grid-cols-3 gap-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div>
                  <p className="text-sm text-gray-600">Total Purchases</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalPurchases}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount Spent</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedCustomer.totalSpent)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Per Purchase</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedCustomer.totalPurchases > 0
                      ? formatCurrency(selectedCustomer.totalSpent / selectedCustomer.totalPurchases)
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Last Purchase */}
            {selectedCustomer.lastPurchaseDate && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Purchase</h3>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">{formatDate(selectedCustomer.lastPurchaseDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Model</p>
                      <p className="font-medium text-gray-900">{selectedCustomer.lastPurchaseModel}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
