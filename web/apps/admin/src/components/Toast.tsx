'use client';

import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  message: ToastMessage;
  onClose: (id: string) => void;
}

function ToastItem({ message, onClose }: ToastProps) {
  useEffect(() => {
    const duration = message.duration || 3000;
    const timer = setTimeout(() => onClose(message.id), duration);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={`${styles[message.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-right-full duration-300`}
    >
      <span className="text-xl">{icons[message.type]}</span>
      <span className="flex-1">{message.message}</span>
      <button
        onClick={() => onClose(message.id)}
        className="text-white hover:opacity-80 transition"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Listen for custom toast events
    const handleToast = (event: CustomEvent) => {
      const newToast: ToastMessage = {
        id: Date.now().toString(),
        ...event.detail,
      };
      setToasts((prev) => [...prev, newToast]);
    };

    window.addEventListener('showToast', handleToast as EventListener);
    return () => window.removeEventListener('showToast', handleToast as EventListener);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} message={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

// Helper function to show toast from anywhere
export function showToast(message: string, type: ToastType = 'info', duration?: number) {
  const event = new CustomEvent('showToast', {
    detail: { message, type, duration },
  });
  window.dispatchEvent(event);
}
