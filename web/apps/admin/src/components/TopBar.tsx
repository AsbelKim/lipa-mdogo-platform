import { User } from '@lipa/core';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

export default function TopBar({ user, onLogout }: TopBarProps) {
  return (
    <header className="bg-white border-b-2 border-primary shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="text-primary font-bold text-xl">watu</div>
          <div>
            <h2 className="text-2xl font-bold text-watu-dark">Welcome, {user.name}</h2>
            <p className="text-sm text-gray-500">
              {user.role === 'admin' ? 'Administrator' : user.role === 'ops' ? 'Operations' : 'User'} Account
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-secondary hover:bg-orange-600 text-white rounded-lg transition font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
