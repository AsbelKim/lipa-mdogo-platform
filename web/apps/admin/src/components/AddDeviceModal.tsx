'use client';

import { useState } from 'react';
import Modal from './Modal';
import { validationRules } from '../utils/validationHelpers';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (device: {
    category: 'phone';
    brand: string;
    model: string;
    imei: string;
    serial_number: string;
    unit_cost: number;
  }) => void;
}

export default function AddDeviceModal({ isOpen, onClose, onAdd }: AddDeviceModalProps) {
  const [formData, setFormData] = useState({
    brand: 'Samsung',
    model: '',
    imei: '',
    serial_number: '',
    unit_cost: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const phoneModels = [
    { value: 'Samsung Galaxy A05', label: 'Samsung Galaxy A05' },
    { value: 'Samsung Galaxy A06', label: 'Samsung Galaxy A06' },
    { value: 'Samsung Galaxy A07', label: 'Samsung Galaxy A07' },
    { value: 'Samsung Galaxy A16 5G', label: 'Samsung Galaxy A16 5G' },
    { value: 'Samsung Galaxy A26 5G', label: 'Samsung Galaxy A26 5G' },
    { value: 'Samsung Galaxy A36 5G', label: 'Samsung Galaxy A36 5G' },
    { value: 'Samsung Galaxy A56 5G', label: 'Samsung Galaxy A56 5G' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value as any,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate model
    if (!formData.model) {
      newErrors.model = 'Phone model is required';
    }

    // Validate IMEI
    const imeiError = validationRules.imei(formData.imei);
    if (imeiError) {
      newErrors.imei = imeiError;
    }

    // Validate serial number
    const serialError = validationRules.serialNumber(formData.serial_number);
    if (serialError) {
      newErrors.serial_number = serialError;
    }

    if (!formData.unit_cost || Number(formData.unit_cost) < 0) {
      newErrors.unit_cost = 'Unit cost must be zero or greater';
    }

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
      category: 'phone',
      brand: formData.brand,
      model: formData.model,
      imei: formData.imei,
      serial_number: formData.serial_number,
      unit_cost: Number(formData.unit_cost),
    });

    setFormData({
      brand: 'Samsung',
      model: '',
      imei: '',
      serial_number: '',
      unit_cost: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Individual Phone to Inventory">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

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
            IMEI Number * (15 digits)
          </label>
          <input
            type="text"
            name="imei"
            value={formData.imei}
            onChange={handleChange}
            placeholder="359072080276522"
            maxLength={15}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono ${
              errors.imei ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.imei && <p className="text-red-500 text-xs mt-1">{errors.imei}</p>}
          <p className="text-gray-500 text-xs mt-1">International Mobile Equipment Identity</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number *
          </label>
          <input
            type="text"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            placeholder="e.g., RF9DL1A20GU"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.serial_number ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.serial_number && <p className="text-red-500 text-xs mt-1">{errors.serial_number}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost (KES) *</label>
          <input
            type="number"
            name="unit_cost"
            value={formData.unit_cost}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.unit_cost ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.unit_cost && <p className="text-red-500 text-xs mt-1">{errors.unit_cost}</p>}
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
            Add Phone
          </button>
        </div>
      </form>
    </Modal>
  );
}
