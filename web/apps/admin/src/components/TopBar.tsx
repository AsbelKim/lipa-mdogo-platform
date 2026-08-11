import { User } from '@lipa/core';
import WatuLogo from './WatuLogo';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

export default function TopBar({ user, onLogout }: TopBarProps) {
  return (
    <header className="bg-gradient-to-r from-white to-gray-50 border-b-2 border-secondary shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <WatuLogo size="sm" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h2>
            <p className="text-sm text-gray-600">
              {user.role === 'admin' ? '👨‍💼 Administrator' : user.role === 'ops' ? '⚙️ Operations' : '👤'} Account
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-secondary hover:bg-orange-700 text-white rounded-lg transition font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
