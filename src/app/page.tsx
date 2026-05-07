'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { getDefaultPath } from '@/data';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getDefaultPath(user.role));
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-[#F0F2F7] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}
