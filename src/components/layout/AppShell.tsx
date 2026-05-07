'use client';
import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  return (
    <div className="gms-shell">
      <Sidebar />
      <div className="gms-main">
        <Topbar title={title} subtitle={subtitle} />
        <main className="gms-content">
          {children}
        </main>
      </div>
    </div>
  );
}
