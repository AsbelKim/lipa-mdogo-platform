'use client';

import { useState } from 'react';
import Modal from './Modal';

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sale: any) => void;
}

export default function CreateSaleModal({ isOpen, onClose, onAdd }: CreateSaleModalProps) {
  const [formData, setFormData] = useState({
    customerId: '',
    deviceModel: '',
    agent: '',
    downPaymentReceived: 0,
    installmentDuration: 12,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const customers = [
    { value: '1', label: 'John Doe' },
    { value: '2', label: 'Jane Smith' },
    { value: '3', label: 'Alice Johnson' },
  ];

  const devices = [
    { value: 'samsung-a05', label: 'Samsung Galaxy A05' },
    { value: 'samsung-a06', label: 'Samsung Galaxy A06' },
    { value: 'samsung-a56', label: 'Samsung Galaxy A56 5G' },
  ];

  const agents = [
    { value: 'agent-1', label: 'Michael Kipchoge' },
    { value: 'agent-2', label: 'Rose Tata' },
    { value: 'agent-3', label: 'James Mwangi' },
    { value: 'agent-4', label: 'Fatima Hassan' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['downPaymentReceived', 'installmentDuration'].includes(name) ? parseFloat(value) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.deviceModel) newErrors.deviceModel = 'Device model is required';
    if (!formData.agent) newErrors.agent = 'Agent is required';
    if (formData.downPaymentReceived < 0) newErrors.downPaymentReceived = 'Down payment cannot be negative';
    if (formData.installmentDuration < 1) newErrors.installmentDuration = 'Duration must be at least 1 month';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd({
      ...formData,
      id: `sale-${Date.now()}`,
      dateCreated: new Date().toISOString(),
      status: 'active',
    });

    setFormData({
      customerId: '',
      deviceModel: '',
      agent: '',
      downPaymentReceived: 0,
      installmentDuration: 12,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Sale">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer *
          </label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.customerId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select customer</option>
            {customers.map(customer => (
              <option key={customer.value} value={customer.value}>
                {customer.label}
              </option>
            ))}
          </select>
          {errors.customerId && <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Device Model *
          </label>
          <select
            name="deviceModel"
            value={formData.deviceModel}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.deviceModel ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select device</option>
            {devices.map(device => (
              <option key={device.value} value={device.value}>
                {device.label}
              </option>
            ))}
          </select>
          {errors.deviceModel && <p className="text-red-500 text-xs mt-1">{errors.deviceModel}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sales Agent *
          </label>
          <select
            name="agent"
            value={formData.agent}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.agent ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select agent</option>
            {agents.map(agent => (
              <option key={agent.value} value={agent.value}>
                {agent.label}
              </option>
            ))}
          </select>
          {errors.agent && <p className="text-red-500 text-xs mt-1">{errors.agent}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Down Payment Received (KES) *
          </label>
          <input
            type="number"
            name="downPaymentReceived"
            value={formData.downPaymentReceived}
            onChange={handleChange}
            min="0"
            step="100"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.downPaymentReceived ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.downPaymentReceived && <p className="text-red-500 text-xs mt-1">{errors.downPaymentReceived}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Installment Duration (months) *
          </label>
          <input
            type="number"
            name="installmentDuration"
            value={formData.installmentDuration}
            onChange={handleChange}
            min="1"
            max="60"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.installmentDuration ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.installmentDuration && <p className="text-red-500 text-xs mt-1">{errors.installmentDuration}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-orange-600 transition font-medium"
          >
            Create Sale
          </button>
        </div>
      </form>
    </Modal>
  );
}
