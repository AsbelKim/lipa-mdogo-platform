'use client';

import { useAuth } from '@lipa/core';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import DevicesList from '@/components/DevicesList';
import CustomersList from '@/components/CustomersList';
import SalesList from '@/components/SalesList';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'devices' && <DevicesList />}
            {activeTab === 'customers' && <CustomersList />}
            {activeTab === 'sales' && <SalesList />}
          </div>
        </main>
      </div>
    </div>
  );
}
