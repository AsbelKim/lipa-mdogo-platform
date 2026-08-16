import { HomeIcon, ShoppingIcon, TrendingIcon, UsersIcon, WalletIcon } from './Icons';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  agentName?: string;
}

interface NavTab {
  id: string;
  label: string;
  icon: React.FC;
  description?: string;
}

export default function Sidebar({ activeTab, onTabChange, agentName }: SidebarProps) {
  const tabs: NavTab[] = [
    { id: 'home', label: 'Dashboard', icon: HomeIcon, description: 'Overview & Quick Actions' },
    { id: 'sales', label: 'My Sales', icon: ShoppingIcon, description: 'Manage active sales' },
    { id: 'leads', label: 'Leads', icon: TrendingIcon, description: 'Track pipeline' },
    { id: 'earnings', label: 'Earnings', icon: WalletIcon, description: 'Commission & targets' },
    { id: 'profile', label: 'Profile', icon: UsersIcon, description: 'Account settings' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-primary to-emerald-700 text-white shadow-2xl h-screen fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-emerald-600/30 bg-gradient-to-r from-primary to-emerald-600">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-white">lipa</h1>
          <p className="text-xs text-emerald-100 font-bold tracking-widest mt-1">AGENT PORTAL</p>
        </div>
        {agentName && (
          <p className="text-sm text-emerald-50 mt-3 font-semibold">👤 {agentName}</p>
        )}
        <div className="h-1 w-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mt-3"></div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-2 px-3">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 flex items-center gap-3 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg scale-105'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-600/30'
              }`}
            >
              {/* Background glow on hover (inactive) */}
              {!isActive && (
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition duration-200" />
              )}

              {/* Icon container */}
              <div className={`w-5 h-5 flex-shrink-0 transition duration-200 ${
                isActive ? 'text-gray-900' : 'text-emerald-200 group-hover:text-white'
              }`}>
                <IconComponent />
              </div>

              {/* Label */}
              <div className="flex-1 relative z-10">
                <div className={`font-semibold text-sm ${
                  isActive ? 'text-gray-900' : 'text-emerald-50 group-hover:text-white'
                }`}>
                  {tab.label}
                </div>
                {!isActive && (
                  <div className="text-xs text-emerald-200 group-hover:text-emerald-100">
                    {tab.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Stats */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-600/30 bg-gradient-to-t from-emerald-900 to-transparent">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-emerald-200">Active Sales:</span>
            <span className="font-bold text-yellow-400">—</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-200">Leads:</span>
            <span className="font-bold text-orange-400">—</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-200">This Month:</span>
            <span className="font-bold text-emerald-300">—</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
