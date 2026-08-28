'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Toast from './Toast';

interface LogPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  onPaymentLogged?: () => void;
}

interface ToastMessage {
  type: 'success' | 'error';
  message: string;
}

export default function LogPaymentModal({
  isOpen,
  onClose,
  agentId,
  onPaymentLogged,
}: LogPaymentModalProps) {
  const [formData, setFormData] = useState({
    sale_id: '',
    amount: '',
    payment_method: 'cash',
    reference: '',
  });

  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [salesLoading, setSalesLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [selectedSale, setSelectedSale] = useState<any>(null);

  // Fetch agent's sales
  useEffect(() => {
    if (isOpen) {
      fetchSales();
    }
  }, [isOpen]);

  const fetchSales = async () => {
    try {
      setSalesLoading(true);
      const response = await fetch(`/api/agents/${agentId}/sales`);
      if (response.ok) {
        const data = await response.json();
        // Filter active sales only
        const activeSales = (data.data || []).filter((s: any) => s.status === 'active');
        setSales(activeSales);
      }
    } catch (err) {
      console.error('Failed to fetch sales:', err);
      setToast({ type: 'error', message: 'Failed to load sales' });
    } finally {
      setSalesLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update selected sale when sale_id changes
    if (name === 'sale_id') {
      const sale = sales.find((s) => s.id === value);
      setSelectedSale(sale || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.sale_id) {
      setToast({ type: 'error', message: 'Please select a sale' });
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setToast({ type: 'error', message: 'Amount must be greater than 0' });
      return;
    }
    if (!formData.payment_method) {
      setToast({ type: 'error', message: 'Please select a payment method' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          sale_id: formData.sale_id,
          amount: parseFloat(formData.amount),
          currency: 'KES',
          payment_method: formData.payment_method,
          reference: formData.reference || `PMT-${Date.now()}`,
          status: 'verified',
          created_by: agentId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log payment');
      }

      setToast({
        type: 'success',
        message: `Payment logged! KES ${parseFloat(formData.amount).toLocaleString()} received`,
      });

      // Reset form
      setFormData({
        sale_id: '',
        amount: '',
        payment_method: 'cash',
        reference: '',
      });
      setSelectedSale(null);

      // Call callback
      if (onPaymentLogged) {
        onPaymentLogged();
      }

      // Close modal
      setTimeout(() => {
        onClose();
        setToast(null);
      }, 2000);
    } catch (error: any) {
      setToast({
        type: 'error',
        message: error.message || 'Failed to log payment',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        sale_id: '',
        amount: '',
        payment_method: 'cash',
        reference: '',
      });
      setSelectedSale(null);
      setToast(null);
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Log Payment">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sale Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Sale *
            </label>
            {salesLoading ? (
              <div className="px-4 py-2 border border-gray-300 rounded-lg text-gray-500 text-sm">
                Loading sales...
              </div>
            ) : (
              <select
                name="sale_id"
                value={formData.sale_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading || sales.length === 0}
              >
                <option value="">
                  {sales.length === 0 ? 'No active sales' : 'Select a sale'}
                </option>
                {sales.map((sale) => (
                  <option key={sale.id} value={sale.id}>
                    {sale.customer_name} - KES {(sale.amount || 0).toLocaleString()}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Sale Details Card */}
          {selectedSale && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedSale.customer_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-gray-900">
                    KES {(selectedSale.amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Installment:</span>
                  <span className="font-semibold text-blue-600">
                    KES {(selectedSale.monthly_payment || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount (KES) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder={selectedSale ? `e.g., ${selectedSale.monthly_payment}` : 'Enter amount'}
              min="0"
              step="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method *
            </label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            >
              <option value="cash">Cash</option>
              <option value="mpesa">M-Pesa</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Reference (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Reference
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="e.g., M-Pesa code or bank reference"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>

          {/* Summary */}
          {formData.amount && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">Amount to Record:</p>
              <p className="text-2xl font-bold text-green-600">
                KES {parseFloat(formData.amount).toLocaleString()}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Logging Payment...' : 'Log Payment'}
          </button>
        </form>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
