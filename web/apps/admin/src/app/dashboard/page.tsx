'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import DashboardContent from '../../components/Dashboard';
import PhoneInventory from '../../components/PhoneInventory';
import AgentAllocationManager from '../../components/AgentAllocationManager';
import AgentInventoryDetail from '../../components/AgentInventoryDetail';
import DevicesList from '../../components/DevicesList';
import CustomersList from '../../components/CustomersList';
import SalesList from '../../components/SalesList';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/');
    } else {
      setUser({ name: 'Admin', email: 'admin@watucredit.co.ke', role: 'admin' });

      // Load tab from localStorage, default to 'dashboard'
      const savedTab = localStorage.getItem('activeTab') || 'dashboard';
      setActiveTab(savedTab);
      setIsReady(true);
    }
  }, [router]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Save to localStorage so it persists on refresh
    localStorage.setItem('activeTab', tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  if (!user || !isReady) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'phones' && <PhoneInventory />}
            {activeTab === 'agents' && <AgentAllocationManager />}
            {activeTab === 'agent-inventory' && <AgentInventoryDetail />}
            {activeTab === 'devices' && <DevicesList />}
            {activeTab === 'customers' && <CustomersList />}
            {activeTab === 'sales' && <SalesList />}
          </div>
        </main>
      </div>
    </div>
  );
}
