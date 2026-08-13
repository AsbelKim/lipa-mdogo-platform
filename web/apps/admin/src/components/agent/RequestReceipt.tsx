'use client';

import { useState, useEffect } from 'react';
import Modal from '../Modal';
import { showToast } from '../Toast';

interface ReceiptRequest {
  id: string;
  agentId: string;
  agentName: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  description: string;
  screenshot: string; // base64 image
  status: 'pending' | 'approved' | 'ready';
  receiptId?: string;
  createdDate: string;
  approvedDate?: string;
}

export default function RequestReceipt() {
  const [requests, setRequests] = useState<ReceiptRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    amount: '',
    description: '',
    screenshot: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const agentId = localStorage.getItem('agent_id');
    const stored = localStorage.getItem('receiptRequests');
    if (stored && agentId) {
      try {
        const allRequests = JSON.parse(stored);
        const agentRequests = allRequests.filter((r: any) => r.agentId === agentId);
        setRequests(agentRequests);
      } catch (e) {
        console.error('Failed to load requests:', e);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, screenshot: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitRequest = async () => {
    if (!formData.customerName || !formData.customerPhone || !formData.amount || !formData.screenshot) {
      showToast('Please fill in all fields and upload a screenshot', 'error');
      return;
    }

    setIsLoading(true);

    // Convert image to base64
    const reader = new FileReader();
    reader.onload = () => {
      const agentId = localStorage.getItem('agent_id');
      const agentName = localStorage.getItem('agent_name');

      const newRequest: ReceiptRequest = {
        id: `req-${Date.now()}`,
        agentId: agentId || '',
        agentName: agentName || '',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        amount: parseInt(formData.amount),
        description: formData.description,
        screenshot: reader.result as string,
        status: 'pending',
        createdDate: new Date().toISOString(),
      };

      // Save to localStorage
      const stored = localStorage.getItem('receiptRequests');
      const allRequests = stored ? JSON.parse(stored) : [];
      allRequests.unshift(newRequest);
      localStorage.setItem('receiptRequests', JSON.stringify(allRequests));

      // AUTO-ADD CUSTOMER from receipt
      const newCustomer = {
        id: `cust-${Date.now()}`,
        agentId: agentId,
        name: formData.customerName,
        phone: formData.customerPhone,
        email: '',
        nationalId: '',
        location: '',
        nextOfKin: '',
        status: 'active',
        createdDate: new Date().toISOString(),
        receiptRequestId: newRequest.id, // Link to receipt request
      };

      const customersStored = localStorage.getItem('agentCustomers');
      const allCustomers = customersStored ? JSON.parse(customersStored) : [];
      allCustomers.unshift(newCustomer);
      localStorage.setItem('agentCustomers', JSON.stringify(allCustomers));

      // Add notification
      const notif = {
        type: 'receipt_requested',
        agentName,
        customerName: formData.customerName,
        amount: formData.amount,
      };
      window.dispatchEvent(new CustomEvent('addNotification', { detail: notif }));

      setRequests([newRequest, ...requests]);
      setFormData({ customerName: '', customerPhone: '', amount: '', description: '', screenshot: null });
      setPreviewImage('');
      setShowForm(false);
      setIsLoading(false);

      showToast(`Receipt request submitted and customer "${formData.customerName}" added!`, 'success');
    };
    reader.readAsDataURL(formData.screenshot!);
  };

  const downloadReceipt = async (receipt: ReceiptRequest) => {
    if (!receipt.receiptId) {
      showToast('Receipt not ready yet', 'info');
      return;
    }

    try {
      const { generateReceiptPDF } = await import('../../../utils/pdfReceiptGenerator');

      generateReceiptPDF({
        receiptId: receipt.receiptId,
        customerName: receipt.customerName,
        customerPhone: receipt.customerPhone,
        amount: receipt.amount,
        description: receipt.description,
        agentName: localStorage.getItem('agent_name') || '',
        approvalDate: receipt.approvedDate || new Date().toISOString(),
      });

      showToast(`Receipt ${receipt.receiptId} downloaded as PDF`, 'success');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      showToast('Failed to generate receipt PDF', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🧾 Request Receipt</h1>
          <p className="text-gray-600 mt-1">Submit screenshot from external system to get DAKIRO receipt</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
        >
          + Submit Screenshot
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">
            {requests.filter((r) => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">In Review</p>
          <p className="text-3xl font-bold text-blue-600">
            {requests.filter((r) => r.status === 'approved').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Ready</p>
          <p className="text-3xl font-bold text-green-600">
            {requests.filter((r) => r.status === 'ready').length}
          </p>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500">No receipt requests yet. Click "Submit Screenshot" to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{request.customerName}</p>
                  <p className="text-sm text-gray-600">📱 {request.customerPhone}</p>
                  <p className="text-sm text-gray-600">💰 KES {request.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    📅 {new Date(request.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  {request.status === 'pending' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                      ⏳ Pending
                    </span>
                  )}
                  {request.status === 'approved' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      👀 In Review
                    </span>
                  )}
                  {request.status === 'ready' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      ✅ Ready
                    </span>
                  )}
                </div>
              </div>

              {request.status === 'ready' && request.receiptId && (
                <button
                  onClick={() => downloadReceipt(request)}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm"
                >
                  📥 Download Receipt {request.receiptId}
                </button>
              )}
              {request.status !== 'ready' && (
                <p className="text-xs text-gray-500 text-center py-2">
                  Admin will review and generate receipt shortly...
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Request Modal */}
      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setPreviewImage('');
            setFormData({ customerName: '', customerPhone: '', amount: '', description: '', screenshot: null });
          }}
          title="Submit Receipt Screenshot"
        >
          <div className="space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="John Mwangi"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone *</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="+254712345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES) *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="18000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Samsung Galaxy A05"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Screenshot *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
              </div>

              {/* Preview */}
              {previewImage && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img src={previewImage} alt="Preview" className="max-w-full h-40 rounded-lg border" />
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSubmitRequest}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium disabled:opacity-50"
              >
                {isLoading ? '📤 Uploading...' : '✓ Submit Request'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setPreviewImage('');
                  setFormData({ customerName: '', customerPhone: '', amount: '', description: '', screenshot: null });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
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
