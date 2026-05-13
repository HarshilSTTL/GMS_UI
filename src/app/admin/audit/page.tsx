'use client';
import React, { useState } from 'react';
import { ScrollText, Search, Filter, Download } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  details: string;
  ip: string;
  severity: 'info' | 'warning' | 'critical';
}

const MOCK_AUDIT: AuditEntry[] = [
  { id: 'a1', timestamp: '2026-05-08 14:32:10', user: 'Ravi Varma', role: 'Admin', action: 'USER_CREATE', target: 'user:anita_sharma', details: 'Created new user account for Anita Sharma', ip: '103.45.67.89', severity: 'info' },
  { id: 'a2', timestamp: '2026-05-08 14:28:05', user: 'System', role: 'System', action: 'SLA_BREACH', target: 'complaint:GVM-2025-05234', details: 'SLA breached for complaint GVM-2025-05234 (7 days)', ip: '-', severity: 'warning' },
  { id: 'a3', timestamp: '2026-05-08 13:45:22', user: 'Priya Patel', role: 'Nodal Officer', action: 'COMPLAINT_RESOLVE', target: 'complaint:GVM-2025-05189', details: 'Resolved complaint — water supply restored', ip: '103.45.67.45', severity: 'info' },
  { id: 'a4', timestamp: '2026-05-08 12:15:00', user: 'Admin', role: 'Admin', action: 'ROLE_UPDATE', target: 'role:clerk', details: 'Updated permissions for Clerk role — added "View Reports"', ip: '103.45.67.89', severity: 'warning' },
  { id: 'a5', timestamp: '2026-05-08 11:30:45', user: 'Amit Shah', role: 'Nodal Officer', action: 'COMPLAINT_REASSIGN', target: 'complaint:GVM-2025-05267', details: 'Reassigned from Ravi to Suresh — workload balance', ip: '103.45.67.33', severity: 'info' },
  { id: 'a6', timestamp: '2026-05-08 10:05:12', user: 'System', role: 'System', action: 'ESCALATION', target: 'complaint:GVM-2025-05289', details: 'Auto-escalated to Level 2 — SLA critical', ip: '-', severity: 'critical' },
  { id: 'a7', timestamp: '2026-05-08 09:22:00', user: 'Meena Devi', role: 'Clerk', action: 'COMPLAINT_CREATE', target: 'complaint:GVM-2025-05310', details: 'New complaint registered — water quality issue', ip: '103.45.67.12', severity: 'info' },
  { id: 'a8', timestamp: '2026-05-08 08:10:00', user: 'Admin', role: 'Admin', action: 'SYSTEM_CONFIG', target: 'config:sla_rules', details: 'Updated SLA rules for Water Supply category', ip: '103.45.67.89', severity: 'warning' },
  { id: 'a9', timestamp: '2026-05-07 18:45:00', user: 'Ravi Varma', role: 'Admin', action: 'USER_SUSPEND', target: 'user:old_account', details: 'Suspended inactive user account (90 days idle)', ip: '103.45.67.89', severity: 'warning' },
  { id: 'a10', timestamp: '2026-05-07 17:30:00', user: 'System', role: 'System', action: 'LOGIN_FAILED', target: 'user:unknown', details: 'Multiple failed login attempts from IP 192.168.1.100', ip: '192.168.1.100', severity: 'critical' },
];

const SEVERITY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  info: { bg: '#F0FDF4', text: '#065F46', dot: '#16A34A' },
  warning: { bg: '#FFFBEB', text: '#92400E', dot: '#D97706' },
  critical: { bg: '#FEF2F2', text: '#991B1B', dot: '#DC2626' },
};

const ACTION_LABELS: Record<string, string> = {
  USER_CREATE: 'User Created',
  USER_SUSPEND: 'User Suspended',
  ROLE_UPDATE: 'Role Updated',
  COMPLAINT_CREATE: 'Complaint Created',
  COMPLAINT_RESOLVE: 'Complaint Resolved',
  COMPLAINT_REASSIGN: 'Complaint Reassigned',
  SLA_BREACH: 'SLA Breach',
  ESCALATION: 'Escalation',
  SYSTEM_CONFIG: 'Config Changed',
  LOGIN_FAILED: 'Login Failed',
};

export default function AdminAuditPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filtered = MOCK_AUDIT.filter(e => {
    const matchSearch = e.user.toLowerCase().includes(search.toLowerCase()) || e.details.toLowerCase().includes(search.toLowerCase()) || e.target.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === 'all' || e.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <ScrollText size={20} className="text-slate-600" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0E1C2F]">Audit Logs</h1>
            <p className="text-[12px] text-[#7A8FA6]">{MOCK_AUDIT.length} entries · Track all system actions</p>
          </div>
        </div>
        <button onClick={() => toast.info('Export started')} className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
          <Download size={13} /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user, action, target..."
            className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] bg-white focus:outline-none focus:border-blue-400" />
        </div>
        <div className="flex gap-2">
          {['all', 'info', 'warning', 'critical'].map(s => (
            <button key={s} onClick={() => setSeverityFilter(s)}
              className={cn('px-3 py-1.5 rounded-lg text-[11px] font-semibold border capitalize transition-all',
                severityFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-[#DDE3EE] text-[#3D5068]')}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['Timestamp', 'User', 'Action', 'Target', 'Details', 'Severity', 'IP'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => {
                const ss = SEVERITY_STYLES[entry.severity];
                return (
                  <tr key={entry.id} className={cn(i !== filtered.length - 1 && 'border-b border-[#DDE3EE]', entry.severity === 'critical' && 'bg-red-50/30')}>
                    <td className="px-4 py-3 text-[#7A8FA6] font-mono whitespace-nowrap">{entry.timestamp}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-[#0E1C2F]">{entry.user}</p>
                        <p className="text-[9px] text-[#7A8FA6]">{entry.role}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0F2F7] text-[#3D5068]">
                        {ACTION_LABELS[entry.action] ?? entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#3D5068] font-mono text-[11px] max-w-[140px] truncate">{entry.target}</td>
                    <td className="px-4 py-3 text-[#3D5068] max-w-[200px] truncate">{entry.details}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ss.dot }} />
                        <span className="text-[10px] font-semibold capitalize" style={{ color: ss.text }}>{entry.severity}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#7A8FA6] font-mono text-[11px]">{entry.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
