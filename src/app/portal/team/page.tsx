'use client';
import React, { useMemo } from 'react';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOfficers } from '@/hooks/useOfficers';
import { useComplaints } from '@/hooks/useComplaints';

function SLAPill({ pct }: { pct: number }) {
  const status = pct >= 90 ? 'ok' : pct >= 75 ? 'warn' : 'breach';
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full',
      status === 'ok' ? 'bg-green-100 text-green-700' : status === 'warn' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
    )}>
      {pct}%
    </span>
  );
}

function StatusPill({ workload }: { workload: string }) {
  const isOverloaded = workload === 'full';
  return (
    <span className={cn(
      'inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full',
      isOverloaded ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
    )}>
      {isOverloaded ? 'Overloaded' : 'Active'}
    </span>
  );
}

export default function TeamPage() {
  const { data: officers = [], isLoading } = useOfficers();
  const { data: complaints = [] } = useComplaints();

  const officerStats = useMemo(() => {
    return officers.map(o => {
      const assigned = complaints.filter(c => c.assignedTo?.id === o.id);
      const inProgress = assigned.filter(c => ['in_progress', 'acknowledged'].includes(c.status)).length;
      const overdue = assigned.filter(c => c.slaStatus === 'breach').length;
      const resolved = assigned.filter(c => c.status === 'resolved').length;
      const total = assigned.length;
      // SLA % = resolved / (resolved + overdue) heuristic, or a mock
      const slaPct = total === 0 ? 100 : Math.round(((total - overdue) / total) * 100);
      return { ...o, total, inProgress, overdue, resolved, slaPct };
    });
  }, [officers, complaints]);

  if (isLoading) return <div className="flex items-center justify-center h-64 text-[13px] text-[#7A8FA6]">Loading team…</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">My Team — Workload Overview</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">{officers.length} officers in your department</p>
      </div>

      {/* Table matching HTML reference */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-[#F8FAFD]">
              <tr>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Officer</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Role</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Assigned</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden sm:table-cell">In Progress</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Overdue</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden md:table-cell">Resolved (7d)</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">SLA %</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Status</th>
              </tr>
            </thead>
            <tbody>
              {officerStats.map((o, i) => (
                <tr
                  key={o.id}
                  className={cn(
                    'hover:bg-[#FAFBFF] transition-colors cursor-pointer',
                    i !== officerStats.length - 1 && 'border-b border-[#DDE3EE]'
                  )}
                >
                  {/* Officer avatar + name */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ backgroundColor: o.color + '20', color: o.color }}
                      >
                        {o.initials}
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-[#0E1C2F]">{o.name}</div>
                        <div className="text-[10px] text-[#7A8FA6]">{o.department}</div>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-3 py-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{o.role}</span>
                  </td>
                  {/* Assigned */}
                  <td className="px-3 py-3">
                    <span className={cn('font-semibold', o.total >= 15 && 'text-red-600')}>{o.total}</span>
                  </td>
                  {/* In Progress */}
                  <td className="px-3 py-3 hidden sm:table-cell">{o.inProgress}</td>
                  {/* Overdue */}
                  <td className="px-3 py-3">
                    <span className={cn('font-semibold', o.overdue > 0 ? 'text-red-600' : 'text-[#7A8FA6]')}>{o.overdue}</span>
                  </td>
                  {/* Resolved */}
                  <td className="px-3 py-3 hidden md:table-cell">{o.resolved}</td>
                  {/* SLA % */}
                  <td className="px-3 py-3"><SLAPill pct={o.slaPct} /></td>
                  {/* Status */}
                  <td className="px-3 py-3"><StatusPill workload={o.workload} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
