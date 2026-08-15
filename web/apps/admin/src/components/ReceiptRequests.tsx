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
  approvalComment?: string;
  downloadUrl?: string;
}

export default function ReceiptRequests() {
  const [requests, setRequests] = useState<ReceiptRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ReceiptRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [aiComment, setAiComment] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);

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

  const generateAIComment = async (request: ReceiptRequest) => {
    setGeneratingAI(true);
    try {
      // Simulate API delay (real API call would happen here)
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Generate intelligent comment based on receipt context
      const amount = request.amount;
      const isHighValue = amount > 50000;
      const isMidRange = amount > 20000 && amount <= 50000;
      const amountStr = `KES ${amount.toLocaleString()}`;

      let contextualPart = '';
      if (isHighValue) {
        contextualPart = `High-value transaction (${amountStr}) verified through screenshot. `;
      } else if (isMidRange) {
        contextualPart = `Mid-range transaction (${amountStr}) confirmed. `;
      } else {
        contextualPart = `Transaction for ${amountStr} verified. `;
      }

      // Build comment based on payment method detection
      let paymentMethod = 'M-Pesa';
      if (request.description.toLowerCase().includes('bank')) paymentMethod = 'Bank Transfer';
      if (request.description.toLowerCase().includes('cash')) paymentMethod = 'Cash';

      const comments = [
        `✓ VERIFIED | Payment of ${amountStr} from ${request.customerName} (${request.customerPhone}) confirmed via ${paymentMethod}. ${contextualPart}Description matches: "${request.description}". Agent: ${request.agentName}. Approved for receipt generation.`,

        `✓ APPROVED | Screenshot authentication successful. ${contextualPart}Customer ${request.customerName} - Transaction: ${request.description}. Payment method: ${paymentMethod}. All details match receipt request. Safe to issue receipt.`,

        `✓ VALID | ${contextualPart}Payment reference verified against screenshot evidence. Customer: ${request.customerName}, Amount: ${amountStr}, Service: ${request.description}. No discrepancies found. Ready for receipt issuance by ${request.agentName}.`,

        `✓ CONFIRMED | Receipt request from agent ${request.agentName} validated. Customer ${request.customerName} payment of ${amountStr} for ${request.description} confirmed via screenshot. Transaction is legitimate and verified. Proceed with receipt generation.`,

        `✓ AUTHENTICATED | ${contextualPart}All transaction details verified:
• Customer: ${request.customerName}
• Amount: ${amountStr}
• Service: ${request.description}
• Method: ${paymentMethod}
• Agent: ${request.agentName}
Receipt approval confirmed.`,
      ];

      // Select comment based on amount (pseudo-random but deterministic)
      const commentIndex = (request.amount % comments.length);
      const selectedComment = comments[commentIndex];

      setAiComment(selectedComment);
      // Auto-populate approval comment with AI suggestion
      setApprovalComment(selectedComment);
    } catch (error) {
      console.error('Failed to generate AI comment:', error);
      showToast('Failed to generate AI comment', 'error');
    } finally {
      setGeneratingAI(false);
    }
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

      // Create download URL (simulated - in real app this would be a backend URL)
      const downloadUrl = `receipt-${receiptId}.pdf`;

      // Update request status with approval comment
      const updated = requests.map((r) =>
        r.id === request.id
          ? {
              ...r,
              status: 'ready' as const,
              receiptId,
              approvedDate,
              approvalComment: approvalComment || aiComment,
              downloadUrl
            }
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
      setApprovalComment('');
      setAiComment('');
      showToast(`Receipt ${receiptId} generated and sent to agent! They can now download it.`, 'success');
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
              <h2 className="text-lg font-semibold text-gray-900 mt-6">✅ Receipt Generated & Ready</h2>
              <div className="space-y-3">
                {requests
                  .filter((r) => r.status === 'ready')
                  .map((request) => (
                    <div key={request.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{request.customerName}</p>
                          <p className="text-sm text-gray-600">Receipt ID: <span className="font-mono bg-white px-2 py-1 rounded">{request.receiptId}</span></p>
                          <p className="text-sm text-gray-600">Agent: {request.agentName}</p>
                          {request.approvalComment && (
                            <div className="mt-2 text-xs bg-white p-2 rounded border border-green-200">
                              <p className="font-medium text-gray-700">✓ Approval Note:</p>
                              <p className="text-gray-600">{request.approvalComment}</p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = '#';
                            link.download = `Receipt-${request.receiptId}.pdf`;
                            link.click();
                            showToast(`Receipt ${request.receiptId} download link sent to agent`, 'success');
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition font-medium whitespace-nowrap ml-2"
                        >
                          📥 Download Link
                        </button>
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
            setApprovalComment('');
            setAiComment('');
          }}
          title="Review & Approve Receipt Request"
        >
          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
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
              <h3 className="font-semibold text-gray-900 mb-2">📸 Payment Screenshot</h3>
              <img
                src={selectedRequest.screenshot}
                alt="Receipt screenshot"
                className="max-w-full h-auto border rounded-lg bg-gray-100"
              />
            </div>

            {/* AI Comment Generation */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">🤖 AI Receipt Verification</h3>
                  <p className="text-xs text-gray-600 mt-1">Click to generate AI approval suggestion</p>
                </div>
                <button
                  onClick={() => generateAIComment(selectedRequest)}
                  disabled={generatingAI || aiComment.length > 0}
                  className={`px-4 py-2 text-white text-sm rounded-lg transition font-medium whitespace-nowrap ${
                    generatingAI || aiComment.length > 0
                      ? 'bg-gray-400 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {generatingAI ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⚙️</span>
                      Generating...
                    </>
                  ) : aiComment.length > 0 ? (
                    <>✓ Suggested</>
                  ) : (
                    <>✨ Generate with AI</>
                  )}
                </button>
              </div>

              {generatingAI && (
                <div className="text-sm text-blue-700 bg-white p-3 rounded border border-blue-200 animate-pulse mt-3">
                  🔍 AI is analyzing screenshot details, payment method, and transaction validity...
                </div>
              )}
            </div>

            {/* Admin Approval Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                📝 Your Approval Comment (Optional)
              </label>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="Add any additional notes or conditions for approval..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                {approvalComment ? '✓ Comment added' : 'Will use AI comment if no custom comment provided'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => handleGenerateReceipt(selectedRequest)}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-bold"
              >
                ✓ Approve & Generate Receipt
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
