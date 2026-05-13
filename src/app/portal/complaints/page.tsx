'use client';
import React, { useState, useMemo } from 'react';
import { Search, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useComplaints, useUpdateComplaint } from '@/hooks/useComplaints';
import { useOfficers } from '@/hooks/useOfficers';
import { useDepartments } from '@/hooks/useDepartments';
import { StatusBadge, PriorityBadge, ChannelBadge, SLABadge } from '@/components/gms/StatusBadge';
import { ViewDetailDialog, ReassignDialog, GroupDialog, DialogType } from '@/components/gms/ComplaintModals';
import type { Complaint, Officer, ComplaintStatus, ComplaintPriority } from '@/types';

/* ─── FILTER CONFIG ─── */
type QuickFilter = 'all' | 'open' | 'in_progress' | 'breached';

const QUICK_FILTERS: { value: QuickFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'breached', label: 'SLA Breached' },
];

function FilterPill({ active, count, onClick, children }: { active?: boolean; count: number; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-[11px] font-semibold transition-all border whitespace-nowrap',
        active ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-[#3D5068] border-[#DDE3EE] hover:border-[#C8D0DE]'
      )}
    >
      {children}
      <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-bold', active ? 'bg-blue-200/60 text-blue-800' : 'bg-gray-100 text-[#7A8FA6]')}>{count}</span>
    </button>
  );
}

function daysAgo(dateStr: string): string {
  const days = Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function ComplaintsPage() {
  const { data: complaints = [], isLoading } = useComplaints();
  const { data: officers = [] } = useOfficers();
  const { data: departments = [] } = useDepartments();
  const updateComplaint = useUpdateComplaint();

  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<ComplaintPriority | 'all'>('all');
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  /* ─── Dialog state ─── */
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  function openDialog(type: DialogType, complaint: Complaint) { setActiveComplaint(complaint); setDialogType(type); }
  function closeDialog() { setDialogType(null); setActiveComplaint(null); }
  function switchDialog(type: DialogType) { if (activeComplaint) setDialogType(type); }

  /* ─── Filter counts ─── */
  const counts = useMemo(() => ({
    all: complaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    in_progress: complaints.filter(c => ['in_progress', 'acknowledged'].includes(c.status)).length,
    breached: complaints.filter(c => c.slaStatus === 'breach').length,
  }), [complaints]);

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      if (quickFilter === 'open' && c.status !== 'open') return false;
      if (quickFilter === 'in_progress' && !['in_progress', 'acknowledged'].includes(c.status)) return false;
      if (quickFilter === 'breached' && c.slaStatus !== 'breach') return false;
      if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.token.toLowerCase().includes(q) && !c.title.toLowerCase().includes(q) && !c.citizenName.toLowerCase().includes(q) && !c.department.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [complaints, search, quickFilter, priorityFilter]);

  function toggleSelect(id: string) { setSelected(s => { const next = new Set(s); next.has(id) ? next.delete(id) : next.add(id); return next; }); }
  function toggleAll() { if (selected.size === filtered.length) setSelected(new Set()); else setSelected(new Set(filtered.map(c => c.id))); }
  function clearSelection() { setSelected(new Set()); setSelectMode(false); }
  function resetFilters() { setSearch(''); setQuickFilter('all'); setPriorityFilter('all'); setSelected(new Set()); }

  /* ─── Dialog handlers ─── */
  function handleAcknowledge(id: string) { updateComplaint.mutate({ id, data: { status: 'acknowledged' } }); toast.success('✋ Complaint acknowledged. Citizen notified via SMS.'); closeDialog(); }
  function handleReassign(id: string, officer: Officer) { updateComplaint.mutate({ id, data: { assignedTo: officer } }); }
  function handleEscalate(id: string) { updateComplaint.mutate({ id, data: { status: 'escalated' } }); toast.warning('🚨 Complaint escalated. Supervisor notified.'); closeDialog(); }
  function handleResolve(id: string) { updateComplaint.mutate({ id, data: { status: 'resolved', resolvedAt: new Date().toISOString() } }); toast.success('✅ Complaint resolved.'); closeDialog(); }
  function handleSendUpdate(id: string, msg: string) { updateComplaint.mutate({ id, data: { updatedAt: new Date().toISOString() } }); toast.success('📤 Update sent to citizen.'); }
  function handleCreateGroup(primaryId: string, memberIds: string[], label: string) {
    const groupId = `g${Date.now()}`;
    updateComplaint.mutate({ id: primaryId, data: { groupId, isGroupPrimary: true } });
    memberIds.forEach(mid => updateComplaint.mutate({ id: mid, data: { groupId, isGroupPrimary: false } }));
    toast.success(`🔗 Group created — ${label} with ${memberIds.length + 1} complaints.`);
    closeDialog();
  }

  const hasFilters = search || quickFilter !== 'all' || priorityFilter !== 'all';

  if (isLoading) return <div className="flex items-center justify-center h-64 text-[13px] text-[#7A8FA6]">Loading complaints…</div>;

  return (
    <div>
      {/* Dialogs */}
      {dialogType === 'view' && activeComplaint && (
        <ViewDetailDialog complaint={activeComplaint} complaints={complaints} officers={officers} onClose={closeDialog}
          onAcknowledge={handleAcknowledge} onReassign={handleReassign} onEscalate={handleEscalate} onResolve={handleResolve}
          onSendUpdate={handleSendUpdate} onOpenReassign={() => switchDialog('reassign')} onOpenGroup={() => switchDialog('group')} />
      )}
      {dialogType === 'reassign' && activeComplaint && (
        <ReassignDialog complaint={activeComplaint} officers={officers} departments={departments} onClose={closeDialog} onConfirm={handleReassign} />
      )}
      {dialogType === 'group' && activeComplaint && (
        <GroupDialog complaint={activeComplaint} allComplaints={complaints} onClose={closeDialog} onCreateGroup={handleCreateGroup} />
      )}

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">All Complaints</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">{filtered.length} complaint{filtered.length !== 1 ? 's' : ''} · Complete registry</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-[#DDE3EE] rounded-[8px] px-3 py-2 flex-1 min-w-[200px] max-w-xs">
          <Search size={13} className="text-[#7A8FA6] flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search token, citizen, keyword..."
            className="bg-transparent text-[12px] text-[#0E1C2F] placeholder:text-[#7A8FA6] outline-none flex-1" />
        </div>

        {/* Quick filters with counts */}
        {QUICK_FILTERS.map(f => (
          <FilterPill key={f.value} active={quickFilter === f.value} count={counts[f.value]} onClick={() => setQuickFilter(f.value)}>
            {f.label}
          </FilterPill>
        ))}

        {/* Priority filter */}
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as ComplaintPriority | 'all')}
          className="bg-white border border-[#DDE3EE] rounded-[8px] px-3 py-1.5 text-[11px] text-[#3D5068] outline-none cursor-pointer hover:border-[#C8D0DE] transition-colors">
          <option value="all">All Priority</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
        </select>

        {hasFilters && (
          <button onClick={resetFilters} className="flex items-center gap-1.5 text-[11px] text-[#7A8FA6] hover:text-[#3D5068] transition-colors"><RotateCcw size={12} /> Reset</button>
        )}

        <div className="flex-1" />

        {/* Bulk actions */}
        {selectMode && selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-[8px] border border-blue-200">{selected.size} selected</span>
            <button onClick={() => { toast.success(`🔗 ${selected.size} complaint(s) grouped.`); setSelected(new Set()); }}
              className="text-[12px] font-semibold bg-violet-500 text-white px-3 py-1.5 rounded-[8px] hover:bg-violet-600 transition-colors">🔗 Group Selected</button>
            <button onClick={() => { toast.success(`↗ ${selected.size} complaint(s) queued for reassignment.`); setSelected(new Set()); }}
              className="text-[12px] font-semibold bg-orange-500 text-white px-3 py-1.5 rounded-[8px] hover:bg-orange-600 transition-colors">↗ Bulk Reassign</button>
            <button onClick={clearSelection} className="text-[12px] font-semibold bg-white text-[#3D5068] border border-[#DDE3EE] px-3 py-1.5 rounded-[8px] hover:bg-gray-50 transition-colors">✕ Clear</button>
          </div>
        )}

        <button onClick={() => setSelectMode(!selectMode)}
          className={cn('flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition-colors border',
            selectMode ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-[#3D5068] border-[#DDE3EE] hover:border-[#C8D0DE]'
          )}>
          {selectMode ? '☑ Select Mode' : '☐ Select'}
        </button>

        <button onClick={() => toast.success('🤖 AI analyzing complaints for grouping suggestions…')}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-[12px] font-semibold px-3 py-1.5 rounded-[8px] hover:bg-blue-700 shadow-[0_2px_8px_rgba(26,86,196,0.25)] transition-colors">
          🤖 AI Group Suggest
        </button>

        <button onClick={() => toast.success('📥 Exporting complaints to CSV…')}
          className="flex items-center gap-1.5 bg-white border border-[#DDE3EE] rounded-[8px] px-3 py-1.5 text-[12px] text-[#3D5068] font-semibold hover:border-[#C8D0DE] transition-colors">
          <Download size={13} /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-[15px] font-bold text-[#0E1C2F] mb-1">No complaints found</p>
            <p className="text-[12px] text-[#7A8FA6]">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead className="bg-[#F8FAFD]">
                <tr>
                  {selectMode && (
                    <th className="px-3 py-2.5 border-b border-[#DDE3EE] w-8">
                      <div onClick={toggleAll} className={cn('w-4 h-4 border-2 rounded cursor-pointer flex items-center justify-center transition-all', selected.size === filtered.length && filtered.length > 0 ? 'bg-blue-600 border-blue-600' : 'border-[#C8D0DE]')}>
                        {selected.size === filtered.length && filtered.length > 0 && <span className="text-white text-[9px]">✓</span>}
                      </div>
                    </th>
                  )}
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">Token</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Citizen & Issue</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden md:table-cell">Channel</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden xl:table-cell">Department</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden sm:table-cell">Priority</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Status</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">SLA</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden lg:table-cell">Assigned To</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden xl:table-cell">Filed</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    onClick={() => openDialog('view', c)}
                    className={cn(
                      'group hover:bg-[#FAFBFF] cursor-pointer transition-colors',
                      selected.has(c.id) && 'bg-blue-50/70',
                      i !== filtered.length - 1 && 'border-b border-[#DDE3EE]'
                    )}
                  >
                    {selectMode && (
                      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                        <div onClick={() => toggleSelect(c.id)} className={cn('w-4 h-4 border-2 rounded cursor-pointer flex items-center justify-center transition-all', selected.has(c.id) ? 'bg-blue-600 border-blue-600' : 'border-[#C8D0DE]')}>
                          {selected.has(c.id) && <span className="text-white text-[9px]">✓</span>}
                        </div>
                      </td>
                    )}
                    <td className="px-3 py-3">
                      <span className="font-bold text-[11px] text-blue-600 font-mono">{c.token}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-[#0E1C2F] truncate max-w-[180px]">{c.title}</div>
                      <div className="text-[10px] text-[#7A8FA6] mt-0.5">{c.citizenName} · {c.ward}, {c.district}</div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell"><ChannelBadge channel={c.channel} /></td>
                    <td className="px-3 py-3 hidden xl:table-cell"><span className="text-[11px] text-[#3D5068]">{c.department}</span></td>
                    <td className="px-3 py-3 hidden sm:table-cell"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-3 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-3 py-3"><SLABadge slaStatus={c.slaStatus} slaDaysLeft={c.slaDaysLeft} /></td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      {c.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: c.assignedTo.color }}>{c.assignedTo.initials}</div>
                          <span className="text-[11px] text-[#3D5068]">{c.assignedTo.name.split(' ')[0]}</span>
                        </div>
                      ) : <span className="text-[11px] text-[#7A8FA6] italic">Unassigned</span>}
                    </td>
                    <td className="px-3 py-3 hidden xl:table-cell">
                      <span className="text-[11px] text-[#7A8FA6]">{daysAgo(c.createdAt)}</span>
                    </td>
                    {/* ── ACTION BUTTONS ── */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openDialog('view', c)} title="View"
                          className="w-[26px] h-[26px] rounded-[6px] border border-[#DDE3EE] bg-white flex items-center justify-center text-[12px] hover:bg-[#F0F2F7] hover:border-[#C8D0DE] transition-all">👁</button>
                        <button onClick={() => openDialog('reassign', c)} title="Reassign"
                          className="w-[26px] h-[26px] rounded-[6px] border border-[#DDE3EE] bg-white flex items-center justify-center text-[12px] hover:bg-[#F0F2F7] hover:border-[#C8D0DE] transition-all">↗</button>
                        <button onClick={() => openDialog('group', c)} title="Group"
                          className="w-[26px] h-[26px] rounded-[6px] border border-[#DDE3EE] bg-white flex items-center justify-center text-[12px] hover:bg-[#F0F2F7] hover:border-[#C8D0DE] transition-all">🔗</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-[12px] text-[#7A8FA6]">
          <span>Showing {filtered.length} of {complaints.length} complaints</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-[#DDE3EE] rounded-lg bg-white hover:border-[#C8D0DE] transition-colors">← Prev</button>
            <button className="px-3 py-1.5 border border-blue-600 rounded-lg bg-blue-600 text-white font-semibold">1</button>
            <button className="px-3 py-1.5 border border-[#DDE3EE] rounded-lg bg-white hover:border-[#C8D0DE] transition-colors">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
