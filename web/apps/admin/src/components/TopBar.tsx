'use client';

import { useState } from 'react';
import { User } from '@lipa/core';
import { DEALER_CONFIG, DEALER_BRANDING } from '../config/dealer';
import Notifications from './Notifications';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

export default function TopBar({ user, onLogout }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 border-b-2 border-primary/20 shadow-lg">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="text-white">
            <h2 className="text-2xl font-bold">{DEALER_CONFIG.name}</h2>
            <p className="text-sm text-white/90">{DEALER_BRANDING.headerSubtitle}</p>
            <p className="text-xs text-white/80 mt-1">{DEALER_BRANDING.contactInfo}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-white hover:bg-white/20 rounded-lg transition"
            title="Notifications"
          >
            <span className="text-2xl">🔔</span>
          </button>

          <div className="text-right">
            <p className="text-white text-sm">Welcome, <strong>{user.name}</strong></p>
            <p className="text-white/90 text-xs">
              {user.role === 'admin' ? 'Administrator' : user.role === 'ops' ? 'Operations' : 'User'} Account
            </p>
            <button
              onClick={onLogout}
              className="mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <Notifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </header>
  );
}
