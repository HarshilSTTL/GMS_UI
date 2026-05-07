'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';
import { KPICard } from '@/components/gms/KPICard';
import { StatusBadge, PriorityBadge, ChannelBadge, SLABadge } from '@/components/gms/StatusBadge';
import { OFFICER_KPI } from '@/data';
import { useComplaints, useUpdateComplaint } from '@/hooks/useComplaints';
import { useOfficers } from '@/hooks/useOfficers';
import type { Complaint, Officer } from '@/types';

/* ─── tiny helper ─── */
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

/* ─── DIALOGS ─── */
type DialogType = 'acknowledge' | 'reassign' | 'escalate' | null;

function AcknowledgeDialog({ complaint, onClose, onConfirm }: { complaint: Complaint; onClose: () => void; onConfirm: (id: string) => void }) {
  const [note, setNote] = useState('');
  function handleSubmit() {
    onConfirm(complaint.id);
    toast.success(`✋ ${complaint.token} acknowledged. Citizen notified via SMS.`);
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-[16px] w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DDE3EE]">
          <div className="flex items-center gap-2">
            <span className="text-lg">✋</span>
            <h2 className="text-[15px] font-bold text-[#0E1C2F]">Acknowledge Complaint</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#7A8FA6]"><X size={14} /></button>
        </div>
        <div className="p-5">
          <div className="bg-[#F8FAFD] border border-[#DDE3EE] rounded-[10px] px-3 py-2.5 mb-4">
            <p className="text-[11px] font-mono text-blue-600 font-bold">{complaint.token}</p>
            <p className="text-[12px] font-semibold text-[#0E1C2F] mt-0.5">{complaint.title}</p>
            <p className="text-[10px] text-[#7A8FA6] mt-0.5">{complaint.citizenName} · {complaint.ward}, {complaint.district}</p>
          </div>
          <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">
            Acknowledgement Note <span className="text-[#7A8FA6] font-normal">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            placeholder="e.g. We have received your complaint and will respond within 24 hours."
            className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-blue-400 resize-none"
          />
          <p className="text-[10px] text-[#7A8FA6] mt-2">📱 Citizen will receive an SMS notification with your token number.</p>
        </div>
        <div className="px-5 pb-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold bg-amber-500 text-white hover:bg-amber-600">
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}

function ReassignDialog({ complaint, officers, onClose, onConfirm }: { complaint: Complaint; officers: Officer[]; onClose: () => void; onConfirm: (id: string, officer: Officer) => void }) {
  const [officerId, setOfficerId] = useState('');
  const [reason, setReason] = useState('');
  function handleSubmit() {
    if (!officerId) { toast.error('Please select an officer.'); return; }
    const o = officers.find(o => o.id === officerId)!;
    onConfirm(complaint.id, o);
    toast.success(`🔄 ${complaint.token} reassigned to ${o.name}.`);
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-[16px] w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DDE3EE]">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            <h2 className="text-[15px] font-bold text-[#0E1C2F]">Reassign Complaint</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#7A8FA6]"><X size={14} /></button>
        </div>
        <div className="p-5">
          <div className="bg-[#F8FAFD] border border-[#DDE3EE] rounded-[10px] px-3 py-2.5 mb-4">
            <p className="text-[11px] font-mono text-blue-600 font-bold">{complaint.token}</p>
            <p className="text-[12px] font-semibold text-[#0E1C2F] mt-0.5">{complaint.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-[#7A8FA6]">Currently:</span>
              {complaint.assignedTo ? (
                <span className="text-[10px] font-semibold text-[#3D5068]">{complaint.assignedTo.name}</span>
              ) : (
                <span className="text-[10px] text-red-500 italic">Unassigned</span>
              )}
            </div>
          </div>
          <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Assign To *</label>
          <div className="relative mb-3">
            <select
              value={officerId}
              onChange={e => setOfficerId(e.target.value)}
              className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-blue-400 appearance-none bg-white"
            >
              <option value="">— Select officer —</option>
              {officers.map(o => (
                <option key={o.id} value={o.id}>
                  {o.name} · {o.department} · {o.workload === 'ok' ? 'Normal load' : o.workload === 'high' ? 'High load' : 'Overloaded'}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] pointer-events-none" />
          </div>
          <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">
            Reason for Reassignment <span className="text-[#7A8FA6] font-normal">(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={2}
            placeholder="e.g. Officer on leave / Expertise match needed"
            className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-blue-400 resize-none"
          />
        </div>
        <div className="px-5 pb-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold bg-orange-500 text-white hover:bg-orange-600">
            Reassign
          </button>
        </div>
      </div>
    </div>
  );
}

function EscalateDialog({ complaint, onClose, onConfirm }: { complaint: Complaint; onClose: () => void; onConfirm: (id: string) => void }) {
  const [level, setLevel] = useState('L2');
  const [reason, setReason] = useState('');
  function handleSubmit() {
    if (!reason.trim()) { toast.error('Please provide an escalation reason.'); return; }
    onConfirm(complaint.id);
    toast.warning(`🚨 ${complaint.token} escalated to ${level}. Supervisor notified.`);
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-[16px] w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DDE3EE]">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚨</span>
            <h2 className="text-[15px] font-bold text-[#0E1C2F]">Escalate Complaint</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#7A8FA6]"><X size={14} /></button>
        </div>
        <div className="p-5">
          <div className="bg-red-50 border border-red-200 rounded-[10px] px-3 py-2.5 mb-4">
            <p className="text-[11px] font-mono text-blue-600 font-bold">{complaint.token}</p>
            <p className="text-[12px] font-semibold text-[#0E1C2F] mt-0.5">{complaint.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <PriorityBadge priority={complaint.priority} />
              <SLABadge slaStatus={complaint.slaStatus} slaDaysLeft={complaint.slaDaysLeft} />
            </div>
          </div>
          <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Escalate To *</label>
          <div className="flex gap-2 mb-4">
            {['L2', 'L3', 'District Collector'].map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`flex-1 py-2 rounded-[8px] text-[11px] font-semibold border transition-all ${level === l ? 'bg-red-600 text-white border-red-600' : 'bg-white border-[#DDE3EE] text-[#3D5068] hover:border-red-300'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Escalation Reason *</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. SLA breached. No response from assigned officer for 5 days. Citizen is aggrieved."
            className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-red-400 resize-none"
          />
          <p className="text-[10px] text-[#7A8FA6] mt-2">⚡ Supervisor and department head will be notified immediately.</p>
        </div>
        <div className="px-5 pb-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold bg-red-600 text-white hover:bg-red-700">
            Escalate Now
          </button>
        </div>
      </div>
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

  const { data: complaints = [] } = useComplaints();
  const { data: officers = [] } = useOfficers();
  const updateComplaint = useUpdateComplaint();

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

  function handleAcknowledge(id: string) {
    updateComplaint.mutate({ id, data: { status: 'acknowledged' } });
  }

  function handleReassign(id: string, officer: Officer) {
    updateComplaint.mutate({ id, data: { assignedTo: officer } });
  }

  function handleEscalate(id: string) {
    updateComplaint.mutate({ id, data: { status: 'escalated' } });
  }

  return (
    <div>
      {/* Dialogs */}
      {dialogType === 'acknowledge' && activeComplaint && (
        <AcknowledgeDialog complaint={activeComplaint} onClose={closeDialog} onConfirm={handleAcknowledge} />
      )}
      {dialogType === 'reassign' && activeComplaint && (
        <ReassignDialog complaint={activeComplaint} officers={officers} onClose={closeDialog} onConfirm={handleReassign} />
      )}
      {dialogType === 'escalate' && activeComplaint && (
        <EscalateDialog complaint={activeComplaint} onClose={closeDialog} onConfirm={handleEscalate} />
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
                        'hover:bg-[#FAFBFF] transition-colors',
                        i !== priorityQueue.length - 1 && 'border-b border-[#DDE3EE]'
                      )}
                    >
                      <td className="px-3 py-3">
                        <Link href={`/portal/complaints/${c.id}`} className="font-bold text-[11px] text-blue-600 hover:underline font-mono">
                          {c.token}
                        </Link>
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
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openDialog('acknowledge', c)}
                            title="Acknowledge"
                            className="px-2 py-1 rounded-[6px] text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all whitespace-nowrap"
                          >
                            ✋ Ack
                          </button>
                          <button
                            onClick={() => openDialog('reassign', c)}
                            title="Reassign"
                            className="px-2 py-1 rounded-[6px] text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-all whitespace-nowrap"
                          >
                            🔄 Reassign
                          </button>
                          <button
                            onClick={() => openDialog('escalate', c)}
                            title="Escalate"
                            className="px-2 py-1 rounded-[6px] text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all whitespace-nowrap"
                          >
                            🚨 Escalate
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
