'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';

interface Notification {
  id: string;
  type: 'sale_submitted' | 'sale_approved' | 'sale_rejected' | 'receipt_requested' | 'receipt_sent' | 'phone_allocated' | 'agent_added';
  agentName?: string;
  customerName?: string;
  phoneModel?: string;
  receiptId?: string;
  reason?: string;
  timestamp: string;
  read?: boolean;
}

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Notifications({ isOpen, onClose }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadNotifications = () => {
      const stored = localStorage.getItem('adminNotifications');
      if (stored) {
        try {
          setNotifications(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to load notifications:', e);
        }
      }
      setIsLoaded(true);
    };

    loadNotifications();

    // Listen for notification events
    const handleNotification = (event: CustomEvent) => {
      const newNotification = event.detail;
      setNotifications((prev) => [newNotification, ...prev]);
    };

    window.addEventListener('addNotification', handleNotification as EventListener);
    return () => window.removeEventListener('addNotification', handleNotification as EventListener);
  }, []);

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('adminNotifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('adminNotifications');
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      sale_submitted: '📤',
      sale_approved: '✅',
      sale_rejected: '❌',
      receipt_requested: '📋',
      receipt_sent: '📬',
      phone_allocated: '📱',
      agent_added: '👤',
    };
    return icons[type] || '📢';
  };

  const getNotificationMessage = (notification: Notification) => {
    switch (notification.type) {
      case 'sale_submitted':
        return `${notification.agentName} submitted a sale for ${notification.customerName}`;
      case 'sale_approved':
        return `Sale for ${notification.customerName} approved. Receipt ${notification.receiptId} generated.`;
      case 'sale_rejected':
        return `Sale for ${notification.customerName} rejected. Reason: ${notification.reason}`;
      case 'receipt_requested':
        return `${notification.agentName} requested receipt for ${notification.customerName}`;
      case 'receipt_sent':
        return `Receipt ${notification.receiptId} sent to ${notification.agentName}`;
      case 'phone_allocated':
        return `${notification.phoneModel} allocated to ${notification.agentName}`;
      case 'agent_added':
        return `New agent ${notification.agentName} has been added`;
      default:
        return 'System notification';
    }
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      sale_submitted: 'bg-yellow-50 border-yellow-200',
      sale_approved: 'bg-green-50 border-green-200',
      sale_rejected: 'bg-red-50 border-red-200',
      receipt_requested: 'bg-blue-50 border-blue-200',
      receipt_sent: 'bg-green-50 border-green-200',
      phone_allocated: 'bg-purple-50 border-purple-200',
      agent_added: 'bg-indigo-50 border-indigo-200',
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const recentNotifications = notifications.slice(0, 50); // Show last 50

  return (
    <>
      {/* Notification Bell Icon */}
      <button
        onClick={onClose}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        title="Notifications"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Notifications ${unreadCount > 0 ? `(${unreadCount} new)` : ''}`}
      >
        <div className="space-y-4">
          {recentNotifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`rounded-lg border p-4 cursor-pointer transition ${
                      notification.read
                        ? `${getNotificationColor(notification.type)} opacity-60`
                        : `${getNotificationColor(notification.type)} hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{getNotificationMessage(notification)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {recentNotifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 border-t border-gray-200 mt-2 pt-3"
                >
                  Clear all notifications
                </button>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

// Helper function to add notifications from anywhere
export function addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
  const event = new CustomEvent('addNotification', {
    detail: {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    },
  });
  window.dispatchEvent(event);

  // Also save to localStorage
  const stored = localStorage.getItem('adminNotifications');
  const notifications = stored ? JSON.parse(stored) : [];
  localStorage.setItem(
    'adminNotifications',
    JSON.stringify([
      {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...notifications,
    ])
  );
}
