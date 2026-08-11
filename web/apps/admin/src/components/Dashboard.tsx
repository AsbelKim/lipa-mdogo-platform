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
        <h2 className="text-xl font-semibold text-watu-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-primary rounded-lg hover:bg-primary/5 transition font-medium text-primary flex flex-col items-center gap-2">
            <div className="w-6 h-6">
              <PlusIcon />
            </div>
            <span className="text-sm">Add Device</span>
          </button>
          <button className="p-4 border-2 border-primary rounded-lg hover:bg-primary/5 transition font-medium text-primary flex flex-col items-center gap-2">
            <div className="w-6 h-6">
              <AlertIcon />
            </div>
            <span className="text-sm">Add Customer</span>
          </button>
          <button className="p-4 border-2 border-secondary rounded-lg hover:bg-secondary/5 transition font-medium text-secondary flex flex-col items-center gap-2">
            <div className="w-6 h-6">
              <ShoppingIcon />
            </div>
            <span className="text-sm">Create Sale</span>
          </button>
          <button className="p-4 border-2 border-secondary rounded-lg hover:bg-secondary/5 transition font-medium text-secondary flex flex-col items-center gap-2">
            <div className="w-6 h-6">
              <CreditCardIcon />
            </div>
            <span className="text-sm">Log Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
