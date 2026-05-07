'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, RotateCcw, CheckCircle, Phone, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useComplaints, useUpdateComplaint } from '@/hooks/useComplaints';
import { useOfficers } from '@/hooks/useOfficers';
import { StatusBadge, PriorityBadge, SLABadge, ChannelBadge } from '@/components/gms/StatusBadge';
import { useAuthStore } from '@/stores';
import type { Complaint } from '@/types';

function WorkCard({ complaint }: { complaint: Complaint }) {
  const { data: officers = [] } = useOfficers();
  const updateComplaint = useUpdateComplaint();
  const [note, setNote] = useState('');
  const [status, setStatus] = useState(complaint.status);

  function handleSaveUpdate() {
    if (!note.trim()) { toast.error('Please enter an update before saving.'); return; }
    toast.success(`Update saved for ${complaint.token}. Timeline updated.`);
    setNote('');
  }

  async function handleResolve() {
    setStatus('resolved');
    await updateComplaint.mutateAsync({ id: complaint.id, data: { status: 'resolved', resolvedAt: new Date().toISOString() } });
    toast.success(`✅ ${complaint.token} marked as resolved. CSAT survey sent to citizen.`);
  }

  async function handleReassign() {
    if (!officers.length) { toast.error('No officers available.'); return; }
    const officer = officers[Math.floor(Math.random() * officers.length)];
    await updateComplaint.mutateAsync({ id: complaint.id, data: { assignedTo: officer } });
    toast.success(`🔄 ${complaint.token} reassigned to ${officer.name}.`);
  }

  function handleContact() {
    toast.info(`📞 Calling ${complaint.citizenName} at ${complaint.citizenPhone}…`);
  }

  const isResolved = status === 'resolved';

  return (
    <div className={cn(
      'bg-white border rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)] hover:shadow-[0_4px_16px_rgba(14,28,47,0.08)] transition-shadow',
      isResolved ? 'border-green-200 opacity-75' : 'border-[#DDE3EE]'
    )}>
      {/* Card header */}
      <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Link href={`/portal/complaints/${complaint.id}`} className="text-[12px] font-bold text-blue-600 hover:underline font-mono">
              {complaint.token}
            </Link>
            <PriorityBadge priority={complaint.priority} />
            <SLABadge slaStatus={complaint.slaStatus} slaDaysLeft={complaint.slaDaysLeft} />
            <ChannelBadge channel={complaint.channel} />
          </div>
          <h3 className="text-[15px] font-bold text-[#0E1C2F] mb-1">{complaint.title}</h3>
          <p className="text-[11px] text-[#7A8FA6]">
            {complaint.ward}, {complaint.district} · {complaint.citizenName} · {complaint.citizenPhone}
          </p>
        </div>
        <StatusBadge status={status as typeof complaint.status} />
      </div>

      {/* Description */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-[12px] text-[#3D5068] leading-relaxed bg-[#F8FAFD] rounded-lg px-3 py-2.5 border border-[#EDF1F7] italic">
          "{complaint.description}"
        </p>
      </div>

      {/* Action area */}
      {!isResolved ? (
        <div className="px-5 pb-5 pt-3">
          <label className="block text-[11px] font-bold text-[#3D5068] mb-2">
            Add update / action note
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Describe the action taken, field visit findings, or update for the citizen…"
            className="w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] resize-none min-h-[68px] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-colors"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={handleSaveUpdate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
            >
              <MessageSquare size={13} /> Save Update
            </button>
            <button
              onClick={handleResolve}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-[12px] font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={13} /> Mark Resolved
            </button>
            <button
              onClick={handleReassign}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-[12px] font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              <RotateCcw size={13} /> Reassign
            </button>
            <button
              onClick={handleContact}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EE] text-[#3D5068] text-[12px] font-semibold rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              <Phone size={13} /> Contact Citizen
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5 pb-4 pt-3">
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <CheckCircle size={14} />
            <span className="text-[12px] font-semibold">Resolved — CSAT survey sent to citizen</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyWorkPage() {
  const { user } = useAuthStore();
  const { data: complaints = [], isLoading } = useComplaints();
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'resolved'>('pending');

  // Show complaints for the logged-in officer (default to o1 for demo)
  const myComplaints = complaints.filter(c =>
    c.assignedTo && (c.assignedTo.name === user?.name || c.assignedTo.id === 'o1')
  );

  const pending = myComplaints.filter(c => c.status === 'open' || c.status === 'acknowledged');
  const inProgress = myComplaints.filter(c => c.status === 'in_progress' || c.status === 'under_review' || c.status === 'escalated');
  const resolved = myComplaints.filter(c => c.status === 'resolved');

  const tabData = { pending, in_progress: inProgress, resolved };
  const tabCounts = { pending: pending.length, in_progress: inProgress.length, resolved: resolved.length };
  const displayed = tabData[activeTab];

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-[13px] text-[#7A8FA6]">Loading work queue…</div>
  );

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">My Work Queue</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">
          Assigned to {user?.name ?? 'you'} · {myComplaints.length} total complaints
        </p>
      </div>

      {/* Summary chips / tab switcher */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { key: 'pending', label: 'Pending Action', color: '#DC2626', bg: '#FEF2F2' },
          { key: 'in_progress', label: 'In Progress', color: '#D97706', bg: '#FFFBEB' },
          { key: 'resolved', label: 'Resolved', color: '#16A34A', bg: '#F0FDF4' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-150',
              activeTab === t.key ? 'border-2 shadow-sm' : 'bg-white border-[#DDE3EE] hover:border-[#C8D0DE]'
            )}
            style={activeTab === t.key ? { background: t.bg, borderColor: t.color } : {}}
          >
            <span className="text-[22px] font-bold leading-none" style={{ color: t.color }}>
              {tabCounts[t.key as typeof activeTab]}
            </span>
            <span className="text-[12px] font-semibold text-[#3D5068]">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Work cards */}
      <div className="space-y-3">
        {displayed.length === 0 ? (
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] py-14 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-[15px] font-bold text-[#0E1C2F] mb-1">All caught up!</p>
            <p className="text-[12px] text-[#7A8FA6]">No complaints in this category right now.</p>
          </div>
        ) : (
          displayed.map(c => <WorkCard key={c.id} complaint={c} />)
        )}
      </div>
    </div>
  );
}
