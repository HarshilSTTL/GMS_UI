'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Download, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_COMPLAINTS } from '@/data';
import { StatusBadge, PriorityBadge, ChannelBadge, SLABadge } from '@/components/gms/StatusBadge';
import { ComplaintStatus, ComplaintPriority } from '@/types';

const STATUS_FILTERS: { value: ComplaintStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'resolved', label: 'Resolved' },
];

const PRIORITY_FILTERS: { value: ComplaintPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priority' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

function FilterButton({
  active, onClick, children
}: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 border whitespace-nowrap',
        active
          ? 'bg-blue-50 text-blue-700 border-blue-300'
          : 'bg-white text-[#3D5068] border-[#DDE3EE] hover:border-[#C8D0DE]'
      )}
    >
      {children}
    </button>
  );
}

export default function ComplaintsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ComplaintPriority | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return MOCK_COMPLAINTS.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.token.toLowerCase().includes(q) &&
          !c.title.toLowerCase().includes(q) &&
          !c.citizenName.toLowerCase().includes(q) &&
          !c.department.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, statusFilter, priorityFilter]);

  function toggleSelect(id: string) {
    setSelected(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(c => c.id)));
    }
  }

  function resetFilters() {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSelected(new Set());
  }

  const hasFilters = search || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">All Complaints</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">
          {filtered.length} complaint{filtered.length !== 1 ? 's' : ''} · Complete registry
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-[#DDE3EE] rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-xs">
          <Search size={13} className="text-[#7A8FA6] flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search token, citizen, keyword..."
            className="bg-transparent text-[12px] text-[#0E1C2F] placeholder:text-[#7A8FA6] outline-none flex-1"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <FilterButton
              key={f.value}
              active={statusFilter === f.value}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </FilterButton>
          ))}
        </div>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value as ComplaintPriority | 'all')}
          className="bg-white border border-[#DDE3EE] rounded-lg px-3 py-1.5 text-[12px] text-[#3D5068] outline-none cursor-pointer hover:border-[#C8D0DE] transition-colors"
        >
          {PRIORITY_FILTERS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-[11px] text-[#7A8FA6] hover:text-[#3D5068] transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}

        <div className="flex-1" />

        {/* Selected actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              {selected.size} selected
            </span>
            <button className="text-[12px] font-semibold bg-[#EA580C] text-white px-3 py-1.5 rounded-lg hover:bg-[#C2430A] transition-colors">
              Bulk Reassign
            </button>
            <button className="text-[12px] font-semibold bg-[#7C3AED] text-white px-3 py-1.5 rounded-lg hover:bg-[#6D28D9] transition-colors">
              Group Selected
            </button>
          </div>
        )}

        <button className="flex items-center gap-1.5 bg-white border border-[#DDE3EE] rounded-lg px-3 py-1.5 text-[12px] text-[#3D5068] font-semibold hover:border-[#C8D0DE] transition-colors">
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
                  <th className="px-3 py-2.5 border-b border-[#DDE3EE] w-8">
                    <div
                      onClick={toggleAll}
                      className={cn(
                        'w-4 h-4 border-2 rounded cursor-pointer flex items-center justify-center transition-all',
                        selected.size === filtered.length && filtered.length > 0
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-[#C8D0DE]'
                      )}
                    >
                      {selected.size === filtered.length && filtered.length > 0 && (
                        <span className="text-white text-[9px]">✓</span>
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">Token</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Issue / Citizen</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden md:table-cell">Channel</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden sm:table-cell">Priority</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Status</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">SLA</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden lg:table-cell">Assigned</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] hidden xl:table-cell">Department</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    className={cn(
                      'hover:bg-[#FAFBFF] cursor-pointer transition-colors group',
                      selected.has(c.id) && 'bg-blue-50/70',
                      i !== filtered.length - 1 && 'border-b border-[#DDE3EE]'
                    )}
                  >
                    <td className="px-3 py-3">
                      <div
                        onClick={() => toggleSelect(c.id)}
                        className={cn(
                          'w-4 h-4 border-2 rounded cursor-pointer flex items-center justify-center transition-all',
                          selected.has(c.id) ? 'bg-blue-600 border-blue-600' : 'border-[#C8D0DE]'
                        )}
                      >
                        {selected.has(c.id) && <span className="text-white text-[9px]">✓</span>}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={`/portal/complaints/${c.id}`}
                        className="font-bold text-[11px] text-blue-600 hover:underline font-mono"
                      >
                        {c.token}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/portal/complaints/${c.id}`}>
                        <div className="font-medium text-[#0E1C2F] truncate max-w-[180px] hover:text-blue-600 transition-colors">
                          {c.title}
                        </div>
                        <div className="text-[10px] text-[#7A8FA6] mt-0.5">{c.ward}, {c.district} · {c.citizenName}</div>
                      </Link>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <ChannelBadge channel={c.channel} />
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-3 py-3">
                      <SLABadge slaStatus={c.slaStatus} slaDaysLeft={c.slaDaysLeft} />
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      {c.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: c.assignedTo.color }}
                          >
                            {c.assignedTo.initials}
                          </div>
                          <span className="text-[11px] text-[#3D5068]">{c.assignedTo.name.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#7A8FA6] italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-3 py-3 hidden xl:table-cell">
                      <span className="text-[11px] text-[#3D5068]">{c.department}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination placeholder */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-[12px] text-[#7A8FA6]">
          <span>Showing {filtered.length} of {MOCK_COMPLAINTS.length} complaints</span>
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
