'use client';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppShell } from '@/components/layout/AppShell';

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['citizen']}>
      <AppShell>
        {children}
      </AppShell>
    </AuthGuard>
  );
}
