import { User } from '@lipa/core';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

export default function TopBar({ user, onLogout }: TopBarProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h2>
          <p className="text-sm text-gray-600">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
