'use client';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppShell } from '@/components/layout/AppShell';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['nodal_officer', 'clerk']}>
      <AppShell>
        {children}
      </AppShell>
    </AuthGuard>
  );
}
