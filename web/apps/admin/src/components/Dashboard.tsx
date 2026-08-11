'use client';

import StatCard from './StatCard';
import { PlusIcon, ShoppingIcon, CreditCardIcon, AlertIcon } from './Icons';

export default function Dashboard() {
  // Mock data for now
  const stats = {
    devices: 24,
    customers: 156,
    sales: 42,
    payments: 89,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Devices"
          value={stats.devices}
          icon="📱"
          bgColor="bg-blue-50"
          textColor="text-blue-700"
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
          bgColor="bg-purple-50"
          textColor="text-purple-700"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-primary rounded-lg hover:bg-primary/5 transition font-medium text-primary flex flex-col items-center gap-2">
            <PlusIcon />
            Add Device
          </button>
          <button className="p-4 border-2 border-primary rounded-lg hover:bg-primary/5 transition font-medium text-primary flex flex-col items-center gap-2">
            <AlertIcon />
            Add Customer
          </button>
          <button className="p-4 border-2 border-secondary rounded-lg hover:bg-secondary/5 transition font-medium text-secondary flex flex-col items-center gap-2">
            <ShoppingIcon />
            Create Sale
          </button>
          <button className="p-4 border-2 border-secondary rounded-lg hover:bg-secondary/5 transition font-medium text-secondary flex flex-col items-center gap-2">
            <CreditCardIcon />
            Log Payment
          </button>
        </div>
      </div>
    </div>
  );
}
