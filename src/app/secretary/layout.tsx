'use client';
import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppShell } from '@/components/layout/AppShell';

export default function SecretaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['health_secretary', 'admin']}>
      <AppShell>
        {children}
      </AppShell>
    </AuthGuard>
  );
}
