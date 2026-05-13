'use client';
import React, { useState, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useComplaints, useUpdateComplaint } from '@/hooks/useComplaints';
import { useOfficers } from '@/hooks/useOfficers';
import { useDepartments } from '@/hooks/useDepartments';
import { SLABadge } from '@/components/gms/StatusBadge';
import { SectionCard, DepartmentSelector, OfficerSelector } from '@/components/gms/ReassignComponents';
import type { Complaint, Officer } from '@/types';

export default function ReassignPage() {
  const { data: complaints = [], isLoading } = useComplaints();
  const { data: officers = [] } = useOfficers();
  const { data: departments = [] } = useDepartments();
  const updateComplaint = useUpdateComplaint();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [reason, setReason] = useState('');

  const routable = useMemo(
    () => complaints.filter(c => c.status !== 'resolved'),
    [complaints]
  );

  const filteredOfficers = useMemo(
    () => officers.filter(o => o.department === selectedDept || !selectedDept),
    [officers, selectedDept]
  );

  function toggleComplaint(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleQuickAssign(complaint: Complaint) {
    if (!selectedOfficerId) { toast.error('Select an officer from the right panel first.'); return; }
    const officer = officers.find(o => o.id === selectedOfficerId)!;
    updateComplaint.mutate({ id: complaint.id, data: { assignedTo: officer } });
    toast.success(`📋 ${complaint.token} assigned to ${officer.name}.`);
  }

  function handleConfirmBulk() {
    if (selectedIds.size === 0) { toast.error('Select at least one complaint.'); return; }
    if (!selectedOfficerId) { toast.error('Select an officer.'); return; }
    const officer = officers.find(o => o.id === selectedOfficerId)!;
    selectedIds.forEach(id => {
      updateComplaint.mutate({ id, data: { assignedTo: officer } });
    });
    toast.success(`↗ ${selectedIds.size} complaint(s) reassigned to ${officer.name}.`);
    setSelectedIds(new Set());
  }

  if (isLoading) return <div className="flex items-center justify-center h-64 text-[13px] text-[#7A8FA6]">Loading reassignment queue…</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">Reassign / Route Complaints</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">{routable.length} complaint{routable.length !== 1 ? 's' : ''} available · Route to correct department or officer</p>
      </div>

      {/* Two-column layout matching HTML reference */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 items-start">
        {/* Left: Complaint selection */}
        <SectionCard title="Select complaints to reassign" rightElement={
          selectedIds.size > 0 && <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{selectedIds.size} selected</span>
        }>
          <div className="border border-[#DDE3EE] rounded-[8px] overflow-hidden">
            <table className="w-full border-collapse text-[12px]">
              <thead className="bg-[#F8FAFD]">
                <tr>
                  <th className="px-3 py-2 w-10"></th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-[#7A8FA6] uppercase">Token</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-[#7A8FA6] uppercase">Issue</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-[#7A8FA6] uppercase hidden sm:table-cell">Current dept</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-[#7A8FA6] uppercase">SLA</th>
                </tr>
              </thead>
              <tbody>
                {routable.map((c, i) => (
                  <tr key={c.id} className={cn('hover:bg-[#FAFBFF] transition-colors', i !== routable.length - 1 && 'border-b border-[#DDE3EE]')}>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => toggleComplaint(c.id)}
                        className={cn('w-4 h-4 rounded-[4px] border-2 flex items-center justify-center text-white text-[9px] transition-all',
                          selectedIds.has(c.id) ? 'bg-blue-600 border-blue-600' : 'border-[#C8D0DE] bg-white hover:border-blue-400'
                        )}
                      >
                        {selectedIds.has(c.id) && '✓'}
                      </button>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[11px] font-semibold text-blue-600 font-mono">{c.token}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-[12px] font-medium text-[#0E1C2F] truncate max-w-[200px]">{c.title}</div>
                      <div className="text-[10px] text-[#7A8FA6] mt-0.5">{c.ward}, {c.district}</div>
                    </td>
                    <td className="px-3 py-2.5 hidden sm:table-cell">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700">{c.department}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <SLABadge slaStatus={c.slaStatus} slaDaysLeft={c.slaDaysLeft} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Right: Department + Officer + Confirm */}
        <div className="space-y-4">
          <SectionCard title="Reassign to department">
            <DepartmentSelector
              departments={departments}
              selected={selectedDept}
              onSelect={(name) => { setSelectedDept(name); setSelectedOfficerId(''); }}
            />
          </SectionCard>

          <SectionCard title="Assign to officer">
            <OfficerSelector
              officers={filteredOfficers}
              selected={selectedOfficerId}
              onSelect={setSelectedOfficerId}
            />
          </SectionCard>

          <div>
            <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Reason (audit log)</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={2}
              placeholder="e.g. Route change — pipeline issue falls under Zone 3..."
              className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[7px] focus:outline-none focus:border-blue-400 resize-none"
            />
          </div>

          <button
            onClick={handleConfirmBulk}
            disabled={selectedIds.size === 0 || !selectedOfficerId}
            className={cn(
              'w-full py-3 rounded-[8px] text-[13px] font-semibold transition-all',
              selectedIds.size > 0 && selectedOfficerId
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_2px_8px_rgba(234,88,12,0.25)]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            ↗ Confirm Reassignment{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
