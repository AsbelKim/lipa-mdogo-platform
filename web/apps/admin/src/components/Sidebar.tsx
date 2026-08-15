import {
  DashboardIcon,
  PhoneIcon,
  UsersIcon,
  ShoppingIcon,
  ShieldIcon,
  WalletIcon,
  TrendingIcon,
} from './Icons';

import { useEffect, useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: string;
}

interface NavTab {
  id: string;
  label: string;
  icon: React.FC;
  requiresSuperAdmin?: boolean;
}

export default function Sidebar({ activeTab, onTabChange, userRole }: SidebarProps) {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if (userRole === 'super-admin') {
      setIsSuperAdmin(true);
    } else {
      const adminData = localStorage.getItem('admin');
      if (adminData) {
        const admin = JSON.parse(adminData);
        setIsSuperAdmin(admin.role === 'super-admin');
      }
    }
  }, [userRole]);

  const tabs: NavTab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'phones', label: 'Available Stock', icon: PhoneIcon },
    { id: 'agents', label: 'Agent Allocation', icon: UsersIcon },
    { id: 'agent-inventory', label: 'Allocated Stock', icon: ShoppingIcon },
    { id: 'devices', label: 'Device Assignments', icon: ShieldIcon },
    { id: 'pending-sales', label: 'Sales Approval', icon: ShoppingIcon },
    { id: 'receipt-requests', label: 'Receipt Requests', icon: ShoppingIcon },
    { id: 'agent-receipts', label: 'My E-Receipts', icon: ShoppingIcon },
    { id: 'customers', label: 'Customers', icon: WalletIcon },
    { id: 'sold-phones', label: 'Sold Phones', icon: ShoppingIcon },
    { id: 'sales', label: 'Sales Analytics', icon: TrendingIcon },
    { id: 'reports', label: 'Reports & Exports', icon: TrendingIcon },
    { id: 'admin-management', label: 'Admin Management', icon: UsersIcon, requiresSuperAdmin: true },
  ];

  const filteredTabs = tabs.filter(tab => !tab.requiresSuperAdmin || isSuperAdmin);

  return (
    <aside className="w-64 bg-gradient-to-b from-watu-dark via-watu-dark to-watu-dark/90 text-white shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-primary/30 bg-gradient-to-r from-watu-dark to-watu-dark/80">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-white">watu</h1>
          <p className="text-xs text-primary font-bold tracking-widest mt-1">ADMIN PORTAL</p>
        </div>
        <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full mt-3"></div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-2 px-3">
        {filteredTabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 flex items-center gap-3 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* Background glow on hover (inactive) */}
              {!isActive && (
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-lg transition duration-200" />
              )}

              {/* Icon container */}
              <div className={`w-5 h-5 flex-shrink-0 transition duration-200 ${
                isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'
              }`}>
                <IconComponent />
              </div>

              {/* Label */}
              <span className={`font-semibold text-sm relative z-10 ${
                isActive ? 'text-white' : 'group-hover:text-gray-100'
              }`}>
                {tab.label}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-secondary rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick stats section */}
      <div className="mx-3 mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <p className="text-xs text-gray-400 font-semibold mb-2">QUICK STATS</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Devices</span>
            <span className="text-primary font-bold">45</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Agents</span>
            <span className="text-secondary font-bold">10</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Sales</span>
            <span className="text-primary font-bold">28</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-primary/20 bg-gradient-to-t from-watu-dark/50 to-transparent">
        <p className="text-xs text-gray-500">© 2026 Watu Credit</p>
        <p className="text-xs text-primary/60 mt-1">v1.0.0</p>
      </div>
    </aside>
  );
}
