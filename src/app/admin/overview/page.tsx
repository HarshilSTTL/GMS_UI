'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  Shield, Users, Building2, Clock, TrendingUp, Bot, Download, Plus,
  AlertTriangle, BarChart3, Zap, Bell,
  ScrollText, Settings, Workflow, ClipboardList,
} from 'lucide-react';
import { useAuthStore } from '@/stores';
import { useUsers } from '@/hooks/useUsers';
import { useComplaints } from '@/hooks/useComplaints';
import { toast } from 'sonner';

/* ─── Trends data ─── */
const TRENDS = [
  { day: 'Mon', filed: 34, resolved: 28 },
  { day: 'Tue', filed: 41, resolved: 35 },
  { day: 'Wed', filed: 29, resolved: 31 },
  { day: 'Thu', filed: 52, resolved: 38 },
  { day: 'Fri', filed: 47, resolved: 42 },
  { day: 'Sat', filed: 18, resolved: 15 },
  { day: 'Sun', filed: 8, resolved: 7 },
];
const maxTrend = Math.max(...TRENDS.flatMap(t => [t.filed, t.resolved]));

/* ─── Alerts data ─── */
const ALERTS = [
  { id: 'a1', title: 'SLA Breach Surge', detail: '12 complaints breached SLA in the last 24 hours across 3 departments.', severity: 'CRITICAL' },
  { id: 'a2', title: 'High Priority Queue', detail: '5 critical-priority complaints remain unassigned for over 4 hours.', severity: 'HIGH' },
  { id: 'a3', title: 'User Login Anomaly', detail: '3 failed login attempts detected from IP 192.168.1.100.', severity: 'HIGH' },
  { id: 'a4', title: 'Disk Space Warning', detail: 'Server storage at 85%. Consider cleanup or upgrade.', severity: 'MEDIUM' },
];

const SEVERITY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  CRITICAL: { bg: '#FEF2F2', text: '#991B1B', dot: '#DC2626' },
  HIGH: { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' },
  MEDIUM: { bg: '#F0F9FF', text: '#075985', dot: '#0EA5E9' },
  LOW: { bg: '#F9FAFB', text: '#374151', dot: '#6B7280' },
};

/* ─── Quick links ─── */
const QUICK_LINKS = [
  { id: 'sla', icon: Clock, label: 'New SLA Rule', sub: '25 active', path: '/admin/sla' },
  { id: 'users', icon: Users, label: 'Add User', sub: '50 total', path: '/admin/users' },
  { id: 'workflow', icon: Workflow, label: 'Edit Workflow', sub: '9 states', path: '/admin/workflow' },
  { id: 'notif', icon: Bell, label: 'Templates', sub: '8 configured', path: '/admin/notifications' },
  { id: 'ai', icon: Zap, label: 'AI Settings', sub: '6 features', path: '/admin/ai-config' },
  { id: 'audit', icon: ScrollText, label: 'Audit Trail', sub: '30 events', path: '/admin/audit' },
];

/* ─── AI Insights ─── */
const AI_INSIGHTS = [
  { title: 'Rule conflict detected', desc: 'SLA-002 and SLA-020 may overlap for senior citizens with hospital cleanliness complaints. Review priority order.', action: 'Review' },
  { title: 'Unused configuration', desc: "NT-007 (SLA Breach internal) hasn't fired in 30 days. Confirm trigger logic.", action: 'Inspect' },
  { title: 'Hierarchy gap', desc: '12 officers in HFWD have no reporting manager assigned. Recommend back-filling.', action: 'Fix' },
];

/* ══════════════════════════════════════════════════════ */
export default function AdminOverviewPage() {
  const { user } = useAuthStore();
  const { data: users = [] } = useUsers();
  const { data: complaints = [] } = useComplaints();

  // Derived KPIs from real data
  const kpiData = useMemo(() => {
    const activeUsers = users.filter(u => u.status === 'active').length;
    const uniqueDepts = [...new Set(users.map(u => u.dept).filter(Boolean))];
    const openComplaints = complaints.filter(c => c.status === 'open' || c.status === 'acknowledged' || c.status === 'in_progress' || c.status === 'under_review').length;
    const breachedComplaints = complaints.filter(c => c.slaStatus === 'breach').length;
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
    const totalComplaints = complaints.length;
    const complianceRate = totalComplaints > 0 ? Math.round(((totalComplaints - breachedComplaints) / totalComplaints) * 100) : 100;

    return [
      { label: 'Total Users', value: users.length, sub: `${activeUsers} active`, icon: Users, color: '#0EA5E9', path: '/admin/users' },
      { label: 'Departments', value: uniqueDepts.length, sub: `${uniqueDepts.join(', ')}`, icon: Building2, color: '#7C3AED', path: '/admin/departments' },
      { label: 'Open Complaints', value: openComplaints, sub: `${breachedComplaints} breached`, icon: ClipboardList, color: '#16A34A', path: '/admin/reports' },
      { label: 'SLA Compliance', value: `${complianceRate}%`, sub: `${resolvedComplaints} resolved`, icon: TrendingUp, color: '#F59E0B', path: '/admin/reports' },
      { label: 'AI Calls Today', value: '1.2k', sub: '$47.20 spend', icon: Bot, color: '#DC2626', path: '/admin/ai-config' },
    ];
  }, [users, complaints]);

  return (
    <div>
      {/* Page header */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Shield size={20} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0E1C2F]">Admin Dashboard</h1>
            <p className="text-[12px] text-[#7A8FA6]">Welcome back, {user?.name?.replace(/^(Smt\.|Shri|Dr\.) /, '')} · IGMS v3.0</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.info('Report exported')} className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] bg-white text-[#0E1C2F] hover:bg-[#F8FAFD] transition-all">
            <Download size={12} /> Export Report
          </button>
          <button onClick={() => toast.info('Quick setup started')} className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            <Plus size={12} /> Quick Setup
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {kpiData.map((k, i) => (
          <Link key={i} href={k.path} className="bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3.5 relative overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)] hover:shadow-[0_2px_8px_rgba(14,28,47,0.1)] transition-shadow">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]" style={{ background: k.color }} />
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#F8FAFD] flex items-center justify-center text-[#7A8FA6]">
                <k.icon size={18} />
              </div>
              <div className="text-[11px] font-medium text-[#7A8FA6]">{k.label}</div>
            </div>
            <div className="text-[26px] font-bold text-[#0E1C2F] leading-none">{k.value}</div>
            <div className="text-[10.5px] text-[#7A8FA6] mt-1.5">{k.sub}</div>
          </Link>
        ))}
      </div>

      {/* Trends + AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 mb-5">
        {/* Complaint Trends */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] px-5 py-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[14px] font-bold text-[#0E1C2F]">Complaint Trends</h2>
              <p className="text-[11px] text-[#7A8FA6] mt-0.5">Filed vs Resolved · Last 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#7A8FA6]">
              <span className="flex items-center gap-1.5"><span className="w-[9px] h-[9px] rounded-sm bg-[#0EA5E9] inline-block" /> Filed</span>
              <span className="flex items-center gap-1.5"><span className="w-[9px] h-[9px] rounded-sm bg-[#16A34A] inline-block" /> Resolved</span>
            </div>
          </div>
          <div className="flex items-end h-[180px] gap-[18px] px-1.5">
            {TRENDS.map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="flex items-end gap-1 h-[150px]">
                  <div className="w-4 rounded-t-sm bg-[#0EA5E9]" style={{ height: (t.filed / maxTrend) * 150 }} title={`${t.filed} filed`} />
                  <div className="w-4 rounded-t-sm bg-[#16A34A]" style={{ height: (t.resolved / maxTrend) * 150 }} title={`${t.resolved} resolved`} />
                </div>
                <span className="text-[10.5px] text-[#7A8FA6] font-medium">{t.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-[#FAF5FF] to-white border border-[#E9D5FF] rounded-[14px] px-5 py-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#DB2777] text-white flex items-center justify-center">
              <Zap size={14} />
            </div>
            <h3 className="text-[13px] font-bold text-[#0E1C2F]">AI Audit Insights</h3>
            <span className="ml-auto text-[9.5px] text-purple-600 font-bold">WEEKLY</span>
          </div>
          <div className="space-y-2.5">
            {AI_INSIGHTS.map((x, i) => (
              <div key={i} className="bg-white border border-[#E9D5FF] rounded-lg px-3.5 py-3">
                <p className="text-[12px] font-semibold text-[#0E1C2F] mb-1">{x.title}</p>
                <p className="text-[11px] text-[#7A8FA6] leading-relaxed">{x.desc}</p>
                <button onClick={() => toast.info(`Opening ${x.title}`)} className="mt-1.5 text-[10.5px] text-purple-600 font-bold bg-transparent border-none cursor-pointer p-0 hover:underline">
                  {x.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Alerts */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] px-5 py-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="flex items-center mb-3">
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-amber-500" />
              <h2 className="text-[14px] font-bold text-[#0E1C2F]">System Alerts</h2>
            </div>
            <span className="ml-2 px-1.5 py-px bg-red-600 text-white text-[10px] font-bold rounded-full">{ALERTS.length}</span>
            <button className="ml-auto text-[11px] text-[#1A3260] font-semibold bg-transparent border-none cursor-pointer hover:underline">
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {ALERTS.map(a => {
              const sc = SEVERITY_COLORS[a.severity];
              return (
                <div key={a.id} className="p-2.5 rounded-lg border border-[#E5E7EB] border-l-[3px] flex gap-2.5" style={{ borderLeftColor: sc.dot }}>
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: sc.dot }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-[12px] font-semibold text-[#0E1C2F]">{a.title}</p>
                      <span className="text-[9px] font-bold px-1.5 py-px rounded-full" style={{ background: sc.bg, color: sc.text }}>
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-[#7A8FA6] leading-relaxed">{a.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Configuration */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] px-5 py-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-3">Quick Configuration</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_LINKS.map(q => {
              const Icon = q.icon;
              return (
                <Link key={q.id} href={q.path}
                  className="p-3 rounded-[9px] border border-[#E5E7EB] bg-[#F9FAFB] text-left transition-all hover:bg-white hover:border-[#FF8C42] group">
                  <div className="mb-1.5 text-[#FF8C42] group-hover:scale-110 transition-transform inline-block"><Icon size={18} /></div>
                  <p className="text-[12px] font-semibold text-[#0E1C2F]">{q.label}</p>
                  <p className="text-[10px] text-[#7A8FA6] mt-0.5">{q.sub}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
