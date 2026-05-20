import React from 'react';
import { cn } from '@/lib/utils';
import { ComplaintStatus, ComplaintPriority, ComplaintChannel, SLAStatus } from '@/types';

const STATUS_CONFIG: Record<ComplaintStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-red-100 text-red-800' },
  pending: { label: 'Pending', className: 'bg-gray-100 text-gray-800' },
  in_progress: { label: 'In Progress', className: 'bg-amber-100 text-amber-800' },
  under_review: { label: 'Under Review', className: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800' },
  escalated: { label: 'Escalated', className: 'bg-purple-100 text-purple-800' },
  acknowledged: { label: 'Acknowledged', className: 'bg-yellow-100 text-yellow-900' },
  grouped: { label: 'Grouped', className: 'bg-orange-100 text-orange-800' },
  closed: { label: 'Closed', className: 'bg-slate-100 text-slate-800' },
  document_requested: { label: 'Action Required', className: 'bg-amber-100 text-amber-800 font-bold' },
};

const PRIORITY_CONFIG: Record<ComplaintPriority, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-red-100 text-red-900 font-bold' },
  high: { label: 'High', className: 'bg-amber-100 text-amber-900 font-bold' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-900' },
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600' },
};

const CHANNEL_CONFIG: Record<ComplaintChannel, { label: string; icon: string; className: string }> = {
  web: { label: 'Web', icon: '🌐', className: 'bg-blue-100 text-blue-800' },
  mobile: { label: 'Mobile', icon: '📱', className: 'bg-cyan-100 text-cyan-800' },
  whatsapp: { label: 'WhatsApp', icon: '💬', className: 'bg-green-100 text-green-800' },
  call: { label: 'Call Centre', icon: '📞', className: 'bg-orange-100 text-orange-800' },
  email: { label: 'Email', icon: '✉️', className: 'bg-purple-100 text-purple-800' },
  walk_in: { label: 'Walk-in', icon: '🚶', className: 'bg-yellow-100 text-yellow-900' },
};

const SLA_CONFIG: Record<SLAStatus, { label: string; className: string }> = {
  ok: { label: 'On Time', className: 'bg-green-100 text-green-800' },
  warn: { label: '', className: 'bg-amber-100 text-amber-800' },
  breach: { label: 'Breached', className: 'bg-red-100 text-red-800' },
};

interface StatusBadgeProps { status: ComplaintStatus; className?: string; }
interface PriorityBadgeProps { priority: ComplaintPriority; className?: string; }
interface ChannelBadgeProps { channel: ComplaintChannel; className?: string; }
interface SLABadgeProps { slaStatus: SLAStatus; slaDaysLeft: number; className?: string; }

const BASE = 'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full';

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return <span className={cn(BASE, cfg.className, className)}>{cfg.label}</span>;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const cfg = PRIORITY_CONFIG[priority];
  return <span className={cn(BASE, cfg.className, className)}>{cfg.label.toUpperCase()}</span>;
}

export function ChannelBadge({ channel, className }: ChannelBadgeProps) {
  const cfg = CHANNEL_CONFIG[channel];
  return (
    <span className={cn(BASE, cfg.className, className)}>
      <span>{cfg.icon}</span> {cfg.label}
    </span>
  );
}

export function SLABadge({ slaStatus, slaDaysLeft, className }: SLABadgeProps) {
  const cfg = SLA_CONFIG[slaStatus];
  let label = '';
  if (slaStatus === 'breach') label = `${Math.abs(slaDaysLeft)}d breach`;
  else if (slaStatus === 'warn') label = `${slaDaysLeft}d left`;
  else label = 'On time';
  return (
    <span className={cn(BASE, cfg.className, className)}>
      ⏱ {label}
    </span>
  );
}
