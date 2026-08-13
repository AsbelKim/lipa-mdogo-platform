'use client';

interface AgentSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AgentSidebar({ activeTab, onTabChange }: AgentSidebarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'stock', label: 'My Stock', icon: '📱' },
    { id: 'customers', label: 'My Customers', icon: '👥' },
    { id: 'create-sale', label: 'Create Sale', icon: '🛒' },
    { id: 'receipts', label: 'My E-Receipts', icon: '📄' },
    { id: 'payments', label: 'Payments', icon: '💰' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-primary to-primary/90 shadow-lg overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">DAKIRO</h1>
        <p className="text-white/80 text-sm">Agent Portal</p>
      </div>

      <nav className="space-y-1 px-3 py-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition font-medium flex items-center gap-3 ${
              activeTab === tab.id
                ? 'bg-white text-primary shadow-md'
                : 'text-white hover:bg-white/20'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
