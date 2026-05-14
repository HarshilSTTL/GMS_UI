'use client';
import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, Plus, Search, ArrowRight, Zap, BarChart2, Bot } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores';
import { mergeWithSession } from '@/lib/session-grievances';

interface Grievance {
  id: string; token: string; title: string; category: string; status: string;
  priority: string; channel: string; slaStatus: string; slaDaysLeft: number;
  location: string; officer: string; submittedDate: string; updatedAt: string;
  citizenId?: string;
}

interface Notification {
  id: string; title: string; message: string; timestamp: string; isRead: boolean; type: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FFFBEB' },
  open: { label: 'Pending', color: '#D97706', bg: '#FFFBEB' },
  in_progress: { label: 'In Progress', color: '#1A56C4', bg: '#EBF2FF' },
  resolved: { label: 'Resolved', color: '#16A34A', bg: '#F0FDF4' },
  escalated: { label: 'Escalated', color: '#DC2626', bg: '#FEF2F2' },
  acknowledged: { label: 'Acknowledged', color: '#0891B2', bg: '#ECFEFF' },
  under_review: { label: 'Under Review', color: '#7C3AED', bg: '#F5F3FF' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  critical: { label: 'CRITICAL', color: '#DC2626' },
  high: { label: 'HIGH', color: '#D97706' },
  medium: { label: 'MEDIUM', color: '#1A56C4' },
  low: { label: 'LOW', color: '#16A34A' },
};

export default function CitizenDashboard() {
  const { user } = useAuthStore();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const citizenId = user.id;
    Promise.all([
      fetch(`/api/citizen/grievances?citizenId=${citizenId}`).then(r => r.json()),
      fetch(`/api/citizen/notifications?citizenId=${citizenId}`).then(r => r.json()),
    ]).then(([g, n]) => {
      const fromServer = Array.isArray(g) ? g.map((item: any) => ({
        ...item,
        submittedDate: item.createdAt || item.submittedDate,
        officer: item.assignedTo?.name || item.officer || 'Unassigned',
        status: item.status === 'open' ? 'pending' : item.status,
      })) : [];
      setGrievances(mergeWithSession(fromServer, citizenId));
      setNotifications(Array.isArray(n) ? n : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const total = grievances.length;
  const active = grievances.filter(g => ['pending', 'open', 'in_progress', 'acknowledged', 'under_review'].includes(g.status)).length;
  const resolved = grievances.filter(g => g.status === 'resolved').length;
  const escalated = grievances.filter(g => g.status === 'escalated').length;
  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const recent = [...grievances]
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
    .slice(0, 4);

  const stats = [
    { label: 'Total Filed', value: total, icon: FileText, accent: '#1A56C4', bg: '#EBF2FF', href: '/citizen/grievances' },
    { label: 'Active', value: active, icon: Clock, accent: '#D97706', bg: '#FFFBEB', href: '/citizen/grievances?filter=active' },
    { label: 'Resolved', value: resolved, icon: CheckCircle, accent: '#16A34A', bg: '#F0FDF4', href: '/citizen/grievances?filter=resolved' },
    { label: 'Escalated', value: escalated, icon: AlertTriangle, accent: '#DC2626', bg: '#FEF2F2', href: '/citizen/grievances?filter=escalated' },
  ];

  const displayName = user?.name?.split(' ')[0] || 'Citizen';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="rounded-[14px] p-5 text-white" style={{ background: 'linear-gradient(135deg, #0F1A2E, #1A3260)' }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[18px] font-bold mb-1">Welcome back, {displayName}</h1>
            <p className="text-[12px] text-blue-200">
              You have <span className="font-bold text-yellow-300">{active} active</span> and{' '}
              <span className="font-bold text-green-300">{unreadNotifs} new</span> notifications.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">🏛</div>
        </div>
        <div className="flex gap-2 mt-4">
          <Link href="/citizen/submit" className="inline-flex items-center gap-2 bg-[#F4811F] hover:bg-[#E0721A] text-white rounded-lg px-4 py-2 text-[12px] font-semibold transition-colors">
            <Plus size={14} /> File New Grievance
          </Link>
          <Link href="/citizen/track" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 text-[12px] font-semibold transition-colors">
            <Search size={14} /> Track Grievance
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="group bg-white rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)] hover:shadow-[0_4px_16px_rgba(14,28,47,0.14)] transition-all block">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={18} style={{ color: s.accent }} />
              </div>
              <ArrowRight size={13} className="text-[#C8D0DE] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-[22px] font-bold text-[#0E1C2F]">{s.value}</div>
            <div className="text-[11px] text-[#7A8FA6] mt-0.5">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Grievances */}
        <div className="lg:col-span-2 bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold text-[#0E1C2F]">Recent Grievances</h2>
            <Link href="/citizen/grievances" className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 hover:underline">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recent.map(g => {
              const sc = STATUS_CONFIG[g.status] || STATUS_CONFIG.pending;
              const pc = PRIORITY_CONFIG[g.priority] || PRIORITY_CONFIG.medium;
              return (
                <Link key={g.id} href={`/citizen/grievances/${g.id}`} className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-[#F0F2F7] transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F2F7] flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-[#7A8FA6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#0E1C2F] truncate group-hover:text-blue-600 transition-colors">{g.title}</p>
                    <p className="text-[10px] text-[#7A8FA6] font-mono">{g.token} &middot; {g.category}</p>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ color: pc.color, background: pc.color + '18' }}>{pc.label}</span>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ color: sc.color, background: sc.bg }}>{sc.label}</span>
                </Link>
              );
            })}
            {recent.length === 0 && (
              <div className="text-center py-8 text-[12px] text-[#7A8FA6]">No grievances filed yet</div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
            <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/citizen/submit" className="flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-[#F0F2F7] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center"><Plus size={14} className="text-[#F4811F]" /></div>
                <span className="text-[12px] font-semibold text-[#0E1C2F]">Submit Grievance</span>
              </Link>
              <Link href="/citizen/track" className="flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-[#F0F2F7] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Search size={14} className="text-blue-600" /></div>
                <span className="text-[12px] font-semibold text-[#0E1C2F]">Track Status</span>
              </Link>
              <Link href="/citizen/schemes" className="flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-[#F0F2F7] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"><BarChart2 size={14} className="text-green-600" /></div>
                <span className="text-[12px] font-semibold text-[#0E1C2F]">Schemes & Services</span>
              </Link>
              <Link href="/citizen/help" className="flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-[#F0F2F7] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><Zap size={14} className="text-purple-600" /></div>
                <span className="text-[12px] font-semibold text-[#0E1C2F]">Need Help?</span>
              </Link>
            </div>
          </div>

          {/* AI Features */}
          <div className="rounded-[14px] p-4" style={{ background: 'linear-gradient(135deg, #EDE9FE, #FFF3E8)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Bot size={16} className="text-purple-600" />
              <span className="text-[12px] font-bold text-[#0E1C2F]">AI-Powered Features</span>
            </div>
            <div className="space-y-2 text-[11px] text-[#3D5068]">
              <div className="flex items-center gap-2"><Zap size={12} className="text-[#F4811F]" /> Smart De-duplication</div>
              <div className="flex items-center gap-2"><BarChart2 size={12} className="text-[#F4811F]" /> Cluster Detection</div>
              <div className="flex items-center gap-2"><Bot size={12} className="text-[#F4811F]" /> AI Writing Help</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
