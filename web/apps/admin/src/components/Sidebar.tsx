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
    <aside className="w-64 bg-gradient-to-b from-primary to-primary/90 text-white shadow-lg">
      <div className="p-6 border-b border-primary/30">
        <div className="mb-3">
          <WatuLogo size="md" showText={true} />
        </div>
        <p className="text-xs text-green-100 font-semibold">ADMIN DASHBOARD</p>
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
                  ? 'bg-secondary text-white border-l-4 border-yellow-300 shadow-md'
                  : 'text-green-100 hover:bg-primary/80 border-l-4 border-transparent'
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
      <div className="absolute bottom-0 w-64 p-4 border-t border-primary/30">
        <p className="text-xs text-green-100">© 2026 Watu Credit</p>
      </div>
    </aside>
  );
}
