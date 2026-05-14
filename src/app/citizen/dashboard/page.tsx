'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CitizenDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/citizen');
  }, [router]);

  return null;
}
