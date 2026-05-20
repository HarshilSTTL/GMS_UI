'use client';
import React from 'react';
import Link from 'next/link';
import { KPICard } from '@/components/gms/KPICard';
import { KPIData } from '@/types';

const KPI: KPIData[] = [
  { label: 'Total Open Complaints', value: '2,847', trend: '▲ 124 from yesterday', trendType: 'down', accentColor: '#E24B4A', href: '/secretary/district' },
  { label: 'Resolved Today', value: '341', trend: '▲ 18% vs last week', trendType: 'up', accentColor: '#639922' },
  { label: 'SLA Adherence', value: '81%', trend: '▼ 4% vs target (85%)', trendType: 'warn', accentColor: '#BA7517' },
  { label: 'Critical Pending', value: '47', trend: '▲ 9 from yesterday', trendType: 'down', accentColor: '#E24B4A', href: '/secretary/escalation' },
  { label: 'CSAT Score', value: '3.8', trend: 'Target: 4.0 / 5', trendType: 'neutral', accentColor: '#BA7517' },
  { label: 'Auto-classified', value: '92%', trend: '▲ 2% vs last month', trendType: 'up', accentColor: '#639922' },
  { label: 'Escalations (L2+)', value: '183', trend: '▲ 12 this week', trendType: 'down', accentColor: '#E24B4A', href: '/secretary/escalation' },
  { label: 'Avg Resolution (days)', value: '8.4', trend: 'Target: <SLA avg', trendType: 'neutral', accentColor: '#185FA5' },
];

const CATEGORIES = [
  { name: 'Maternal & Child Health', count: 624, pct: 78, color: '#1D9E75', bg: '#9FE1CB' },
  { name: 'Primary Health Care', count: 511, pct: 64, color: '#378ADD', bg: '#B5D4F4' },
  { name: 'Hospital Services', count: 487, pct: 61, color: '#E24B4A', bg: '#F7C1C1' },
  { name: 'Ayushman / PMJAY', count: 398, pct: 50, color: '#EF9F27', bg: '#FAC775' },
  { name: 'Disease Control', count: 312, pct: 39, color: '#639922', bg: '#C0DD97' },
  { name: 'Mental Health', count: 187, pct: 23, color: '#7F77DD', bg: '#CECBF6' },
  { name: 'Food Safety & Drugs', count: 183, pct: 23, color: '#D85A30', bg: '#F5C4B3' },
  { name: 'HR & Education', count: 145, pct: 18, color: '#888780', bg: '#D3D1C7' },
];

const PRIORITY_DONUT = [
  { label: 'Critical', pct: 6, color: '#E24B4A' },
  { label: 'High', pct: 38, color: '#BA7517' },
  { label: 'Medium', pct: 41, color: '#185FA5' },
  { label: 'Low', pct: 15, color: '#888780' },
];

const ALERTS = [
  { type: 'critical', icon: '⚠', title: 'Surendranagar:', text: 'Dengue cluster — 23 cases in 3 villages. SLA breach imminent.', meta: 'Escalated 2h ago  •  HFWD-CDC-001  •  L3' },
  { type: 'critical', icon: '⚠', title: 'Rajkot Civil Hospital:', text: 'Blood bank stock at critical level — 2 units remaining.', meta: 'Escalated 4h ago  •  HFWD-HSP-005  •  L3' },
  { type: 'warning', icon: '◆', title: 'Banaskantha District:', text: '12 JSY incentive payments pending >30 days — 12 beneficiaries.', meta: 'Escalated 1d ago  •  HFWD-MCH-001  •  L2' },
  { type: 'warning', icon: '◆', title: 'Surat CDHO:', text: 'SLA adherence at 61% — lowest in state this month.', meta: 'System flag  •  KPI-02  •  Needs intervention' },
  { type: 'resolved', icon: '✓', title: 'Gandhinagar:', text: 'Blood supply shortage resolved. 50 units received from GMSC.', meta: 'Resolved 30min ago  •  HFWD-HSP-005' },
];

const CHANNELS = [
  { icon: '📞', bg: '#E6F1FB', fg: '#185FA5', name: 'CM Helpline 1100', vol: 487, pct: '34%' },
  { icon: '🌐', bg: '#EAF3DE', fg: '#3b6d11', name: 'Swagat Online', vol: 312, pct: '22%' },
  { icon: '💬', bg: '#EAF3DE', fg: '#3b6d11', name: 'WhatsApp Bot', vol: 278, pct: '19%' },
  { icon: '📱', bg: '#EEEDFE', fg: '#534AB7', name: 'Mobile App', vol: 198, pct: '14%' },
  { icon: '🏛', bg: '#FAECE7', fg: '#993C1D', name: 'Walk-in / Physical', vol: 98, pct: '7%' },
  { icon: '✉', bg: '#F1EFE8', fg: '#5F5E5A', name: 'Email / RTPS', vol: 54, pct: '4%' },
];

function DonutChart() {
  let cumPct = 0;
  const stops = PRIORITY_DONUT.map(d => {
    const start = cumPct;
    const end = cumPct + d.pct;
    cumPct = end;
    return `${d.color} ${start}% ${end}%`;
  });
  return (
    <div className="relative flex items-center justify-center mx-auto" style={{ width: 140, height: 140 }}>
      <div className="rounded-full" style={{ width: 140, height: 140, background: `conic-gradient(${stops.join(', ')})` }} />
      <div className="absolute rounded-full bg-white flex flex-col items-center justify-center" style={{ width: 72, height: 72 }}>
        <span className="text-[11px] font-bold text-[#0E1C2F]">2,847</span>
        <span className="text-[9px] text-[#7A8FA6]">Open</span>
      </div>
    </div>
  );
}

const alertBg: Record<string, string> = { critical: '#FCEBEB', warning: '#FAEEDA', resolved: '#EAF3DE' };

export default function SecretaryOverviewPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">Health Secretary Command Dashboard</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">
          Health &amp; Family Welfare Dept — Gujarat Government &nbsp;|&nbsp; GMS Grievance Intelligence
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
        <span className="text-[11px] text-[#7A8FA6]">
          {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      </div>

      <p className="text-[10px] font-semibold text-[#7A8FA6] uppercase tracking-widest mb-3">
        Real-time grievance pulse
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {KPI.map((k, i) => <KPICard key={i} data={k} />)}
      </div>

      {/* Priority distribution + Category breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE] flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Priority Distribution</h2>
            <Link href="/secretary/sop" className="text-[11px] text-blue-600 font-medium hover:underline">View by SOP →</Link>
          </div>
          <div className="p-4">
            <DonutChart />
            <div className="grid grid-cols-2 gap-2 mt-4">
              {PRIORITY_DONUT.map(d => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-[11px] text-[#3D5068] flex-1">{d.label}</span>
                  <span className="text-[11px] font-semibold text-[#0E1C2F]">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE] flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Category Breakdown</h2>
            <Link href="/secretary/sop" className="text-[11px] text-blue-600 font-medium hover:underline">Detail view →</Link>
          </div>
          <div className="divide-y divide-[#F0F2F7]">
            {CATEGORIES.map(c => (
              <div key={c.name} className="flex items-center gap-3 px-4 py-2.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.bg }} />
                <span className="text-[12px] text-[#0E1C2F] flex-1">{c.name}</span>
                <span className="text-[13px] font-semibold text-[#0E1C2F] min-w-[36px] text-right">{c.count}</span>
                <div className="w-20 bg-[#F0F2F7] rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Channel intake */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Active Alerts Requiring Secretary Attention</h2>
          </div>
          <div className="p-4 space-y-2">
            {ALERTS.map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-[10px] px-3 py-2.5 text-[12px]" style={{ background: alertBg[a.type] }}>
                <span className="text-[14px] flex-shrink-0 mt-0.5">{a.icon}</span>
                <div>
                  <div className="text-[#0E1C2F] leading-snug">
                    <strong>{a.title}</strong> {a.text}
                  </div>
                  <div className="text-[10px] text-[#7A8FA6] mt-1">{a.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Channel Intake Today</h2>
          </div>
          <div className="divide-y divide-[#F0F2F7]">
            {CHANNELS.map(c => (
              <div key={c.name} className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] flex-shrink-0" style={{ background: c.bg, color: c.fg }}>
                  {c.icon}
                </div>
                <span className="text-[12px] text-[#0E1C2F] flex-1">{c.name}</span>
                <span className="text-[13px] font-semibold text-[#0E1C2F]">{c.vol}</span>
                <span className="text-[10px] text-[#7A8FA6] min-w-[32px] text-right">{c.pct}</span>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4 pt-2">
            <div className="flex items-end gap-1.5 h-16">
              {CHANNELS.map(c => {
                const heightPct = Math.round((c.vol / 487) * 100);
                return (
                  <div key={c.name} className="flex-1 flex flex-col items-center justify-end gap-1">
                    <div className="w-full rounded-t" style={{ height: `${heightPct}%`, minHeight: 4, background: c.fg }} />
                    <span className="text-[8px] text-[#7A8FA6] truncate w-full text-center">{c.vol}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
