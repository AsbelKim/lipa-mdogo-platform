'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Toast from './Toast';

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  onSaleCreated?: () => void;
}

interface ToastMessage {
  type: 'success' | 'error';
  message: string;
}

const COMMISSION_RATE = 0.12; // 12% commission

export default function CreateSaleModal({
  isOpen,
  onClose,
  agentId,
  onSaleCreated,
}: CreateSaleModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    device_id: '',
    amount: '',
    duration_months: '12',
  });

  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Fetch available devices
  useEffect(() => {
    if (isOpen) {
      fetchDevices();
    }
  }, [isOpen]);

  const fetchDevices = async () => {
    try {
      setDevicesLoading(true);
      const response = await fetch('/api/devices?status=available');
      if (response.ok) {
        const data = await response.json();
        setDevices(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch devices:', err);
      setToast({ type: 'error', message: 'Failed to load devices' });
    } finally {
      setDevicesLoading(false);
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
  };

  const calculateMonthlyPayment = (): number => {
    if (!formData.amount || !formData.duration_months) return 0;
    const amount = parseFloat(formData.amount);
    const months = parseInt(formData.duration_months);
    return parseFloat((amount / months).toFixed(2));
  };

  const calculateCommission = (): number => {
    if (!formData.amount) return 0;
    const amount = parseFloat(formData.amount);
    return parseFloat((amount * COMMISSION_RATE).toFixed(2));
  };

  const monthlyPayment = calculateMonthlyPayment();
  const commission = calculateCommission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customer_name.trim()) {
      setToast({ type: 'error', message: 'Customer name is required' });
      return;
    }
    if (!formData.phone.trim()) {
      setToast({ type: 'error', message: 'Phone number is required' });
      return;
    }
    if (!formData.device_id) {
      setToast({ type: 'error', message: 'Please select a device' });
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setToast({ type: 'error', message: 'Amount must be greater than 0' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          phone: formData.phone,
          device_id: formData.device_id,
          amount: parseFloat(formData.amount),
          duration_months: parseInt(formData.duration_months),
          monthly_payment: monthlyPayment,
          currency: 'KES',
          status: 'active',
          created_by: agentId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create sale');
      }

      setToast({
        type: 'success',
        message: `Sale created! Commission: KES ${commission.toLocaleString()}`,
      });

      // Reset form
      setFormData({
        customer_name: '',
        phone: '',
        device_id: '',
        amount: '',
        duration_months: '12',
      });

      // Call callback
      if (onSaleCreated) {
        onSaleCreated();
      }

      // Close modal
      setTimeout(() => {
        onClose();
        setToast(null);
      }, 2000);
    } catch (error: any) {
      setToast({
        type: 'error',
        message: error.message || 'Failed to create sale',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        customer_name: '',
        phone: '',
        device_id: '',
        amount: '',
        duration_months: '12',
      });
      setToast(null);
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Create New Sale">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Enter customer name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., +254712345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>

          {/* Device Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Device *
            </label>
            {devicesLoading ? (
              <div className="px-4 py-2 border border-gray-300 rounded-lg text-gray-500 text-sm">
                Loading devices...
              </div>
            ) : (
              <select
                name="device_id"
                value={formData.device_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading || devices.length === 0}
              >
                <option value="">
                  {devices.length === 0 ? 'No devices available' : 'Select a device'}
                </option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.model} ({device.imei})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Financing Amount (KES) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g., 50000"
              min="0"
              step="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>

          {/* Duration Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Months) *
            </label>
            <select
              name="duration_months"
              value={formData.duration_months}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            >
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="18">18 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
            </select>
          </div>

          {/* Summary Cards */}
          {formData.amount && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Payment:</span>
                <span className="font-semibold text-gray-900">
                  KES {monthlyPayment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Your Commission (12%):</span>
                <span className="font-semibold text-green-600">
                  KES {commission.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Sale:</span>
                <span className="text-lg font-bold text-primary">
                  KES {parseFloat(formData.amount).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Creating Sale...' : 'Create Sale'}
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
