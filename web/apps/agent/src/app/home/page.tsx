'use client';

import BottomNav from '../../components/BottomNav';
import AgentHome from '../../components/AgentHome';
import CommissionDashboard from '../../components/CommissionDashboard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@core/types';

interface HomeProps {
  user?: User;
  setUser?: (user: any) => void;
}

export default function Home({ user: initialUser, setUser }: HomeProps) {
  const router = useRouter();
  const [user, setLocalUser] = useState<User | null>(initialUser || null);
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
    if (!initialUser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setLocalUser(JSON.parse(storedUser));
        } catch {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    }
    setIsLoading(false);
  }, [initialUser, router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setLocalUser(null);
    if (setUser) setUser(null);
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Lipa Mdogo</h1>
            <p className="text-sm text-emerald-100">{user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-emerald-700 hover:bg-emerald-800 px-3 py-1 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {activeTab === 'home' && <AgentHome agentId={user.id} />}
        {activeTab === 'sales' && <SalesTab agentId={user.id} />}
        {activeTab === 'leads' && <LeadsTab agentId={user.id} />}
        {activeTab === 'earnings' && <EarningsTab agentId={user.id} />}
        {activeTab === 'profile' && <ProfileTab user={user} />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function SalesTab({ agentId }: { agentId: string }) {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}/sales`);
        if (response.ok) {
          const data = await response.json();
          setSales(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch sales:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [agentId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">My Sales</h2>
        <div className="bg-white rounded-lg p-4 shadow text-center text-gray-600">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">My Sales</h2>
      {sales.length > 0 ? (
        <div className="space-y-2">
          {sales.map((sale) => (
            <div key={sale.id} className="bg-white rounded-lg p-3 shadow">
              <p className="font-semibold text-gray-900">{sale.device_id}</p>
              <p className="text-sm text-gray-600">Amount: KES {sale.amount}</p>
              <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {sale.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4 shadow text-center text-gray-600">
          No sales yet
        </div>
      )}
    </div>
  );
}

function LeadsTab({ agentId }: { agentId: string }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}/leads`);
        if (response.ok) {
          const data = await response.json();
          setLeads(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch leads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [agentId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Leads Pipeline</h2>
        <div className="bg-white rounded-lg p-4 shadow text-center text-gray-600">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Leads Pipeline</h2>
      {leads.length > 0 ? (
        <div className="space-y-2">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-lg p-3 shadow">
              <p className="font-semibold text-gray-900">{lead.name}</p>
              <p className="text-sm text-gray-600">{lead.phone}</p>
              <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                {lead.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4 shadow text-center text-gray-600">
          No leads yet
        </div>
      )}
    </div>
  );
}

function EarningsTab({ agentId }: { agentId: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Earnings & Performance</h2>
      <CommissionDashboard agentId={agentId} />
    </div>
  );
}

function ProfileTab({ user }: { user: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
      <div className="bg-white rounded-lg p-4 shadow space-y-3">
        <div>
          <p className="text-sm text-gray-600">Name</p>
          <p className="font-semibold">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-semibold">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Role</p>
          <p className="font-semibold capitalize">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
