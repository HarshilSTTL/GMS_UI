'use client';
import React from 'react';
import { KPICard } from '@/components/gms/KPICard';
import { MOCK_COMPLAINTS } from '@/data';
import { KPIData } from '@/types';

const CM_KPI: KPIData[] = [
  { label: 'Total Open', value: '18,492', trend: '▲ 847 from last week', trendType: 'down', accentColor: '#3A8FE8' },
  { label: 'Resolved This Month', value: '24,187', trend: '▲ 12% vs last month', trendType: 'up', accentColor: '#28C880' },
  { label: 'State SLA %', value: '78%', trend: 'Target 85% · Gap −7%', trendType: 'warn', accentColor: '#F0A030' },
  { label: 'Critical Open', value: '312', trend: '▲ 47 unresolved >3d', trendType: 'down', accentColor: '#E84040' },
  { label: 'State CSAT', value: '3.6', trend: 'Target 4.0 · 9 depts below', trendType: 'warn', accentColor: '#C9A84C' },
  { label: 'Auto-classify Rate', value: '91%', trend: '▲ 3% this quarter', trendType: 'up', accentColor: '#00B4B4' },
  { label: 'Districts CSAT <3.5', value: '11', trend: 'Needs CM directive', trendType: 'down', accentColor: '#E84040' },
  { label: 'L3 Escalations', value: '83', trend: '▲ 22 this week', trendType: 'down', accentColor: '#F0A030' },
];

const DEPT_PERFORMANCE = [
  { name: 'GWSSB', sla: 82, csat: 3.8, total: 2840, color: '#3A8FE8' },
  { name: 'AMC', sla: 74, csat: 3.4, total: 5120, color: '#28C880' },
  { name: 'Revenue', sla: 91, csat: 4.1, total: 1890, color: '#F0A030' },
  { name: 'DGVCL', sla: 88, csat: 4.0, total: 2340, color: '#C9A84C' },
  { name: 'Roads & B', sla: 63, csat: 3.1, total: 3210, color: '#E84040' },
  { name: 'Education', sla: 95, csat: 4.3, total: 980, color: '#00B4B4' },
];

export default function CMOverviewPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">Gujarat State Grievance Command Centre</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">
          Hon'ble Chief Minister's Office · All Departments · 33 Districts · Integrated GMS Intelligence
        </p>
      </div>

      {/* Live badge */}
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live · Updated now
        </span>
        <span className="text-[11px] text-[#7A8FA6]">
          {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      </div>

      {/* State-wide KPI grid */}
      <p className="text-[10px] font-semibold text-[#7A8FA6] uppercase tracking-widest mb-3">
        State-wide grievance pulse — all departments · all 33 districts
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {CM_KPI.map((kpi, i) => (
          <KPICard key={i} data={kpi} />
        ))}
      </div>

      {/* Department performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Department Performance</h2>
            <button className="text-[11px] text-blue-600 font-medium hover:underline">All depts →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead className="bg-[#F8FAFD]">
                <tr>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Dept</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">SLA %</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">CSAT</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Total</th>
                </tr>
              </thead>
              <tbody>
                {DEPT_PERFORMANCE.map((d, i) => {
                  const slaColor = d.sla >= 85 ? '#16A34A' : d.sla >= 70 ? '#D97706' : '#DC2626';
                  const csatColor = d.csat >= 4 ? '#16A34A' : d.csat >= 3.5 ? '#D97706' : '#DC2626';
                  return (
                    <tr key={d.name} className={i !== DEPT_PERFORMANCE.length - 1 ? 'border-b border-[#DDE3EE]' : ''}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                          <span className="font-semibold text-[#0E1C2F]">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-16">
                            <div className="h-full rounded-full" style={{ width: `${d.sla}%`, background: slaColor }} />
                          </div>
                          <span className="text-[11px] font-bold" style={{ color: slaColor }}>{d.sla}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] font-bold" style={{ color: csatColor }}>{d.csat}</span>
                        <span className="text-[10px] text-[#7A8FA6]">/5</span>
                      </td>
                      <td className="px-4 py-3 text-[#3D5068] font-medium">{d.total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical alerts */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-4 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Districts Needing Immediate Attention</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { district: 'Rajkot', open: 2840, sla: 61, flag: 'red' },
              { district: 'Surat (East)', open: 1920, sla: 68, flag: 'red' },
              { district: 'Vadodara Rural', open: 1540, sla: 71, flag: 'amber' },
              { district: 'Mehsana', open: 1120, sla: 74, flag: 'amber' },
              { district: 'Gandhinagar', open: 890, sla: 79, flag: 'amber' },
            ].map(d => (
              <div key={d.district} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${d.flag === 'red' ? 'bg-red-50/60 border-red-100' : 'bg-amber-50/60 border-amber-100'}`}>
                <span className={`text-[12px] ${d.flag === 'red' ? 'text-red-500' : 'text-amber-500'}`}>
                  {d.flag === 'red' ? '🔴' : '🟡'}
                </span>
                <span className="flex-1 text-[12px] font-semibold text-[#0E1C2F]">{d.district}</span>
                <span className="text-[11px] text-[#3D5068]">{d.open.toLocaleString()} open</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${d.flag === 'red' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {d.sla}% SLA
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
