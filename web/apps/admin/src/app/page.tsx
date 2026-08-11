'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@lipa/core';
import LoginPage from './login/page';
import Dashboard from './dashboard/page';

export default function Home() {
  const { user, getCurrentUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      getCurrentUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [getCurrentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Dashboard />;
}
