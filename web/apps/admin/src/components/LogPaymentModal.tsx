'use client';

import { useState } from 'react';
import Modal from './Modal';

interface LogPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payment: any) => void;
}

export default function LogPaymentModal({ isOpen, onClose, onAdd }: LogPaymentModalProps) {
  const [formData, setFormData] = useState({
    saleId: '',
    amount: 0,
    paymentMethod: 'mpesa',
    transactionRef: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sales = [
    { value: 'sale-1', label: 'John Doe - Samsung A56 5G' },
    { value: 'sale-2', label: 'Jane Smith - Samsung A06' },
    { value: 'sale-3', label: 'Alice Johnson - Samsung A05' },
  ];

  const paymentMethods = [
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
    { value: 'airtel', label: 'Airtel Money' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.saleId) newErrors.saleId = 'Sale is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (!formData.transactionRef.trim()) newErrors.transactionRef = 'Transaction reference is required';
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
      id: `payment-${Date.now()}`,
      dateLogged: new Date().toISOString(),
      status: 'recorded',
    });

    setFormData({
      saleId: '',
      amount: 0,
      paymentMethod: 'mpesa',
      transactionRef: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sale Reference *
          </label>
          <select
            name="saleId"
            value={formData.saleId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.saleId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select sale</option>
            {sales.map(sale => (
              <option key={sale.value} value={sale.value}>
                {sale.label}
              </option>
            ))}
          </select>
          {errors.saleId && <p className="text-red-500 text-xs mt-1">{errors.saleId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (KES) *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0.01"
            step="10"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="5000"
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method *
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {paymentMethods.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Reference *
          </label>
          <input
            type="text"
            name="transactionRef"
            value={formData.transactionRef}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.transactionRef ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., TXN123456 or M-Pesa Code"
          />
          {errors.transactionRef && <p className="text-red-500 text-xs mt-1">{errors.transactionRef}</p>}
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
            Log Payment
          </button>
        </div>
      </form>
    </Modal>
  );
}
