'use client';

import { useQuery } from '@lipa/core';
import { deviceApi, customerApi, saleApi, paymentApi } from '@lipa/core';
import StatCard from './StatCard';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    devices: 0,
    customers: 0,
    sales: 0,
    payments: 0,
  });

  const devicesQuery = useQuery(() => deviceApi.list(1, 1).then(r => r.data));
  const customersQuery = useQuery(() => customerApi.list(1, 1).then(r => r.data));
  const salesQuery = useQuery(() => saleApi.list(1, 1).then(r => r.data));
  const paymentsQuery = useQuery(() => paymentApi.list(1, 1).then(r => r.data));

  useEffect(() => {
    if (devicesQuery.data) {
      setStats(s => ({ ...s, devices: devicesQuery.data?.pagination.total || 0 }));
    }
  }, [devicesQuery.data]);

  useEffect(() => {
    if (customersQuery.data) {
      setStats(s => ({ ...s, customers: customersQuery.data?.pagination.total || 0 }));
    }
  }, [customersQuery.data]);

  useEffect(() => {
    if (salesQuery.data) {
      setStats(s => ({ ...s, sales: salesQuery.data?.pagination.total || 0 }));
    }
  }, [salesQuery.data]);

  useEffect(() => {
    if (paymentsQuery.data) {
      setStats(s => ({ ...s, payments: paymentsQuery.data?.pagination.total || 0 }));
    }
  }, [paymentsQuery.data]);

  const isLoading =
    devicesQuery.loading ||
    customersQuery.loading ||
    salesQuery.loading ||
    paymentsQuery.loading;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Devices"
          value={isLoading ? '...' : stats.devices}
          icon="📱"
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          title="Total Customers"
          value={isLoading ? '...' : stats.customers}
          icon="👥"
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <StatCard
          title="Active Sales"
          value={isLoading ? '...' : stats.sales}
          icon="💰"
          bgColor="bg-amber-50"
          textColor="text-amber-600"
        />
        <StatCard
          title="Total Payments"
          value={isLoading ? '...' : stats.payments}
          icon="💳"
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            ➕ Add Device
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            ➕ Add Customer
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            ➕ Create Sale
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            ➕ Log Payment
          </button>
        </div>
      </div>
    </div>
  );
}
