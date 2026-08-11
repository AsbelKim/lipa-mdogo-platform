import WatuLogo from './WatuLogo';
import {
  DashboardIcon,
  PhoneIcon,
  UsersIcon,
  ShoppingIcon,
  ShieldIcon,
  WalletIcon,
  TrendingIcon,
} from './Icons';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavTab {
  id: string;
  label: string;
  icon: React.FC;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs: NavTab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'phones', label: 'Phone Inventory', icon: PhoneIcon },
    { id: 'agents', label: 'Agent Allocation', icon: UsersIcon },
    { id: 'agent-inventory', label: 'Agent Stock View', icon: ShoppingIcon },
    { id: 'devices', label: 'Device Assignments', icon: ShieldIcon },
    { id: 'customers', label: 'Customers', icon: WalletIcon },
    { id: 'sales', label: 'Sales', icon: TrendingIcon },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-watu-dark to-watu-dark/95 text-white shadow-lg">
      <div className="p-6 border-b border-primary/20">
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-white">watu</h1>
          <p className="text-xs text-primary text-opacity-80 font-semibold">ADMIN PORTAL</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left px-6 py-3 transition font-medium flex items-center gap-3 ${
                activeTab === tab.id
                  ? 'bg-primary text-white border-l-4 border-secondary shadow-md'
                  : 'text-gray-300 hover:bg-watu-dark/80 border-l-4 border-transparent'
              }`}
            >
              <div className="w-5 h-5 flex-shrink-0">
                <IconComponent />
              </div>
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-primary/20">
        <p className="text-xs text-gray-400">© 2026 Watu</p>
      </div>
    </aside>
  );
}
