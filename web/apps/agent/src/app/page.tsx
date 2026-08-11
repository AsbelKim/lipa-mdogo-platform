'use client';

import { useEffect, useState } from 'react';
import LoginPage from './login/page';
import Home from './home/page';

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setUser({ name: 'Sales Agent', email: 'agent1@watucredit.co.ke', role: 'agent' });
    }
    setIsLoading(false);
  }, []);

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

  if (!user) {
    return <LoginPage />;
  }

  return <Home user={user} setUser={setUser} />;
}
