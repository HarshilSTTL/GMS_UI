'use client';
import React, { useRef, useEffect } from 'react';
import { KPICard } from '@/components/gms/KPICard';
import { KPIData } from '@/types';
import Link from 'next/link';

const CM_KPI: KPIData[] = [
  { label: 'Total Open', value: '18,492', trend: '▲ 847 from last week', trendType: 'down', accentColor: '#3A8FE8', href: '/cm/districts' },
  { label: 'Resolved This Month', value: '24,187', trend: '▲ 12% vs last month', trendType: 'up', accentColor: '#28C880', href: '/cm/departments' },
  { label: 'State SLA %', value: '78%', trend: 'Target 85% · Gap −7%', trendType: 'warn', accentColor: '#F0A030', href: '/cm/departments' },
  { label: 'Critical Open', value: '312', trend: '▲ 47 unresolved >3d', trendType: 'down', accentColor: '#E84040', href: '/cm/districts' },
  { label: 'State CSAT', value: '3.6', trend: 'Target 4.0 · 9 depts below', trendType: 'warn', accentColor: '#C9A84C', href: '/cm/overview' },
  { label: 'Auto-classify Rate', value: '91%', trend: '▲ 3% this quarter', trendType: 'up', accentColor: '#00B4B4', href: '/cm/trends' },
  { label: 'Districts CSAT <3.5', value: '11', trend: 'Needs CM directive', trendType: 'down', accentColor: '#E84040', href: '/cm/districts' },
  { label: 'L3 Escalations', value: '83', trend: '▲ 22 this week', trendType: 'down', accentColor: '#F0A030', href: '/cm/departments' },
];

const DEPTS = [
  { name: 'Health & Family Welfare', icon: '🏥', open: 2847, resolved: 3241, sla: 81, csat: 3.8, critical: 47, color: '#3A8FE8' },
  { name: 'Education Department',    icon: '📚', open: 2341, resolved: 2890, sla: 84, csat: 3.9, critical: 28, color: '#28C880' },
  { name: 'Revenue & Land Records',  icon: '🏡', open: 3120, resolved: 2780, sla: 72, csat: 3.4, critical: 62, color: '#F0A030' },
  { name: 'Roads & Buildings (PWD)', icon: '🛣', open: 1890, resolved: 2100, sla: 76, csat: 3.5, critical: 31, color: '#C9A84C' },
  { name: 'Water Supply & Sanitation',icon: '💧', open: 2210, resolved: 1980, sla: 69, csat: 3.2, critical: 54, color: '#00B4B4' },
  { name: 'Agriculture Department',  icon: '🌾', open: 1540, resolved: 1720, sla: 88, csat: 4.1, critical: 12, color: '#639922' },
  { name: 'Social Justice',          icon: '🤝', open: 1280, resolved: 1450, sla: 82, csat: 3.7, critical: 19, color: '#7F77DD' },
  { name: 'Labour & Employment',     icon: '⚙', open: 980,  resolved: 1120, sla: 86, csat: 4.0, critical: 8,  color: '#D85A30' },
  { name: 'Food & Civil Supplies',   icon: '🌽', open: 1420, resolved: 1380, sla: 74, csat: 3.3, critical: 38, color: '#E84040' },
  { name: 'Home / Police Dept',      icon: '🛡', open: 870,  resolved: 920,  sla: 89, csat: 3.6, critical: 21, color: '#888780' },
];

const CATS = [
  { l: 'Revenue',    v: 3120, c: '#F0A030' },
  { l: 'Health',     v: 2847, c: '#3A8FE8' },
  { l: 'Water',      v: 2210, c: '#00B4B4' },
  { l: 'Education',  v: 2341, c: '#28C880' },
  { l: 'Roads',      v: 1890, c: '#C9A84C' },
  { l: 'Food/PDS',   v: 1420, c: '#E84040' },
  { l: 'Agriculture',v: 1540, c: '#639922' },
  { l: 'Others',     v: 3124, c: '#7A8FA6' },
];
const TOTAL_CATS = CATS.reduce((s, c) => s + c.v, 0);

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
const TREND_TOTALS = [14200,14800,15400,15900,16200,16800,17200,17600,17900,18100,18300,18492];

const CRIT_DISTS = [
  { name: 'Dahod',         div: 'East',        csat: 2.9, sla: 54, crit: 18 },
  { name: 'Chhota Udaipur',div: 'East',        csat: 3.0, sla: 58, crit: 14 },
  { name: 'Dang',          div: 'South',       csat: 3.1, sla: 61, crit: 12 },
  { name: 'Mahisagar',     div: 'East',        csat: 3.1, sla: 63, crit: 10 },
  { name: 'Narmada',       div: 'South',       csat: 3.2, sla: 64, crit: 9  },
  { name: 'Surendranagar', div: 'Saurashtra',  csat: 3.2, sla: 65, crit: 22 },
  { name: 'Panchmahal',    div: 'East',        csat: 3.2, sla: 67, crit: 11 },
  { name: 'Banaskantha',   div: 'North',       csat: 3.3, sla: 68, crit: 19 },
];

function cc(v: number) { return v >= 4.0 ? '#16A34A' : v >= 3.5 ? '#D97706' : '#DC2626'; }
function sc(v: number) { return v >= 85 ? '#16A34A' : v >= 75 ? '#D97706' : '#DC2626'; }

// Simple SVG line chart
function LineChart({ data, color = '#C9A84C' }: { data: number[]; color?: string }) {
  const W = 400, H = 120, PAD = 8;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
    return `${x},${y}`;
  }).join(' ');
  const fillPts = `${PAD},${H - PAD} ${pts} ${W - PAD},${H - PAD}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="ovGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill="url(#ovGrad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {data.map((_, i) => {
        const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
        const y = H - PAD - ((_ - min) / (max - min)) * (H - PAD * 2);
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

// Donut chart via conic-gradient
function DonutChart() {
  let cumPct = 0;
  const stops = CATS.map(cat => {
    const pct = (cat.v / TOTAL_CATS) * 100;
    const start = cumPct, end = cumPct + pct;
    cumPct = end;
    return `${cat.c} ${start.toFixed(1)}% ${end.toFixed(1)}%`;
  });
  const gradient = `conic-gradient(${stops.join(', ')})`;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      <div className="rounded-full" style={{ width: 160, height: 160, background: gradient }} />
      <div className="absolute rounded-full bg-white flex flex-col items-center justify-center"
        style={{ width: 80, height: 80 }}>
        <span className="text-[11px] font-bold text-[#0E1C2F]">{(TOTAL_CATS / 1000).toFixed(0)}K</span>
        <span className="text-[9px] text-[#7A8FA6]">Total</span>
      </div>
    </div>
  );
}

export default function CMOverviewPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">Gujarat State Grievance Command Centre</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">
          Hon'ble Chief Minister's Office · All Departments · 33 Districts · Integrated GMS Intelligence
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live · Updated now
        </span>
        <span className="text-[11px] text-[#7A8FA6]">
          {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      </div>

      <p className="text-[10px] font-semibold text-[#7A8FA6] uppercase tracking-widest mb-3">
        State-wide grievance pulse — all departments · all 33 districts
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {CM_KPI.map((kpi, i) => <KPICard key={i} data={kpi} />)}
      </div>

      {/* Row 1: Dept performance + Category pie */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* Department performance */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE] flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Department Performance</h2>
            <Link href="/cm/departments" className="text-[11px] text-blue-600 font-medium hover:underline">All depts →</Link>
          </div>
          <div className="divide-y divide-[#F0F2F7]">
            {DEPTS.map(d => {
              const st = d.sla >= 85 && d.csat >= 4.0 ? 'Good' : d.sla < 75 || d.csat < 3.5 ? 'Alert' : 'Watch';
              const stColor = st === 'Good' ? { bg: '#F0FDF4', text: '#16A34A' } : st === 'Alert' ? { bg: '#FEF2F2', text: '#DC2626' } : { bg: '#FFFBEB', text: '#D97706' };
              return (
                <div key={d.name} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[14px] flex-shrink-0" style={{ background: d.color + '22' }}>{d.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-[#0E1C2F] truncate">{d.name}</div>
                    <div className="text-[10px] text-[#7A8FA6]">SLA: <span className="font-bold" style={{ color: sc(d.sla) }}>{d.sla}%</span> · {d.open.toLocaleString()} open</div>
                  </div>
                  <div className="text-[14px] font-bold mr-2" style={{ color: cc(d.csat) }}>{d.csat.toFixed(1)}</div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: stColor.bg, color: stColor.text }}>{st}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category donut + legend */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Complaint Category Breakdown</h2>
          </div>
          <div className="p-4 flex flex-col items-center gap-4">
            <DonutChart />
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 w-full">
              {CATS.map(cat => (
                <div key={cat.l} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.c }} />
                  <span className="text-[11px] text-[#3D5068] flex-1">{cat.l}</span>
                  <span className="text-[11px] font-semibold text-[#0E1C2F]">{Math.round(cat.v / TOTAL_CATS * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Critical districts + Trend */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Districts needing attention */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE] flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Districts Needing Immediate Attention</h2>
            <Link href="/cm/districts" className="text-[11px] text-blue-600 font-medium hover:underline">Full map →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border-collapse">
              <thead className="bg-[#F8FAFD]">
                <tr>
                  {['District', 'Division', 'CSAT', 'SLA', 'Critical', 'Flag'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-[9px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CRIT_DISTS.map((d, i) => {
                  const urgent = d.csat < 3.1;
                  return (
                    <tr key={d.name} className={`border-l-2 ${urgent ? 'border-l-red-500' : 'border-l-amber-400'} ${i < CRIT_DISTS.length - 1 ? 'border-b border-[#F0F2F7]' : ''}`}>
                      <td className="px-3 py-2 font-semibold text-[#0E1C2F]">{d.name}</td>
                      <td className="px-3 py-2 text-[#7A8FA6] text-[10px]">{d.div}</td>
                      <td className="px-3 py-2 font-bold" style={{ color: cc(d.csat) }}>{d.csat.toFixed(1)}</td>
                      <td className="px-3 py-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: d.sla >= 75 ? '#FFFBEB' : '#FEF2F2', color: d.sla >= 75 ? '#D97706' : '#DC2626' }}>{d.sla}%</span>
                      </td>
                      <td className="px-3 py-2 font-bold text-red-600">{d.crit}</td>
                      <td className="px-3 py-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: urgent ? '#FEF2F2' : '#FFFBEB', color: urgent ? '#DC2626' : '#D97706' }}>{urgent ? 'URGENT' : 'WATCH'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 12-month trend */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">12-Month State Complaint Trend</h2>
          </div>
          <div className="p-4">
            <LineChart data={TREND_TOTALS} color="#C9A84C" />
            <div className="flex justify-between mt-1 px-1">
              {MONTHS.map((m, i) => (
                <span key={i} className="text-[8px] text-[#7A8FA6]">{m}</span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F0F2F7]">
              <div>
                <p className="text-[10px] text-[#7A8FA6]">Apr baseline</p>
                <p className="text-[13px] font-bold text-[#0E1C2F]">14,200</p>
              </div>
              <div>
                <p className="text-[10px] text-[#7A8FA6]">Current (Mar)</p>
                <p className="text-[13px] font-bold text-red-600">18,492</p>
              </div>
              <div>
                <p className="text-[10px] text-[#7A8FA6]">YoY change</p>
                <p className="text-[13px] font-bold text-red-600">▲ 30%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
