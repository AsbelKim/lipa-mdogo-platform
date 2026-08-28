'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { initializeSampleData } from '../../../utils/sampleData';
import AgentSidebar from '../../../components/agent/AgentSidebar';
import AgentTopBar from '../../../components/agent/AgentTopBar';
import AgentDashboard from '../../../components/agent/AgentDashboard';
import MyCustomers from '../../../components/agent/MyCustomers';
import MyStock from '../../../components/agent/MyStock';
import MyCommissions from '../../../components/agent/MyCommissions';
import MyReceipts from '../../../components/agent/MyReceipts';
import RequestReceipt from '../../../components/agent/RequestReceipt';
import PaymentTracking from '../../../components/agent/PaymentTracking';
import { ToastContainer } from '../../../components/Toast';

export default function AgentDashboardPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize sample data if needed
    initializeSampleData();

    const token = localStorage.getItem('agent_token');
    if (!token) {
      router.push('/agent');
    } else {
      const agentName = localStorage.getItem('agent_name');
      const agentEmail = localStorage.getItem('agent_email');
      const agentId = localStorage.getItem('agent_id');

      setAgent({
        id: agentId,
        name: agentName,
        email: agentEmail,
        role: 'agent',
      });

      // Load tab from localStorage
      const savedTab = localStorage.getItem('agent_activeTab') || 'dashboard';
      setActiveTab(savedTab);
      setIsReady(true);
    }
  }, [router]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('agent_activeTab', tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('agent_token');
    localStorage.removeItem('agent_id');
    localStorage.removeItem('agent_name');
    localStorage.removeItem('agent_email');
    localStorage.removeItem('agent_phone');
    localStorage.removeItem('agent_location');
    router.push('/agent');
  };

  if (!agent || !isReady) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AgentSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AgentTopBar agent={agent} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {activeTab === 'dashboard' && <AgentDashboard />}
            {activeTab === 'customers' && <MyCustomers />}
            {activeTab === 'stock' && <MyStock />}
            {activeTab === 'request-receipt' && <RequestReceipt />}
            {activeTab === 'commissions' && <MyCommissions />}
            {activeTab === 'receipts' && <MyReceipts />}
            {activeTab === 'payments' && <PaymentTracking />}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
