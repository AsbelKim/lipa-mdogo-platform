'use client';

import { useState } from 'react';
import Modal from './Modal';

interface Dealer {
  id: string;
  name: string;
  logo: string;
  phone: string;
  email: string;
  location: string;
  region: string;
  dealerId: string;
  registeredDate: string;
  status: 'active' | 'inactive';
  contactPerson: string;
  address: string;
}

interface SalesAgent {
  id: string;
  name: string;
  phone: string;
  dealerId: string;
  totalSales: number;
}

export default function DealerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState({
    agent: '',
    description: '',
    quantity: '',
    amount: '',
  });

  const dealers: Dealer[] = [
    {
      id: 'dealer-1',
      name: 'Mombasa Electronics Hub',
      logo: '🏪',
      phone: '+254712222222',
      email: 'info@mombasaelectronics.co.ke',
      location: 'Mombasa - Kenyatta Avenue',
      region: 'Mombasa',
      dealerId: 'DEAL-001',
      registeredDate: '2025-06-01',
      status: 'active',
      contactPerson: 'Ahmed Hassan',
      address: 'Plot 45, Kenyatta Avenue, Mombasa',
    },
    {
      id: 'dealer-2',
      name: 'Nairobi Tech Store',
      logo: '📱',
      phone: '+254713333333',
      email: 'contact@nairobitechtore.co.ke',
      location: 'Nairobi - Westlands',
      region: 'Nairobi',
      dealerId: 'DEAL-002',
      registeredDate: '2025-07-15',
      status: 'active',
      contactPerson: 'Grace Kamau',
      address: 'Suite 200, Westlands Plaza, Nairobi',
    },
    {
      id: 'dealer-3',
      name: 'Kisumu Mobile Center',
      logo: '📞',
      phone: '+254714444444',
      email: 'sales@kisumumobilecentre.co.ke',
      location: 'Kisumu - Town Center',
      region: 'Kisumu',
      dealerId: 'DEAL-003',
      registeredDate: '2025-08-05',
      status: 'active',
      contactPerson: 'Peter Odhiambo',
      address: 'Main Street, Kisumu Town Center',
    },
    {
      id: 'dealer-4',
      name: 'Nakuru Digital Solutions',
      logo: '💻',
      phone: '+254715555555',
      email: 'support@nakurudigital.co.ke',
      location: 'Nakuru - Central',
      region: 'Nakuru',
      dealerId: 'DEAL-004',
      registeredDate: '2025-05-20',
      status: 'active',
      contactPerson: 'Susan Kipchoge',
      address: 'Central Business District, Nakuru',
    },
  ];

  const agents: SalesAgent[] = [
    { id: 'agent-1', name: 'Michael Kipchoge', phone: '+254787654321', dealerId: 'dealer-1', totalSales: 28 },
    { id: 'agent-2', name: 'Rose Tata', phone: '+254787654322', dealerId: 'dealer-2', totalSales: 24 },
    { id: 'agent-3', name: 'James Mwangi', phone: '+254787654323', dealerId: 'dealer-1', totalSales: 32 },
    { id: 'agent-4', name: 'Fatima Hassan', phone: '+254787654324', dealerId: 'dealer-3', totalSales: 19 },
  ];

  const filteredDealers = dealers.filter((dealer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      dealer.name.toLowerCase().includes(searchLower) ||
      dealer.phone.includes(searchQuery) ||
      dealer.dealerId.includes(searchQuery) ||
      dealer.region.toLowerCase().includes(searchLower)
    );
  });

  const dealerAgents = selectedDealer ? agents.filter((a) => a.dealerId === selectedDealer.id) : [];

  const handleGenerateReceipt = () => {
    if (!selectedDealer || !receiptData.agent || !receiptData.description) {
      alert('Please fill in all required fields');
      return;
    }

    generateDealerReceipt(selectedDealer, receiptData.agent, receiptData.description, receiptData.quantity, receiptData.amount);
    setReceiptData({ agent: '', description: '', quantity: '', amount: '' });
    setShowReceiptModal(false);
  };

  const generateDealerReceipt = (dealer: Dealer, agentName: string, description: string, quantity: string, amount: string) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Dealer Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #16A39E; padding-bottom: 15px; margin-bottom: 20px; }
          .logo { font-size: 48px; margin-bottom: 10px; }
          .dealer-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .receipt-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .receipt-table th { background: #16A39E; color: white; padding: 10px; text-align: left; }
          .receipt-table td { padding: 10px; border-bottom: 1px solid #ddd; }
          .summary { text-align: right; margin-bottom: 20px; font-weight: bold; }
          .footer { text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">${dealer.logo}</div>
          <h2>${dealer.name}</h2>
          <p style="margin: 5px 0; color: #666;">Dealer ID: ${dealer.dealerId}</p>
          <p style="margin: 5px 0; color: #666;">Phone: ${dealer.phone}</p>
        </div>

        <div class="dealer-info">
          <h4 style="margin-top: 0;">Sales Agent: <strong>${agentName}</strong></h4>
          <p><strong>Location:</strong> ${dealer.location}</p>
          <p><strong>Address:</strong> ${dealer.address}</p>
          <p><strong>Contact Person:</strong> ${dealer.contactPerson}</p>
          <p><strong>Email:</strong> ${dealer.email}</p>
        </div>

        <table class="receipt-table">
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>${description}</td>
            <td>${quantity || '-'}</td>
            <td>KES ${amount ? parseInt(amount).toLocaleString('en-KE') : '-'}</td>
          </tr>
        </table>

        ${amount ? `<div class="summary">Total Amount: KES ${parseInt(amount).toLocaleString('en-KE')}</div>` : ''}

        <div class="footer">
          <p>Receipt Generated: ${new Date().toLocaleDateString('en-KE')} at ${new Date().toLocaleTimeString('en-KE')}</p>
          <p>This is an official receipt from ${dealer.name}</p>
          <p>For inquiries, contact: ${dealer.phone}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow?.document.write(receiptHTML);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🏪 Dealer Management</h1>
        <p className="text-gray-600 mt-1">Manage dealer profiles, branding, and generate sales receipts</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Total Dealers</p>
          <p className="text-3xl font-bold text-blue-600">{dealers.length}</p>
          <p className="text-xs text-gray-500 mt-1">active dealers</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Sales Agents</p>
          <p className="text-3xl font-bold text-green-600">{agents.length}</p>
          <p className="text-xs text-gray-500 mt-1">assigned to dealers</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-3xl font-bold text-purple-600">{agents.reduce((sum, a) => sum + a.totalSales, 0)}</p>
          <p className="text-xs text-gray-500 mt-1">by all agents</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search by dealer name, phone, ID, or region..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Dealers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredDealers.map((dealer) => (
          <div key={dealer.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            {/* Dealer Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
              <div className="text-5xl mb-2">{dealer.logo}</div>
              <h3 className="text-xl font-bold">{dealer.name}</h3>
              <p className="text-sm opacity-90">{dealer.dealerId}</p>
            </div>

            {/* Dealer Info */}
            <div className="p-6 space-y-3">
              <div>
                <p className="text-xs text-gray-600">Contact Person</p>
                <p className="font-medium text-gray-900">{dealer.contactPerson}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{dealer.phone}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm text-gray-600 break-all">{dealer.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600">Location</p>
                <p className="font-medium text-gray-900">{dealer.location}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600">Address</p>
                <p className="text-sm text-gray-600">{dealer.address}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    dealer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {dealer.status === 'active' ? '✓ Active' : '○ Inactive'}
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {dealerAgents.length} Agent{dealerAgents.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setSelectedDealer(dealer)}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setSelectedDealer(dealer);
                    setShowReceiptModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-secondary hover:bg-orange-600 text-white rounded-lg transition font-medium"
                >
                  Generate Receipt
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dealer Details Modal */}
      {selectedDealer && !showReceiptModal && (
        <Modal isOpen={!!selectedDealer} onClose={() => setSelectedDealer(null)} title={`${selectedDealer.logo} ${selectedDealer.name}`}>
          <div className="space-y-6">
            {/* Dealer Profile */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dealer Profile</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">Dealer ID</p>
                  <p className="font-medium text-gray-900">{selectedDealer.dealerId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-gray-900">{selectedDealer.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Region</p>
                  <p className="font-medium text-gray-900">{selectedDealer.region}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registered Date</p>
                  <p className="font-medium text-gray-900">{new Date(selectedDealer.registeredDate).toLocaleDateString('en-KE')}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{selectedDealer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{selectedDealer.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="font-medium text-gray-900">{selectedDealer.contactPerson}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{selectedDealer.address}</p>
                </div>
              </div>
            </div>

            {/* Assigned Sales Agents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Sales Agents ({dealerAgents.length})</h3>
              {dealerAgents.length > 0 ? (
                <div className="space-y-2">
                  {dealerAgents.map((agent) => (
                    <div key={agent.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{agent.name}</p>
                        <p className="text-sm text-gray-600">{agent.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600">Sales</p>
                        <p className="text-lg font-bold text-primary">{agent.totalSales}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No sales agents assigned to this dealer</p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Receipt Generation Modal */}
      {showReceiptModal && selectedDealer && (
        <Modal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} title={`Generate Receipt - ${selectedDealer.name}`}>
          <div className="space-y-4">
            {/* Agent Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Sales Agent</label>
              <select
                value={receiptData.agent}
                onChange={(e) => setReceiptData({ ...receiptData, agent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Choose Agent --</option>
                {dealerAgents.map((agent) => (
                  <option key={agent.id} value={agent.name}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description / Item Details</label>
              <textarea
                value={receiptData.description}
                onChange={(e) => setReceiptData({ ...receiptData, description: e.target.value })}
                placeholder="e.g., Samsung Galaxy A05 - 10 units"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              ></textarea>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (Optional)</label>
              <input
                type="number"
                value={receiptData.quantity}
                onChange={(e) => setReceiptData({ ...receiptData, quantity: e.target.value })}
                placeholder="e.g., 10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount in KES (Optional)</label>
              <input
                type="number"
                value={receiptData.amount}
                onChange={(e) => setReceiptData({ ...receiptData, amount: e.target.value })}
                placeholder="e.g., 185000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              ℹ️ Receipt will be generated in a new window for printing or saving as PDF
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReceipt}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
              >
                Generate & Print Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
