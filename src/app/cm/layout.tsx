'use client';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppShell } from '@/components/layout/AppShell';

export default function CMLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['cm', 'admin']}>
      <AppShell>
        {children}
      </AppShell>
    </AuthGuard>
  );
}
