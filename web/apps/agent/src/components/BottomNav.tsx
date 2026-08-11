interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'sales', label: 'Sales', icon: '💰' },
    { id: 'leads', label: 'Leads', icon: '🎯' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-w-md mx-auto">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 px-2 text-center transition ${
              activeTab === tab.id
                ? 'text-primary border-t-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="text-2xl mb-1">{tab.icon}</div>
            <div className="text-xs font-medium">{tab.label}</div>
          </button>
        ))}
      </div>
    </nav>
  );
}
