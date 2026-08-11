'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoginPage from '../components/LoginPage';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Redirect to dashboard if already logged in
      router.push('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <LoginPage />;
}
