'use client';
import React, { useState } from 'react';
import { BarChart2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useComplaints } from '@/hooks/useComplaints';

const PERIOD_OPTIONS = ['This Week', 'This Month', 'Last 3 Months', 'This Year'] as const;
type Period = typeof PERIOD_OPTIONS[number];

export default function ReportsPage() {
  const { data: complaints = [], isLoading } = useComplaints();
  const [period, setPeriod] = useState<Period>('This Month');

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const breached = complaints.filter(c => c.slaStatus === 'breach').length;
  const escalated = complaints.filter(c => c.status === 'escalated').length;
  const open = complaints.filter(c => c.status === 'open').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;
  const onTimeRate = total > 0 ? Math.round(((total - breached) / total) * 100) : 0;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Department breakdown
  const deptBreakdown = complaints.reduce<Record<string, { total: number; resolved: number; breached: number }>>((acc, c) => {
    if (!acc[c.department]) acc[c.department] = { total: 0, resolved: 0, breached: 0 };
    acc[c.department].total++;
    if (c.status === 'resolved') acc[c.department].resolved++;
    if (c.slaStatus === 'breach') acc[c.department].breached++;
    return acc;
  }, {});
  const deptRows = Object.entries(deptBreakdown).sort((a, b) => b[1].total - a[1].total);
  const maxDeptTotal = Math.max(...Object.values(deptBreakdown).map(d => d.total));

  // Channel breakdown
  const channelBreakdown = complaints.reduce<Record<string, number>>((acc, c) => {
    acc[c.channel] = (acc[c.channel] ?? 0) + 1;
    return acc;
  }, {});
  const channelRows = Object.entries(channelBreakdown).sort((a, b) => b[1] - a[1]);

  // Priority breakdown
  const priorityBreakdown = complaints.reduce<Record<string, number>>((acc, c) => {
    acc[c.priority] = (acc[c.priority] ?? 0) + 1;
    return acc;
  }, {});

  const PRIORITY_COLORS: Record<string, string> = {
    critical: '#DC2626', high: '#D97706', medium: '#1A56C4', low: '#16A34A',
  };
  const CHANNEL_LABELS: Record<string, string> = {
    web: '🌐 Web Portal', mobile: '📱 Mobile App', whatsapp: '💬 WhatsApp', call: '📞 Helpline', email: '📧 Email', walk_in: '🏢 Walk-in',
  };

  // Simulated monthly trend
  const MONTHLY = [
    { month: 'Jan', filed: 8, resolved: 6 },
    { month: 'Feb', filed: 11, resolved: 9 },
    { month: 'Mar', filed: 9, resolved: 10 },
    { month: 'Apr', filed: 14, resolved: 11 },
    { month: 'May', filed: 12, resolved: 9 },
  ];
  const maxMonthly = Math.max(...MONTHLY.map(m => Math.max(m.filed, m.resolved)));

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-[13px] text-[#7A8FA6]">Loading reports…</div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <BarChart2 size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0E1C2F]">SLA Reports</h1>
            <p className="text-[12px] text-[#7A8FA6]">Performance analytics for your department</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-[#F0F4FA] rounded-lg p-0.5">
            {PERIOD_OPTIONS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-all ${period === p ? 'bg-white text-[#0E1C2F] shadow-sm' : 'text-[#7A8FA6]'}`}>
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => toast.success('📥 Report exported as PDF.')}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={13} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Complaints', value: total, color: '#1A56C4', sub: `${open} open · ${inProgress} in progress` },
          { label: 'SLA On-time Rate', value: `${onTimeRate}%`, color: onTimeRate >= 85 ? '#16A34A' : onTimeRate >= 70 ? '#D97706' : '#DC2626', sub: `${breached} breached` },
          { label: 'Resolution Rate', value: `${resolutionRate}%`, color: '#16A34A', sub: `${resolved} resolved` },
          { label: 'Escalated', value: escalated, color: '#7C3AED', sub: 'Require attention' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3.5 relative overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]" style={{ background: k.color }} />
            <p className="text-[10px] font-semibold text-[#7A8FA6] uppercase tracking-wide mb-1">{k.label}</p>
            <p className="text-[28px] font-bold text-[#0E1C2F]">{k.value}</p>
            <p className="text-[10px] text-[#7A8FA6] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Monthly trend chart */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Monthly Volume</h2>
            <div className="flex gap-3 text-[10px] text-[#7A8FA6]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-400 inline-block" />Filed</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-400 inline-block" />Resolved</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-28">
            {MONTHLY.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end justify-center" style={{ height: '88px' }}>
                  <div className="w-[44%] rounded-t" style={{ height: `${(m.filed / maxMonthly) * 88}px`, background: '#93C5FD' }} title={`Filed: ${m.filed}`} />
                  <div className="w-[44%] rounded-t" style={{ height: `${(m.resolved / maxMonthly) * 88}px`, background: '#86EFAC' }} title={`Resolved: ${m.resolved}`} />
                </div>
                <span className="text-[9px] text-[#7A8FA6]">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority distribution */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F] mb-4">Priority Distribution</h2>
          <div className="space-y-3">
            {(['critical', 'high', 'medium', 'low'] as const).map(p => {
              const count = priorityBreakdown[p] ?? 0;
              const pct = Math.round((count / total) * 100);
              const color = PRIORITY_COLORS[p];
              return (
                <div key={p}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold capitalize text-[#3D5068]">{p}</span>
                    <span className="text-[12px] font-bold text-[#0E1C2F]">{count} <span className="text-[10px] font-normal text-[#7A8FA6]">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Department breakdown table */}
        <div className="lg:col-span-2 bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Department Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border-collapse">
              <thead className="bg-[#F8FAFD]">
                <tr>
                  {['Department', 'Total', 'Resolved', 'Breached', 'SLA Bar'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deptRows.map(([dept, data], i) => {
                  const slaRate = Math.round(((data.total - data.breached) / data.total) * 100);
                  const slaColor = slaRate >= 85 ? '#16A34A' : slaRate >= 70 ? '#D97706' : '#DC2626';
                  return (
                    <tr key={dept} className={i !== deptRows.length - 1 ? 'border-b border-[#DDE3EE]' : ''}>
                      <td className="px-4 py-2.5 font-medium text-[#0E1C2F] max-w-[140px] truncate">{dept}</td>
                      <td className="px-4 py-2.5 font-bold text-[#0E1C2F]">{data.total}</td>
                      <td className="px-4 py-2.5 text-green-600 font-semibold">{data.resolved}</td>
                      <td className="px-4 py-2.5 text-red-600 font-semibold">{data.breached}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${slaRate}%`, background: slaColor }} />
                          </div>
                          <span className="text-[10px] font-bold" style={{ color: slaColor }}>{slaRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Channel breakdown */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F] mb-4">Complaints by Channel</h2>
          <div className="space-y-3">
            {channelRows.map(([ch, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={ch}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[#3D5068]">{CHANNEL_LABELS[ch] ?? ch}</span>
                    <span className="text-[11px] font-bold text-[#0E1C2F]">{count} <span className="font-normal text-[#7A8FA6]">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status donut simulation */}
          <div className="mt-5 pt-4 border-t border-[#DDE3EE]">
            <p className="text-[11px] font-bold text-[#0E1C2F] mb-3">Status Overview</p>
            <div className="space-y-2">
              {[
                { label: 'Open', count: open, color: '#DC2626' },
                { label: 'In Progress', count: inProgress, color: '#D97706' },
                { label: 'Escalated', count: escalated, color: '#7C3AED' },
                { label: 'Resolved', count: resolved, color: '#16A34A' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-[#3D5068]">{s.label}</span>
                  </div>
                  <span className="font-bold text-[#0E1C2F]">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
