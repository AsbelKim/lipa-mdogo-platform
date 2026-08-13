'use client';

import { useState } from 'react';
import StatCard from './StatCard';
import { PlusIcon } from './Icons';
import AddDeviceModal from './AddDeviceModal';

export default function Dashboard() {
  const [stats, setStats] = useState({
    devices: 24,
    customers: 156,
    sales: 42,
    payments: 89,
  });

  const [modals, setModals] = useState({
    addDevice: false,
  });

  const openModal = (modalName: keyof typeof modals) => {
    setModals({ ...modals, [modalName]: true });
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals({ ...modals, [modalName]: false });
  };

  const handleAddDevice = () => {
    setStats({ ...stats, devices: stats.devices + 1 });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Devices"
          value={stats.devices}
          icon="📱"
          bgColor="bg-watu-light/20"
          textColor="text-primary"
        />
        <StatCard
          title="Total Customers"
          value={stats.customers}
          icon="👥"
          bgColor="bg-primary/10"
          textColor="text-primary"
        />
        <StatCard
          title="Active Sales"
          value={stats.sales}
          icon="💰"
          bgColor="bg-secondary/10"
          textColor="text-secondary"
        />
        <StatCard
          title="Total Payments"
          value={stats.payments}
          icon="💳"
          bgColor="bg-watu-light/20"
          textColor="text-primary"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-t-4 border-primary">
        <h2 className="text-xl font-semibold text-watu-dark mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => openModal('addDevice')}
            className="p-4 border-2 border-primary rounded-lg hover:bg-primary/5 transition font-medium text-primary flex flex-col items-center gap-2"
          >
            <div className="w-6 h-6">
              <PlusIcon />
            </div>
            <span className="text-sm">Add Device to Inventory</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          💡 Note: Customers, sales, and payments are managed by sales agents. Use the Agents section to manage agent allocations and inventory.
        </p>
      </div>

      {/* Modals */}
      <AddDeviceModal
        isOpen={modals.addDevice}
        onClose={() => closeModal('addDevice')}
        onAdd={handleAddDevice}
      />
    </div>
  );
}
