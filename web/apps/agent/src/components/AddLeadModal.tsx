'use client';

import { useState } from 'react';
import Modal from './Modal';
import Toast from './Toast';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  onLeadAdded?: () => void;
}

interface ToastMessage {
  type: 'success' | 'error';
  message: string;
}

export default function AddLeadModal({
  isOpen,
  onClose,
  agentId,
  onLeadAdded,
}: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    device_interest: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setToast({ type: 'error', message: 'Name is required' });
      return;
    }
    if (!formData.phone.trim()) {
      setToast({ type: 'error', message: 'Phone number is required' });
      return;
    }
    if (!formData.location.trim()) {
      setToast({ type: 'error', message: 'Location is required' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          ...formData,
          status: 'new',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create lead');
      }

      setToast({
        type: 'success',
        message: 'Lead created successfully!',
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        location: '',
        device_interest: '',
      });

      // Call callback if provided
      if (onLeadAdded) {
        onLeadAdded();
      }

      // Close modal after short delay
      setTimeout(() => {
        onClose();
        setToast(null);
      }, 1500);
    } catch (error: any) {
      setToast({
        type: 'error',
        message: error.message || 'Failed to create lead',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        phone: '',
        location: '',
        device_interest: '',
      });
      setToast(null);
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Add New Lead">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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

          {/* Location Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Nairobi, Westlands"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>

          {/* Device Interest Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Device Interest
            </label>
            <select
              name="device_interest"
              value={formData.device_interest}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            >
              <option value="">Select device type (optional)</option>
              <option value="smartphone">Smartphone</option>
              <option value="iphone">iPhone</option>
              <option value="android">Android Phone</option>
              <option value="budget">Budget Device</option>
              <option value="premium">Premium Device</option>
              <option value="unspecified">Not sure yet</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Creating Lead...' : 'Create Lead'}
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
