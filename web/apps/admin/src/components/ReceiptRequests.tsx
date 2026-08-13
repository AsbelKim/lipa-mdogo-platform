'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';
import { showToast } from './Toast';
import { addNotification } from './Notifications';
import { generateReceiptPDF } from '../utils/pdfReceiptGenerator';

interface ReceiptRequest {
  id: string;
  agentId: string;
  agentName: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  description: string;
  screenshot: string;
  status: 'pending' | 'approved' | 'ready';
  receiptId?: string;
  createdDate: string;
  approvedDate?: string;
}

export default function ReceiptRequests() {
  const [requests, setRequests] = useState<ReceiptRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ReceiptRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const stored = localStorage.getItem('receiptRequests');
    if (stored) {
      try {
        const allRequests = JSON.parse(stored);
        setRequests(allRequests);
      } catch (e) {
        console.error('Failed to load requests:', e);
      }
    }
    setIsLoaded(true);
  };

  const handleGenerateReceipt = async (request: ReceiptRequest) => {
    const receiptId = `RCP-${Date.now()}`;
    const approvalDate = new Date().toISOString();

    try {
      // Generate PDF
      generateReceiptPDF({
        receiptId,
        customerName: request.customerName,
        customerPhone: request.customerPhone,
        amount: request.amount,
        description: request.description,
        agentName: request.agentName,
        approvalDate,
      });

      // Update request status
      const updated = requests.map((r) =>
        r.id === request.id
          ? { ...r, status: 'ready' as const, receiptId, approvedDate }
          : r
      );
      setRequests(updated);
      localStorage.setItem('receiptRequests', JSON.stringify(updated));

      // Add notification to agent
      addNotification({
        type: 'receipt_sent',
        agentName: request.agentName,
        customerName: request.customerName,
        receiptId,
      });

      setSelectedRequest(null);
      setShowModal(false);
      showToast(`Receipt ${receiptId} generated as PDF and sent to agent!`, 'success');
    } catch (error) {
      console.error('Failed to generate receipt:', error);
      showToast('Failed to generate receipt PDF', 'error');
    }
  };

  const handleRejectRequest = (request: ReceiptRequest) => {
    const updated = requests.filter((r) => r.id !== request.id);
    setRequests(updated);
    localStorage.setItem('receiptRequests', JSON.stringify(updated));

    showToast('Receipt request rejected', 'warning');
    setSelectedRequest(null);
    setShowModal(false);
  };

  if (!isLoaded) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const readyCount = requests.filter((r) => r.status === 'ready').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🧾 Receipt Requests</h1>
        <p className="text-gray-600 mt-1">Review agent screenshot submissions and generate receipts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Processing</p>
          <p className="text-3xl font-bold text-blue-600">{approvedCount}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Ready</p>
          <p className="text-3xl font-bold text-green-600">{readyCount}</p>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500">No receipt requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Pending Requests */}
          {requests.filter((r) => r.status === 'pending').length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mt-6">⏳ Pending Review</h2>
              <div className="space-y-2">
                {requests
                  .filter((r) => r.status === 'pending')
                  .map((request) => (
                    <div key={request.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{request.customerName}</p>
                          <p className="text-sm text-gray-600">Agent: {request.agentName}</p>
                          <p className="text-sm text-gray-600">📱 {request.customerPhone}</p>
                          <p className="text-sm text-gray-600">💰 KES {request.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            📅 {new Date(request.createdDate).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition font-medium"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* Approved/Processing Requests */}
          {requests.filter((r) => r.status === 'approved').length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mt-6">👀 Processing</h2>
              <div className="space-y-2">
                {requests
                  .filter((r) => r.status === 'approved')
                  .map((request) => (
                    <div key={request.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{request.customerName}</p>
                          <p className="text-sm text-gray-600">Agent: {request.agentName}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          Processing
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* Ready Requests */}
          {requests.filter((r) => r.status === 'ready').length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mt-6">✅ Receipt Generated</h2>
              <div className="space-y-2">
                {requests
                  .filter((r) => r.status === 'ready')
                  .map((request) => (
                    <div key={request.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{request.customerName}</p>
                          <p className="text-sm text-gray-600">Receipt: {request.receiptId}</p>
                          <p className="text-sm text-gray-600">Agent: {request.agentName}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Ready
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
          }}
          title="Review Receipt Request"
        >
          <div className="space-y-4">
            {/* Request Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📋 Request Details</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Customer:</span> {selectedRequest.customerName}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {selectedRequest.customerPhone}
                </p>
                <p>
                  <span className="font-medium">Amount:</span> KES {selectedRequest.amount.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Description:</span> {selectedRequest.description}
                </p>
                <p>
                  <span className="font-medium">Agent:</span> {selectedRequest.agentName}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(selectedRequest.createdDate).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Screenshot Preview */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📸 Screenshot</h3>
              <img
                src={selectedRequest.screenshot}
                alt="Receipt screenshot"
                className="max-w-full h-auto border rounded-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => handleGenerateReceipt(selectedRequest)}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-bold"
              >
                ✓ Generate & Send Receipt
              </button>
              <button
                onClick={() => handleRejectRequest(selectedRequest)}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-bold"
              >
                ✕ Reject
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
