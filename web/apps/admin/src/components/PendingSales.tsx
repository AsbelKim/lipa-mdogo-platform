'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';

interface PendingSale {
  id: string;
  agentName: string;
  agentPhone: string;
  customerName: string;
  customerPhone: string;
  phoneModel: string;
  imei: string;
  serialNumber: string;
  downPayment: number;
  totalPrice: number;
  installmentMonths: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export default function PendingSales() {
  const [sales, setSales] = useState<PendingSale[]>([]);
  const [selectedSale, setSelectedSale] = useState<PendingSale | null>(null);
  const [approvalReason, setApprovalReason] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedSales = localStorage.getItem('pendingSales');
    if (savedSales) {
      try {
        setSales(JSON.parse(savedSales));
      } catch (e) {
        console.error('Failed to load sales:', e);
      }
    } else {
      // Initialize with sample data
      const defaultSales: PendingSale[] = [
        {
          id: 'sale-1',
          agentName: 'Michael Kipchoge',
          agentPhone: '+254787654321',
          customerName: 'John Mwangi',
          customerPhone: '+254712345678',
          phoneModel: 'Samsung Galaxy A05',
          imei: '359072080276522',
          serialNumber: 'RF9DL1A20GU',
          downPayment: 5000,
          totalPrice: 18500,
          installmentMonths: 12,
          submittedDate: new Date().toISOString(),
          status: 'pending',
        },
        {
          id: 'sale-2',
          agentName: 'Rose Tata',
          agentPhone: '+254787654322',
          customerName: 'Jane Smith',
          customerPhone: '+254712345679',
          phoneModel: 'Samsung Galaxy A16 5G',
          imei: '359072080276523',
          serialNumber: 'RF9DL1A20GV',
          downPayment: 6000,
          totalPrice: 28000,
          installmentMonths: 12,
          submittedDate: new Date(Date.now() - 86400000).toISOString(),
          status: 'pending',
        },
      ];
      setSales(defaultSales);
      localStorage.setItem('pendingSales', JSON.stringify(defaultSales));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pendingSales', JSON.stringify(sales));
    }
  }, [sales, isLoaded]);

  const handleApproveSale = (sale: PendingSale) => {
    const updatedSales = sales.map((s) =>
      s.id === sale.id
        ? { ...s, status: 'approved' as const, notes: approvalReason }
        : s
    );
    setSales(updatedSales);

    // Move to sold phones
    const soldPhone = {
      id: sale.id,
      agentName: sale.agentName,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      phoneModel: sale.phoneModel,
      imei: sale.imei,
      serialNumber: sale.serialNumber,
      downPayment: sale.downPayment,
      totalPrice: sale.totalPrice,
      installmentMonths: sale.installmentMonths,
      saleDateApproved: new Date().toISOString(),
      receiptId: `RCP-${Date.now()}`,
      status: 'approved',
    };

    const existingSoldPhones = localStorage.getItem('soldPhones');
    const soldPhones = existingSoldPhones ? JSON.parse(existingSoldPhones) : [];
    localStorage.setItem('soldPhones', JSON.stringify([...soldPhones, soldPhone]));

    setSelectedSale(null);
    setApprovalReason('');
    alert('✅ Sale approved! Receipt generated and sent to agent.');
  };

  const handleRejectSale = (sale: PendingSale) => {
    if (!approvalReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    const updatedSales = sales.map((s) =>
      s.id === sale.id
        ? { ...s, status: 'rejected' as const, notes: approvalReason }
        : s
    );
    setSales(updatedSales);
    setSelectedSale(null);
    setApprovalReason('');
    alert('❌ Sale rejected. Agent has been notified.');
  };

  const pendingSalesCount = sales.filter((s) => s.status === 'pending').length;
  const approvedSalesCount = sales.filter((s) => s.status === 'approved').length;

  if (!isLoaded) {
    return <div className="text-center py-8">Loading sales data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📋 Sales Approval</h1>
        <p className="text-gray-600 mt-1">Review and approve agent sales submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingSalesCount}</p>
          <p className="text-xs text-gray-500 mt-1">awaiting review</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-3xl font-bold text-green-600">{approvedSalesCount}</p>
          <p className="text-xs text-gray-500 mt-1">receipts generated</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-600">
            KES {sales.filter((s) => s.status === 'approved').reduce((sum, s) => sum + s.totalPrice, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">from approved sales</p>
        </div>
      </div>

      {/* Pending Sales List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Pending Sales</h2>
        {pendingSalesCount === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">✅ All sales approved! No pending items.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sales
              .filter((s) => s.status === 'pending')
              .map((sale) => (
                <div key={sale.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">{sale.customerName}</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Agent: {sale.agentName}</p>
                      <p className="text-sm text-gray-600">Phone: {sale.phoneModel}</p>
                      <p className="text-xs text-gray-500 font-mono mt-1">IMEI: {sale.imei}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">KES {sale.totalPrice.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Down: KES {sale.downPayment.toLocaleString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSale(sale)}
                    className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition font-medium text-sm"
                  >
                    Review & Approve/Reject
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Approved Sales History */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Approved Sales</h2>
        {approvedSalesCount === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">No approved sales yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sales
              .filter((s) => s.status === 'approved')
              .map((sale) => (
                <div key={sale.id} className="bg-green-50 rounded-lg border border-green-200 p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{sale.customerName}</p>
                      <p className="text-gray-600">{sale.phoneModel} • Agent: {sale.agentName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-700">✓ Approved</p>
                      <p className="text-xs text-gray-500">KES {sale.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {selectedSale && (
        <Modal
          isOpen={!!selectedSale}
          onClose={() => {
            setSelectedSale(null);
            setApprovalReason('');
          }}
          title="Review Sale Submission"
        >
          <div className="space-y-6">
            {/* Sale Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sale Details</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-medium text-gray-900">{selectedSale.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium text-gray-900">{selectedSale.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sales Agent</p>
                  <p className="font-medium text-gray-900">{selectedSale.agentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agent Phone</p>
                  <p className="font-medium text-gray-900">{selectedSale.agentPhone}</p>
                </div>
              </div>
            </div>

            {/* Phone Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phone Details</h3>
              <div className="grid grid-cols-2 gap-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Model</p>
                  <p className="font-medium text-gray-900">{selectedSale.phoneModel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">IMEI</p>
                  <p className="font-mono text-gray-900">{selectedSale.imei}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Serial Number</p>
                  <p className="font-mono text-gray-900">{selectedSale.serialNumber}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Terms</h3>
              <div className="grid grid-cols-2 gap-4 bg-green-50 rounded-lg p-4 border border-green-200">
                <div>
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="text-2xl font-bold text-green-600">KES {selectedSale.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Down Payment</p>
                  <p className="text-2xl font-bold text-gray-900">KES {selectedSale.downPayment.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Installment Period</p>
                  <p className="font-medium text-gray-900">{selectedSale.installmentMonths} months</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Monthly Payment</p>
                  <p className="text-lg font-bold text-gray-900">
                    KES {Math.round((selectedSale.totalPrice - selectedSale.downPayment) / selectedSale.installmentMonths).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Approval Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval/Rejection Notes (required for rejection)
              </label>
              <textarea
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                placeholder="Add notes about this sale..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm h-24"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleApproveSale(selectedSale)}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-bold"
              >
                ✓ Approve Sale & Generate Receipt
              </button>
              <button
                onClick={() => handleRejectSale(selectedSale)}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-bold"
              >
                ✕ Reject Sale
              </button>
              <button
                onClick={() => {
                  setSelectedSale(null);
                  setApprovalReason('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
