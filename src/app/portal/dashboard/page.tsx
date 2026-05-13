'use client';
import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';
import { KPICard } from '@/components/gms/KPICard';
import { StatusBadge, PriorityBadge, ChannelBadge, SLABadge } from '@/components/gms/StatusBadge';
import { OFFICER_KPI } from '@/data';
import { useOfficers } from '@/hooks/useOfficers';
import { useDepartments } from '@/hooks/useDepartments';
import type { Complaint, Officer } from '@/types';
import { ViewDetailDialog, ReassignDialog, GroupDialog, DialogType, DEPT_ICONS, computeSimilarity } from '@/components/gms/ComplaintModals';

/* ─── tiny helpers ─── */
function OfficerAvatar({ initials, color, name }: { initials: string; color: string; name: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: color }}>
        {initials}
      </div>
      <span className="text-[11px] text-[#3D5068]">{name.split(' ')[0]}</span>
    </div>
  );
}

/* ─── SIDEBAR CARDS ─── */
function TeamWorkloadCard({ officers }: { officers: Officer[] }) {
  return (
    <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
      <div className="px-4 py-3 border-b border-[#DDE3EE] flex items-center justify-between">
        <span className="text-[13px] font-bold text-[#0E1C2F]">Team Workload</span>
        <Link href="/portal/team" className="text-[11px] text-blue-600 font-medium hover:underline">Full view →</Link>
      </div>
      <div className="p-4 space-y-3">
        {officers.slice(0, 4).map(o => {
          const pct = o.workload === 'ok' ? 45 : o.workload === 'high' ? 78 : 98;
          const barColor = o.workload === 'ok' ? '#16A34A' : o.workload === 'high' ? '#D97706' : '#DC2626';
          return (
            <div key={o.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: o.color }}>
                    {o.initials}
                  </div>
                  <span className="text-[12px] font-medium text-[#0E1C2F]">{o.name}</span>
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: barColor, background: o.workload === 'ok' ? '#F0FDF4' : o.workload === 'high' ? '#FFFBEB' : '#FEF2F2' }}>
                  {o.workload === 'ok' ? 'Normal' : o.workload === 'high' ? 'High' : 'Overloaded'}
                </span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: barColor }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentActivityCard() {
  const activities = [
    { id: 1, text: 'GVM-2025-05234 resolved by Ravi Varma', time: '16:45', icon: '✅', color: '#16A34A' },
    { id: 2, text: 'GVM-2025-05289 escalated to L2 (SLA breach)', time: '08:12', icon: '🚨', color: '#DC2626' },
    { id: 3, text: 'GVM-2025-05398 assigned to Anita Sharma', time: 'Yesterday', icon: '📋', color: '#1A56C4' },
    { id: 4, text: '3 complaints grouped under GVM-2025-05350', time: 'Yesterday', icon: '🔗', color: '#EA580C' },
  ];
  return (
    <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
      <div className="px-4 py-3 border-b border-[#DDE3EE]">
        <span className="text-[13px] font-bold text-[#0E1C2F]">Recent Activity</span>
      </div>
      <div className="p-4 space-y-3">
        {activities.map(a => (
          <div key={a.id} className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm" style={{ background: a.color + '20' }}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[#0E1C2F] leading-snug">{a.text}</p>
              <p className="text-[10px] text-[#7A8FA6] mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function DashboardPage() {
  const { user } = useAuthStore();
  const isNodal = user?.role === 'nodal_officer';
  const queryClient = useQueryClient();

  // Fetch grievances from the unified API
  const { data: grievancesResponse } = useQuery({
    queryKey: ['grievances'],
    queryFn: async () => {
      const res = await fetch('/api/grievances');
      if (!res.ok) throw new Error('Failed to fetch grievances');
      return res.json() as Promise<{ data: Complaint[]; total: number }>;
    },
  });
  const complaints = grievancesResponse?.data ?? [];

  const { data: officers = [] } = useOfficers();
  const { data: departments = [] } = useDepartments();

  // Helper to PATCH a grievance action and refresh the list
  const patchGrievance = useCallback(async (id: string, action: string, rest: Record<string, any> = {}) => {
    const res = await fetch(`/api/grievances/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, actorId: user?.id || 'unknown', ...rest }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Action failed');
    }
    // Refresh grievances list
    queryClient.invalidateQueries({ queryKey: ['grievances'] });
    return res.json();
  }, [user?.id, queryClient]);

  const priorityQueue = complaints
    .filter(c => c.status !== 'resolved')
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a.priority] - order[b.priority];
    })
    .slice(0, 8);

  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  function openDialog(type: DialogType, complaint: Complaint) {
    setActiveComplaint(complaint);
    setDialogType(type);
  }

  function closeDialog() {
    setDialogType(null);
    setActiveComplaint(null);
  }

  function switchDialog(type: DialogType) {
    if (!activeComplaint) return;
    setDialogType(type);
  }

  async function handleAcknowledge(id: string) {
    await patchGrievance(id, 'acknowledge');
    toast.success(`Complaint acknowledged. Citizen notified via SMS.`);
    closeDialog();
  }

  async function handleReassign(id: string, officer: Officer) {
    await patchGrievance(id, 'reassign', { newOfficerId: officer.id });
  }

  async function handleEscalate(id: string) {
    await patchGrievance(id, 'escalate');
    toast.warning(`Complaint escalated. Supervisor notified.`);
    closeDialog();
  }

  async function handleResolve(id: string) {
    await patchGrievance(id, 'resolve');
    toast.success(`Complaint resolved and closed.`);
    closeDialog();
  }

  async function handleSendUpdate(id: string, msg: string) {
    await patchGrievance(id, 'send_update', { message: msg });
    toast.success(`Update sent to citizen. SMS & Email notification dispatched.`);
  }

  async function handleCreateGroup(primaryId: string, memberIds: string[], label: string) {
    const groupId = `g${Date.now()}`;
    // Group creation: update primary and each member via add_note with groupId info
    // Using add_note as a generic action since there is no dedicated group action
    await patchGrievance(primaryId, 'add_note', { note: `Grouped as primary: ${label} (${groupId})` });
    // Update primary complaint with groupId/isGroupPrimary via direct data patch is not supported
    // by action-based API, so we note the grouping. Member associations handled similarly.
    for (const mid of memberIds) {
      await patchGrievance(mid, 'add_note', { note: `Added to group: ${label} (${groupId})` });
    }
    toast.success(`Group created - ${label} with ${memberIds.length + 1} complaints.`);
    closeDialog();
  }

  return (
    <div>
      {/* Dialogs */}
      {dialogType === 'view' && activeComplaint && (
        <ViewDetailDialog
          complaint={activeComplaint}
          complaints={complaints}
          officers={officers}
          onClose={closeDialog}
          onAcknowledge={handleAcknowledge}
          onReassign={handleReassign}
          onEscalate={handleEscalate}
          onResolve={handleResolve}
          onSendUpdate={handleSendUpdate}
          onOpenReassign={() => switchDialog('reassign')}
          onOpenGroup={() => switchDialog('group')}
        />
      )}
      {dialogType === 'reassign' && activeComplaint && (
        <ReassignDialog
          complaint={activeComplaint}
          officers={officers}
          departments={departments}
          onClose={closeDialog}
          onConfirm={handleReassign}
        />
      )}
      {dialogType === 'group' && activeComplaint && (
        <GroupDialog
          complaint={activeComplaint}
          allComplaints={complaints}
          onClose={closeDialog}
          onCreateGroup={handleCreateGroup}
        />
      )}

      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F] leading-tight">
          Dashboard — {isNodal ? 'Nodal Officer View' : 'Clerk View'}
        </h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">
          Welcome back, {user?.name} · {user?.department}
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {OFFICER_KPI.map((kpi, i) => (
          <KPICard key={i} data={kpi} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Priority queue — 2/3 width */}
        <div className="xl:col-span-2">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h2 className="text-[15px] font-bold text-[#0E1C2F] flex-1">Priority Queue — Today</h2>
            <div className="flex items-center gap-1.5 bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 text-[11px] text-blue-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              Critical first
            </div>
            <Link href="/portal/complaints" className="flex items-center gap-1.5 bg-blue-600 text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[12px]">
                <thead className="bg-[#F8FAFD]">
                  <tr>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">Token</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Issue</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden md:table-cell">Channel</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden sm:table-cell">Priority</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">SLA</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden lg:table-cell">Assigned</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityQueue.map((c, i) => (
                    <tr
                      key={c.id}
                      className={cn(
                        'group hover:bg-[#FAFBFF] transition-colors cursor-pointer',
                        i !== priorityQueue.length - 1 && 'border-b border-[#DDE3EE]'
                      )}
                      onClick={() => openDialog('view', c)}
                    >
                      <td className="px-3 py-3">
                        <span className="font-bold text-[11px] text-blue-600 font-mono">{c.token}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-[#0E1C2F] truncate max-w-[160px]">{c.title}</div>
                        <div className="text-[10px] text-[#7A8FA6] mt-0.5">{c.ward}, {c.district} · {c.citizenName}</div>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <ChannelBadge channel={c.channel} />
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td className="px-3 py-3">
                        <SLABadge slaStatus={c.slaStatus} slaDaysLeft={c.slaDaysLeft} />
                      </td>
                      <td className="px-3 py-3 hidden lg:table-cell">
                        {c.assignedTo ? (
                          <OfficerAvatar initials={c.assignedTo.initials} color={c.assignedTo.color} name={c.assignedTo.name} />
                        ) : (
                          <span className="text-[11px] text-[#7A8FA6] italic">Unassigned</span>
                        )}
                      </td>
                      {/* ── ACTION BUTTONS ── */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => { e.stopPropagation(); openDialog('view', c); }}
                            title="View"
                            className="w-[26px] h-[26px] rounded-[6px] border border-[#DDE3EE] bg-white flex items-center justify-center text-[12px] hover:bg-[#F0F2F7] hover:border-[#C8D0DE] transition-all"
                          >
                            👁
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); openDialog('reassign', c); }}
                            title="Reassign"
                            className="w-[26px] h-[26px] rounded-[6px] border border-[#DDE3EE] bg-white flex items-center justify-center text-[12px] hover:bg-[#F0F2F7] hover:border-[#C8D0DE] transition-all"
                          >
                            ↗
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); openDialog('group', c); }}
                            title="Group"
                            className="w-[26px] h-[26px] rounded-[6px] border border-[#DDE3EE] bg-white flex items-center justify-center text-[12px] hover:bg-[#F0F2F7] hover:border-[#C8D0DE] transition-all"
                          >
                            🔗
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <TeamWorkloadCard officers={officers} />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}
