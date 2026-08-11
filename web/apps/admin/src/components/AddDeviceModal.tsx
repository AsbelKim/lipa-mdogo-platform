'use client';

import { useState } from 'react';
import Modal from './Modal';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (device: any) => void;
}

export default function AddDeviceModal({ isOpen, onClose, onAdd }: AddDeviceModalProps) {
  const [formData, setFormData] = useState({
    model: '',
    quantity: 1,
    downPayment: 0,
    dailyInstallment: 0,
    estimatedPrice: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const phoneModels = [
    { value: 'samsung-a05', label: 'Samsung Galaxy A05' },
    { value: 'samsung-a06', label: 'Samsung Galaxy A06' },
    { value: 'samsung-a07', label: 'Samsung Galaxy A07' },
    { value: 'samsung-a16', label: 'Samsung Galaxy A16 5G' },
    { value: 'samsung-a26', label: 'Samsung Galaxy A26 5G' },
    { value: 'samsung-a36', label: 'Samsung Galaxy A36 5G' },
    { value: 'samsung-a56', label: 'Samsung Galaxy A56 5G' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) :
              ['downPayment', 'dailyInstallment', 'estimatedPrice'].includes(name) ? parseFloat(value) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.model) newErrors.model = 'Model is required';
    if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (formData.downPayment < 0) newErrors.downPayment = 'Down payment cannot be negative';
    if (formData.dailyInstallment < 0) newErrors.dailyInstallment = 'Daily installment cannot be negative';
    if (formData.estimatedPrice < 0) newErrors.estimatedPrice = 'Estimated price cannot be negative';
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
      id: `device-${Date.now()}`,
      dateAdded: new Date().toISOString(),
    });

    setFormData({
      model: '',
      quantity: 1,
      downPayment: 0,
      dailyInstallment: 0,
      estimatedPrice: 0,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Device to Inventory">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Model *
          </label>
          <select
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.model ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a model</option>
            {phoneModels.map(model => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
          {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.quantity ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Down Payment (KES) *
          </label>
          <input
            type="number"
            name="downPayment"
            value={formData.downPayment}
            onChange={handleChange}
            min="0"
            step="100"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.downPayment ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.downPayment && <p className="text-red-500 text-xs mt-1">{errors.downPayment}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Daily Installment (KES) *
          </label>
          <input
            type="number"
            name="dailyInstallment"
            value={formData.dailyInstallment}
            onChange={handleChange}
            min="0"
            step="10"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.dailyInstallment ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dailyInstallment && <p className="text-red-500 text-xs mt-1">{errors.dailyInstallment}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Total Price (KES) *
          </label>
          <input
            type="number"
            name="estimatedPrice"
            value={formData.estimatedPrice}
            onChange={handleChange}
            min="0"
            step="100"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.estimatedPrice ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.estimatedPrice && <p className="text-red-500 text-xs mt-1">{errors.estimatedPrice}</p>}
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
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
          >
            Add Device
          </button>
        </div>
      </form>
    </Modal>
  );
}
