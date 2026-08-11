'use client';

import { useAuth } from '@lipa/core';
import BottomNav from '@/components/BottomNav';
import AgentHome from '@/components/AgentHome';
import { useState } from 'react';

export default function Home() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

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
        {activeTab === 'home' && <AgentHome />}
        {activeTab === 'sales' && <SalesTab />}
        {activeTab === 'leads' && <LeadsTab />}
        {activeTab === 'profile' && <ProfileTab user={user} />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function SalesTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">My Sales</h2>
      <div className="bg-white rounded-lg p-4 shadow text-center text-gray-600">
        No sales yet
      </div>
    </div>
  );
}

function LeadsTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Leads Pipeline</h2>
      <div className="bg-white rounded-lg p-4 shadow text-center text-gray-600">
        No leads yet
      </div>
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
