'use client';
import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useComplaints, useUpdateComplaint } from '@/hooks/useComplaints';
import { useOfficers } from '@/hooks/useOfficers';
import { PriorityBadge, SLABadge } from '@/components/gms/StatusBadge';
import type { Complaint } from '@/types';

const DEPARTMENTS = [
  { id: 'gwssb', name: 'GWSSB', icon: '💧', code: 'Water Supply' },
  { id: 'amc', name: 'AMC', icon: '🏙️', code: 'Municipal Corp.' },
  { id: 'revenue', name: 'Revenue', icon: '📋', code: 'Revenue Dept.' },
  { id: 'roads', name: 'Roads & B', icon: '🛣️', code: 'Roads & Buildings' },
  { id: 'dgvcl', name: 'DGVCL', icon: '⚡', code: 'Electricity' },
  { id: 'rto', name: 'RTO', icon: '🚗', code: 'Transport' },
];

export default function ReassignPage() {
  const { data: complaints = [], isLoading } = useComplaints();
  const { data: officers = [] } = useOfficers();
  const updateComplaint = useUpdateComplaint();

  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);

  const unassigned = complaints.filter(c => !c.assignedTo && c.status !== 'resolved' && !assignedIds.includes(c.id));

  async function handleQuickAssign(complaint: Complaint) {
    if (!selectedOfficer) {
      toast.error('Select an officer from the right panel first.');
      return;
    }
    const officer = officers.find(o => o.id === selectedOfficer)!;
    await updateComplaint.mutateAsync({ id: complaint.id, data: { assignedTo: officer } });
    setAssignedIds(prev => [...prev, complaint.id]);
    toast.success(`📋 ${complaint.token} assigned to ${officer.name}.`);
  }

  async function handleConfirmAssignment() {
    if (!selectedOfficer) { toast.error('Please select an officer.'); return; }
    const officer = officers.find(o => o.id === selectedOfficer)!;
    const dept = DEPARTMENTS.find(d => d.id === selectedDept);
    if (selectedComplaint) {
      await updateComplaint.mutateAsync({ id: selectedComplaint, data: { assignedTo: officer } });
      setAssignedIds(prev => [...prev, selectedComplaint]);
    }
    const msg = dept
      ? `✅ Routed to ${dept.name} · assigned to ${officer.name}.`
      : `✅ Assigned to ${officer.name}.`;
    toast.success(msg);
    setSelectedDept(null);
    setSelectedOfficer(null);
    setSelectedComplaint(null);
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-[13px] text-[#7A8FA6]">Loading reassignment queue…</div>
  );

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <ArrowUpRight size={20} className="text-orange-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Reassign / Route Complaints</h1>
          <p className="text-[12px] text-[#7A8FA6]">
            {unassigned.length} unassigned · route to correct department or officer
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Unassigned complaints list */}
        <div className="xl:col-span-2">
          <h2 className="text-[13px] font-bold text-[#0E1C2F] mb-3">Pending Assignment</h2>
          <div className="space-y-2">
            {unassigned.length === 0 ? (
              <div className="bg-white border border-[#DDE3EE] rounded-[14px] py-12 text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-[14px] font-bold text-[#0E1C2F]">All complaints assigned</p>
                <p className="text-[12px] text-[#7A8FA6] mt-1">No pending assignments at this time.</p>
              </div>
            ) : (
              unassigned.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaint(c.id === selectedComplaint ? null : c.id)}
                  className={cn(
                    'bg-white border rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer transition-all',
                    selectedComplaint === c.id
                      ? 'border-blue-400 bg-blue-50/40 shadow-sm'
                      : 'border-[#DDE3EE] hover:border-blue-200'
                  )}
                >
                  <div className={cn('w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all', selectedComplaint === c.id ? 'bg-blue-600 border-blue-600' : 'border-gray-300')}>
                    {selectedComplaint === c.id && <span className="text-white text-[8px]">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[11px] font-bold text-blue-600 font-mono">{c.token}</span>
                      <PriorityBadge priority={c.priority} />
                      <SLABadge slaStatus={c.slaStatus} slaDaysLeft={c.slaDaysLeft} />
                    </div>
                    <p className="text-[12px] font-medium text-[#0E1C2F] truncate">{c.title}</p>
                    <p className="text-[10px] text-[#7A8FA6]">{c.department} · {c.district} · {c.citizenName}</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleQuickAssign(c); }}
                    className="px-3 py-1.5 bg-blue-600 text-white text-[11px] font-semibold rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                  >
                    Assign →
                  </button>
                </div>
              ))
            )}
          </div>

          {/* All complained already assigned message */}
          {assignedIds.length > 0 && (
            <div className="mt-3 text-center text-[11px] text-green-600 font-semibold bg-green-50 border border-green-200 rounded-lg py-2">
              ✅ {assignedIds.length} complaint{assignedIds.length > 1 ? 's' : ''} assigned in this session
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Department selector */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4">
            <h3 className="text-[13px] font-bold text-[#0E1C2F] mb-3">Select Department</h3>
            <div className="grid grid-cols-2 gap-2">
              {DEPARTMENTS.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDept(d.id === selectedDept ? null : d.id)}
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-lg border-[1.5px] transition-all text-left',
                    selectedDept === d.id ? 'border-blue-500 bg-blue-50' : 'border-[#DDE3EE] hover:border-blue-200'
                  )}
                >
                  <span className="text-[16px]">{d.icon}</span>
                  <div>
                    <p className="text-[11px] font-bold text-[#0E1C2F]">{d.name}</p>
                    <p className="text-[9px] text-[#7A8FA6]">{d.code}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Officer selector */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4">
            <h3 className="text-[13px] font-bold text-[#0E1C2F] mb-3">Select Officer</h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {officers.map(o => {
                const loadColor = o.workload === 'ok' ? '#16A34A' : o.workload === 'high' ? '#D97706' : '#DC2626';
                const loadBg = o.workload === 'ok' ? '#F0FDF4' : o.workload === 'high' ? '#FFFBEB' : '#FEF2F2';
                const assigned = complaints.filter(c => c.assignedTo?.id === o.id).length;
                return (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOfficer(o.id === selectedOfficer ? null : o.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 p-2.5 rounded-lg border-[1.5px] transition-all text-left',
                      selectedOfficer === o.id ? 'border-green-500 bg-green-50' : 'border-[#DDE3EE] hover:border-green-200'
                    )}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ backgroundColor: o.color }}>
                      {o.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[#0E1C2F]">{o.name}</p>
                      <p className="text-[10px] text-[#7A8FA6]">{o.role} · {assigned} active</p>
                    </div>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ color: loadColor, background: loadBg }}>
                      {o.workload === 'ok' ? 'Normal' : o.workload === 'high' ? 'High' : 'Full'}
                    </span>
                  </button>
                );
              })}
            </div>

            {(selectedDept || selectedOfficer) && (
              <button
                onClick={handleConfirmAssignment}
                className="mt-3 w-full py-2.5 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✓ Confirm Assignment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
