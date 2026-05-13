'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ClipboardList, CheckSquare, Link2,
  ArrowUpRight, Users, AlertTriangle, BarChart2,
  Globe2, Building2, MapPin, Star, TrendingUp, Zap,
  AlertCircle, Shield, Radio, Settings, ScrollText,
  MessageSquare, ChevronLeft, ChevronRight, LogOut,
  FileText, Eye,
  PlusCircle, Search, User, Bell, Building, HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore } from '@/stores';
import { getNavForRole } from '@/data';
import { NavItem } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, ClipboardList, CheckSquare, Link2,
  ArrowUpRight, Users, AlertTriangle, BarChart2,
  Globe2, Building2, MapPin, Star, TrendingUp, Zap,
  AlertCircle, Shield, Radio, Settings, ScrollText,
  MessageSquare, FileText, Eye,
  PlusCircle, Search, User, Bell,
  Building, HelpCircle,
};

function NavIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <span className="w-4 h-4 flex items-center justify-center text-sm">•</span>;
  return <Icon size={15} className="flex-shrink-0" />;
}

function BadgeCount({ count, variant }: { count: number | string; variant?: string }) {
  const colors: Record<string, string> = {
    red: 'bg-red-500 text-white',
    amber: 'bg-amber-500 text-white',
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
  };
  return (
    <span className={cn(
      'ml-auto text-[9px] font-bold px-1.5 py-px rounded-full',
      colors[variant ?? 'blue'] ?? colors.blue
    )}>
      {count}
    </span>
  );
}

function NavItemRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const { setActiveNavId } = useUIStore();
  const isActive = pathname === item.path || pathname.startsWith(item.path + '/');

  return (
    <Link
      href={item.path}
      onClick={() => setActiveNavId(item.id)}
      title={collapsed ? item.label : undefined}
      className={cn(
        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] transition-all duration-150 mb-px',
        'text-white/50 hover:bg-white/7 hover:text-white/80',
        isActive && 'bg-blue-600/25 text-white border-l-2 border-blue-500',
        collapsed && 'justify-center px-2'
      )}
    >
      <NavIcon name={item.icon} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate font-medium">{item.label}</span>
          {item.badge !== undefined && (
            <BadgeCount count={item.badge} variant={item.badgeVariant} />
          )}
        </>
      )}
    </Link>
  );
}

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapsed, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const settingsPath = user?.role === 'citizen' ? '/citizen/profile' : '/portal/settings';

  if (!user) return null;

  const sections = getNavForRole(user.role);

  const roleColors: Record<string, string> = {
    nodal_officer: 'bg-blue-900/60 text-blue-300',
    clerk: 'bg-green-900/60 text-green-300',
    admin: 'bg-purple-900/60 text-purple-300',
    cm: 'bg-yellow-900/60 text-yellow-300',
    citizen: 'bg-teal-900/60 text-teal-300',
  };
  const roleLabel: Record<string, string> = {
    nodal_officer: 'Nodal Officer',
    clerk: 'Clerk / Task',
    admin: 'System Admin',
    cm: 'CM View',
    citizen: 'Citizen',
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      <aside className={cn(
        'flex flex-col h-full bg-[#0E1C2F] border-r border-white/[0.05] flex-shrink-0',
        'transition-all duration-200 ease-in-out overflow-hidden',
        sidebarCollapsed ? 'w-[56px]' : 'w-[220px]',
        // Mobile
        'fixed top-0 left-0 z-50 lg:relative lg:z-auto',
        sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}>

        {/* Logo */}
        <div className={cn(
          'border-b border-white/[0.06] flex-shrink-0',
          sidebarCollapsed ? 'px-3 py-4' : 'px-4 py-[18px]'
        )}>
          <div className={cn('flex items-center gap-2.5', sidebarCollapsed && 'justify-center')}>
            <div className="w-[30px] h-[30px] bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-sm">
              🏛
            </div>
            {!sidebarCollapsed && (
              <span className="text-white font-bold text-[14px] tracking-tight leading-tight">
                IGMS Officer
              </span>
            )}
          </div>
        </div>

        {/* User info */}
        <div className={cn(
          'border-b border-white/[0.06] flex-shrink-0',
          sidebarCollapsed ? 'px-2 py-3' : 'px-4 py-3'
        )}>
          <div className={cn('flex items-center gap-2.5', sidebarCollapsed && 'justify-center')}>
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.initials}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="text-white text-[12px] font-semibold truncate">{user.name}</div>
                <span className={cn('text-[10px] font-medium px-1.5 py-px rounded-full', roleColors[user.role] ?? 'bg-slate-800 text-slate-300')}>
                  {roleLabel[user.role] ?? user.role}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-0.5">
          {sections.map(section => (
            <div key={section.id} className="mb-1">
              {!sidebarCollapsed && (
                <div className="text-[9px] font-bold text-white/25 tracking-[1.2px] uppercase px-1.5 py-1.5 pt-3">
                  {section.label}
                </div>
              )}
              {section.items.map(item => (
                <NavItemRow key={item.id} item={item} collapsed={sidebarCollapsed} />
              ))}
            </div>
          ))}
        </nav>

        {/* SLA Health indicator (only for officer roles, expanded) */}
        {!sidebarCollapsed && (user.role === 'nodal_officer' || user.role === 'clerk') && (
          <div className="px-4 pb-1">
            <div className="bg-white/[0.05] rounded-lg p-2.5 mb-2">
              <div className="text-[10px] font-semibold text-white/35 uppercase tracking-wide mb-1.5">
                My SLA Health
              </div>
              <div className="bg-white/10 rounded-sm h-1 overflow-hidden mb-1.5">
                <div className="h-full rounded-sm bg-gradient-to-r from-green-500 to-amber-500" style={{ width: '78%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-white/35">
                <span>78% on time</span>
                <span>4 breach</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className={cn(
          'border-t border-white/[0.06] px-2.5 py-2 flex-shrink-0',
        )}>
          <Link
            href={settingsPath}
            onClick={() => setSidebarMobileOpen(false)}
            className={cn(
              'flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[12px]',
              'text-white/40 hover:bg-white/7 hover:text-white/60 transition-all duration-150 mb-0.5',
              sidebarCollapsed && 'justify-center px-2'
            )}
          >
            <Settings size={15} />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[12px]',
              'text-white/40 hover:bg-white/7 hover:text-white/60 transition-all duration-150',
              sidebarCollapsed && 'justify-center px-2'
            )}
          >
            <LogOut size={15} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebarCollapsed}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#0E1C2F] border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white/80 transition-all duration-150 hidden lg:flex"
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
}
