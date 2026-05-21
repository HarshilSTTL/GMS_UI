'use client';
import { useState, useEffect } from 'react';
import { FileText, Search, Filter, Plus, ChevronUp, ChevronDown, ArrowUpDown, RefreshCw } from 'lucide-react';
import { getLocalGrievancesByUser } from '@/lib/local-store';
import Link from 'next/link';
import { useAuthStore } from '@/stores';

interface Grievance {
  id: string; token: string; title: string; category: string; status: string;
  priority: string; channel: string; slaStatus: string; slaDaysLeft: number;
  location: string; officer: string; officerDept: string;
  submittedDate: string; updatedAt: string; rating: number | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FFFBEB' },
  in_progress: { label: 'In Progress', color: '#1A56C4', bg: '#EBF2FF' },
  resolved: { label: 'Resolved', color: '#16A34A', bg: '#F0FDF4' },
  escalated: { label: 'Escalated', color: '#DC2626', bg: '#FEF2F2' },
  acknowledged: { label: 'Acknowledged', color: '#0891B2', bg: '#ECFEFF' },
  under_review: { label: 'Under Review', color: '#7C3AED', bg: '#F5F3FF' },
  document_requested: { label: '⚠ Action Required', color: '#92400E', bg: '#FEF3C7' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  critical: { label: 'CRITICAL', color: '#DC2626' },
  high: { label: 'HIGH', color: '#D97706' },
  medium: { label: 'MEDIUM', color: '#1A56C4' },
  low: { label: 'LOW', color: '#16A34A' },
};

type SortKey = 'token' | 'submittedDate' | 'status' | 'priority';
type SortDir = 'asc' | 'desc';

export default function CitizenGrievances() {
  const { user } = useAuthStore();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('submittedDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function fetchFromServer(userId: string) {
    return fetch(`/api/grievances/citizen/${userId}`)
      .then(r => r.json())
      .then(d => {
        const data = d.data || d;
        if (!Array.isArray(data)) return;
        setGrievances(data.map((g: any) => ({
          ...g,
          submittedDate: g.createdAt || g.submittedDate,
          officer: g.assignedTo?.name || g.officer || 'Unassigned',
          officerDept: g.assignedTo?.department || g.officerDept || '',
          status: g.status === 'open' ? 'pending' : g.status,
        })));
      });
  }

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem('gms-auth') || '{}')?.state?.user;
    if (!authUser?.id) { setLoading(false); return; }

    fetchFromServer(authUser.id)
      .catch(() => {
        setGrievances(getLocalGrievancesByUser(authUser.id));
      })
      .finally(() => setLoading(false));

    // Refresh when tab comes back into focus
    function onFocus() {
      setRefreshing(true);
      fetchFromServer(authUser.id).catch(() => {}).finally(() => setRefreshing(false));
    }
    window.addEventListener('focus', onFocus);

    // Auto-refresh every 20 seconds to catch officer updates
    const refreshInterval = setInterval(() => {
      fetchFromServer(authUser.id).catch(() => {});
    }, 20000);

    return () => {
      window.removeEventListener('focus', onFocus);
      clearInterval(refreshInterval);
    };
  }, []);

  function handleManualRefresh() {
    const authUser = JSON.parse(localStorage.getItem('gms-auth') || '{}')?.state?.user;
    if (!authUser?.id) return;
    setRefreshing(true);
    fetchFromServer(authUser.id)
      .catch(() => {})
      .finally(() => setRefreshing(false));
  }

  const filtered = grievances
    .filter(g => {
      if (filter === 'all') return true;
      if (filter === 'active') return ACTIVE_STATUSES.includes(g.status);
      return g.status === filter;
    })
    .filter(g => search === '' || g.title.toLowerCase().includes(search.toLowerCase()) || g.token.toLowerCase().includes(search.toLowerCase()) || g.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'submittedDate') return dir * (new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime());
      if (sortKey === 'priority') {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return dir * (order[a.priority as keyof typeof order] - order[b.priority as keyof typeof order]);
      }
      return dir * String(a[sortKey]).localeCompare(String(b[sortKey]));
    });

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const ACTIVE_STATUSES = ['pending', 'in_progress', 'acknowledged', 'under_review', 'document_requested'];

  const counts = {
    all: grievances.length,
    active: grievances.filter(g => ACTIVE_STATUSES.includes(g.status)).length,
    escalated: grievances.filter(g => g.status === 'escalated').length,
    resolved: grievances.filter(g => g.status === 'resolved').length,
  };

  const actionRequired = grievances.filter(g => g.status === 'document_requested').length;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-bold text-[#0E1C2F]">My Grievances</h1>
          <p className="text-[12px] text-[#7A8FA6]">{grievances.length} total grievances</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleManualRefresh} disabled={refreshing} className="inline-flex items-center gap-2 bg-[#F0F2F7] hover:bg-[#DDE3EE] text-[#3D5068] rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors disabled:opacity-50">
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
          <Link href="/citizen/submit" className="inline-flex items-center gap-2 bg-[#F4811F] hover:bg-[#E0721A] text-white rounded-lg px-4 py-2 text-[12px] font-semibold transition-colors">
            <Plus size={14} /> File New
          </Link>
        </div>
      </div>

      {/* Action Required Alert */}
      {actionRequired > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-[14px] px-4 py-3 flex items-center gap-3">
          <span className="text-[22px] flex-shrink-0">📎</span>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-amber-900">
              {actionRequired === 1 ? '1 grievance needs your attention' : `${actionRequired} grievances need your attention`}
            </p>
            <p className="text-[11px] text-amber-700">An officer has requested additional documents. Click "View" to attach and resubmit.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#F0F2F7] rounded-lg px-3 py-2 flex-1 min-w-[200px]">
            <Search size={13} className="text-[#7A8FA6]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by token, title, category..." className="bg-transparent border-none outline-none text-[12px] w-full text-[#0E1C2F] placeholder:text-[#7A8FA6]" />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'active', 'escalated', 'resolved'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-[#F0F2F7] text-[#3D5068] hover:bg-[#DDE3EE]'}`}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#DDE3EE]">
                {([
                  ['token', 'Grievance ID'],
                  ['category', 'Category'],
                  ['status', 'Status'],
                  ['priority', 'Priority'],
                  ['submittedDate', 'Filed On'],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} onClick={() => handleSort(key)} className="px-4 py-3 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide cursor-pointer hover:text-[#3D5068] select-none">
                    <div className="flex items-center gap-1">
                      {label}
                      <ArrowUpDown size={10} className={sortKey === key ? 'text-blue-600' : 'text-gray-300'} />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide">Officer</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => {
                const sc = STATUS_CONFIG[g.status] || STATUS_CONFIG.pending;
                const pc = PRIORITY_CONFIG[g.priority] || PRIORITY_CONFIG.medium;
                const slaColor = g.slaDaysLeft < 0 ? '#DC2626' : g.slaDaysLeft <= 2 ? '#D97706' : '#16A34A';
                return (
                  <Link key={g.id} href={`/citizen/grievances/${g.id}`} className="group">
                    <tr className={`border-b border-[#F0F2F7] last:border-0 hover:bg-[#F8F9FB] transition-colors cursor-pointer ${g.status === 'document_requested' ? 'bg-amber-50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-semibold text-[#0E1C2F]">{g.title}</p>
                        <p className="text-[10px] text-[#7A8FA6] font-mono">{g.token}</p>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[#3D5068]">{g.category}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ color: sc.color, background: sc.bg }}>{sc.label}</span>
                        {g.slaDaysLeft < 0 && <span className="ml-1.5 text-[9px] font-bold text-red-500">BREACHED</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ color: pc.color, background: pc.color + '18', textTransform: 'uppercase' }}>{pc.label}</span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[#7A8FA6]">{new Date(g.submittedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                      <td className="px-4 py-3 text-[11px] text-[#3D5068]">{g.officer === 'Unassigned' ? <span className="text-[#7A8FA6] italic">Pending</span> : g.officer}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[11px] text-blue-600 font-semibold group-hover:underline">View</span>
                      </td>
                    </tr>
                  </Link>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-[12px] text-[#7A8FA6]">No grievances found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
