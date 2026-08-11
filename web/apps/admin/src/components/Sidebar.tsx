interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'devices', label: 'Devices', icon: '📱' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'sales', label: 'Sales', icon: '💰' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white shadow-lg">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Lipa Mdogo</h1>
        <p className="text-sm text-gray-400">Admin Dashboard</p>
      </div>

      <nav className="mt-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-left px-6 py-3 transition ${
              activeTab === tab.id
                ? 'bg-emerald-600 border-l-4 border-emerald-400'
                : 'hover:bg-gray-800'
            }`}
          >
            <span className="text-xl mr-3">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
