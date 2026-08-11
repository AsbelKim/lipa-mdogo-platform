'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import DashboardContent from '../../components/Dashboard';
import PhoneInventory from '../../components/PhoneInventory';
import DevicesList from '../../components/DevicesList';
import CustomersList from '../../components/CustomersList';
import SalesList from '../../components/SalesList';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/');
    } else {
      setUser({ name: 'Admin', email: 'admin@watucredit.co.ke', role: 'admin' });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
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
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'phones' && <PhoneInventory />}
            {activeTab === 'devices' && <DevicesList />}
            {activeTab === 'customers' && <CustomersList />}
            {activeTab === 'sales' && <SalesList />}
          </div>
        </main>
      </div>
    </div>
  );
}
