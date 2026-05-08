'use client';
import React, { useState } from 'react';
import { Bell, Search, Menu, User as UserIcon, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore } from '@/stores';
import { MOCK_NOTIFICATIONS } from '@/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

const ROLE_PILL: Record<string, { label: string; className: string }> = {
  nodal_officer: { label: 'Nodal Officer — GWSSB', className: 'bg-blue-100 text-blue-700' },
  clerk: { label: 'Clerk — Revenue Dept.', className: 'bg-green-100 text-green-700' },
  admin: { label: 'System Administrator', className: 'bg-purple-100 text-purple-700' },
  cm: { label: 'CM View', className: 'bg-yellow-100 text-yellow-800' },
  citizen: { label: 'Citizen Portal', className: 'bg-teal-100 text-teal-700' },
};

export function Topbar({ title, subtitle }: TopbarProps) {
  const { user, logout } = useAuthStore();
  const { setSidebarMobileOpen, searchQuery, setSearchQuery } = useUIStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
  const rolePill = ROLE_PILL[user?.role ?? ''];

  return (
    <header className="bg-white border-b border-[#DDE3EE] px-6 py-2.5 flex items-center gap-3 flex-shrink-0 z-30">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        onClick={() => setSidebarMobileOpen(true)}
      >
        <Menu size={18} className="text-gray-600" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        {title && (
          <h1 className="text-[16px] font-bold text-[#0E1C2F] tracking-tight truncate leading-tight">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-[11px] text-[#7A8FA6] mt-px truncate">{subtitle}</p>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-[#F0F2F7] border border-[#DDE3EE] rounded-lg px-3 py-[7px] w-64">
        <Search size={13} className="text-[#7A8FA6] flex-shrink-0" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by token, citizen, keyword..."
          className="bg-transparent border-none outline-none text-[12px] text-[#0E1C2F] placeholder:text-[#7A8FA6] w-full"
        />
      </div>

      {/* Notifications */}
      <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
        <DropdownMenuTrigger asChild>
          <button className="relative w-[34px] h-[34px] bg-[#F0F2F7] border border-[#DDE3EE] rounded-lg flex items-center justify-center text-[#3D5068] hover:bg-[#DDE3EE] transition-colors">
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full bg-red-500 border-[1.5px] border-white" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#0E1C2F]">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {MOCK_NOTIFICATIONS.map(n => (
              <div
                key={n.id}
                className={cn(
                  'flex gap-2.5 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors',
                  !n.isRead && 'bg-blue-50/60'
                )}
              >
                {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                {n.isRead && <div className="w-1.5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#0E1C2F] font-semibold leading-snug">{n.title}</p>
                  <p className="text-[11px] text-[#7A8FA6] mt-0.5 leading-snug truncate">{n.message}</p>
                  <p className="text-[10px] text-[#7A8FA6] mt-1">
                    {new Date(n.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-100">
            <button className="text-[11px] text-blue-600 font-semibold hover:underline">
              Mark all as read
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Role pill */}
      {rolePill && (
        <span className={cn('text-[11px] font-semibold px-3 py-1.5 rounded-full hidden sm:inline-block', rolePill.className)}>
          {user?.department ? `${ROLE_PILL[user.role ?? '']?.label}` : rolePill.label}
        </span>
      )}

      {/* User avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
              style={{ backgroundColor: user?.avatarColor ?? '#1A56C4' }}
            >
              {user?.initials ?? 'U'}
            </div>
            <ChevronDown size={12} className="text-gray-400 hidden sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>
            <div>
              <p className="text-[12px] font-semibold text-[#0E1C2F]">{user?.name}</p>
              <p className="text-[11px] text-[#7A8FA6] font-normal">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-[12px]" asChild>
            <Link href="/portal/settings">
              <UserIcon size={13} className="mr-2" /> My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-[12px] text-red-600 focus:text-red-600"
            onClick={logout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
