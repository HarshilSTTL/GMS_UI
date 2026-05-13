'use client';
import React, { useState } from 'react';

const DEPARTMENTS = [
  { id: 'hfwd', name: 'Health & Family Welfare', icon: '🏥', open: 2847, resolved: 3241, sla: 81, csat: 3.8, critical: 47, color: '#3A8FE8' },
  { id: 'edu',  name: 'Education Department',    icon: '📚', open: 2341, resolved: 2890, sla: 84, csat: 3.9, critical: 28, color: '#28C880' },
  { id: 'revn', name: 'Revenue & Land Records',  icon: '🏡', open: 3120, resolved: 2780, sla: 72, csat: 3.4, critical: 62, color: '#F0A030' },
  { id: 'pwd',  name: 'Roads & Buildings (PWD)', icon: '🛣', open: 1890, resolved: 2100, sla: 76, csat: 3.5, critical: 31, color: '#C9A84C' },
  { id: 'water',name: 'Water Supply & Sanitation',icon:'💧', open: 2210, resolved: 1980, sla: 69, csat: 3.2, critical: 54, color: '#00B4B4' },
  { id: 'agri', name: 'Agriculture Department',  icon: '🌾', open: 1540, resolved: 1720, sla: 88, csat: 4.1, critical: 12, color: '#639922' },
  { id: 'soc',  name: 'Social Justice',          icon: '🤝', open: 1280, resolved: 1450, sla: 82, csat: 3.7, critical: 19, color: '#7F77DD' },
  { id: 'lab',  name: 'Labour & Employment',     icon: '⚙',  open: 980,  resolved: 1120, sla: 86, csat: 4.0, critical: 8,  color: '#D85A30' },
  { id: 'food', name: 'Food & Civil Supplies',   icon: '🌽', open: 1420, resolved: 1380, sla: 74, csat: 3.3, critical: 38, color: '#E84040' },
  { id: 'home', name: 'Home / Police Dept',      icon: '🛡', open: 870,  resolved: 920,  sla: 89, csat: 3.6, critical: 21, color: '#888780' },
];

function cc(v: number) { return v >= 4.0 ? '#16A34A' : v >= 3.5 ? '#D97706' : '#DC2626'; }
function sc(v: number) { return v >= 85 ? '#16A34A' : v >= 75 ? '#D97706' : '#DC2626'; }

// Horizontal bar chart component
function HBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-3 bg-[#F0F2F7] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[11px] font-bold w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

export default function CMDepartmentsPage() {
  const [sortBy, setSortBy] = useState<'sla' | 'total' | 'csat'>('total');
  const sorted = [...DEPARTMENTS].sort((a, b) => {
    if (sortBy === 'sla') return a.sla - b.sla;
    if (sortBy === 'csat') return a.csat - b.csat;
    return b.open - a.open;
  });

  const shortNames = DEPARTMENTS.map(d => d.name.split(' ').slice(0, 2).join(' '));

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">All Departments — Performance Matrix</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">{DEPARTMENTS.length} departments · State-wide performance overview</p>
      </div>

      {/* Bar charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-5">
        {/* SLA Bar Chart */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <p className="text-[13px] font-bold text-[#0E1C2F] mb-4">SLA Adherence by Department</p>
          <div className="space-y-2.5">
            {DEPARTMENTS.map(d => (
              <div key={d.id} className="flex items-center gap-2">
                <span className="text-[10px] text-[#3D5068] w-32 flex-shrink-0 truncate">{d.name.split(' ').slice(0, 2).join(' ')}</span>
                <div className="flex-1 h-3 bg-[#F0F2F7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.sla}%`, background: sc(d.sla) }} />
                </div>
                <span className="text-[11px] font-bold w-9 text-right" style={{ color: sc(d.sla) }}>{d.sla}%</span>
              </div>
            ))}
            {/* Target line label */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#F0F2F7]">
              <span className="text-[9px] text-[#7A8FA6] w-32">Target</span>
              <div className="flex-1 h-px border-t-2 border-dashed border-green-400" style={{ marginLeft: '85%', width: '1px', display: 'none' }} />
              <span className="text-[9px] text-green-600 font-semibold">85% target</span>
            </div>
          </div>
        </div>

        {/* CSAT Bar Chart */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <p className="text-[13px] font-bold text-[#0E1C2F] mb-4">CSAT Score by Department</p>
          <div className="space-y-2.5">
            {DEPARTMENTS.map(d => (
              <div key={d.id} className="flex items-center gap-2">
                <span className="text-[10px] text-[#3D5068] w-32 flex-shrink-0 truncate">{d.name.split(' ').slice(0, 2).join(' ')}</span>
                <div className="flex-1 h-3 bg-[#F0F2F7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(d.csat / 5) * 100}%`, background: cc(d.csat) }} />
                </div>
                <span className="text-[11px] font-bold w-9 text-right" style={{ color: cc(d.csat) }}>{d.csat.toFixed(1)}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1 border-t border-[#F0F2F7]">
              <span className="text-[9px] text-[#7A8FA6] w-32">Target</span>
              <span className="text-[9px] text-green-600 font-semibold">4.0 target</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scorecard table */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="px-5 py-3.5 border-b border-[#DDE3EE] flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">Department Scorecard — Full Matrix</h2>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#7A8FA6]">Sort:</span>
            {(['total', 'sla', 'csat'] as const).map(k => (
              <button key={k} onClick={() => setSortBy(k)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${sortBy === k ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-[#DDE3EE] text-[#3D5068] hover:border-blue-300'}`}>
                {k === 'total' ? 'Volume' : k === 'sla' ? 'SLA %' : 'CSAT'}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['', 'Department', 'Open', 'Resolved', 'SLA %', 'CSAT', 'Critical', 'Trend', 'Status'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[9px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => {
                const st = d.sla >= 85 && d.csat >= 4.0 ? 'On Track' : d.sla < 75 || d.csat < 3.5 ? 'Needs Action' : 'Monitor';
                const stColors = st === 'On Track'
                  ? { bg: '#F0FDF4', text: '#16A34A', border: 'border-l-green-400' }
                  : st === 'Needs Action'
                    ? { bg: '#FEF2F2', text: '#DC2626', border: 'border-l-red-500' }
                    : { bg: '#FFFBEB', text: '#D97706', border: 'border-l-amber-400' };
                const rising = d.open > d.resolved;
                return (
                  <tr key={d.id} className={`border-l-2 ${stColors.border} ${i < sorted.length - 1 ? 'border-b border-[#F0F2F7]' : ''}`}>
                    <td className="px-3 py-2.5 text-base">{d.icon}</td>
                    <td className="px-3 py-2.5 font-semibold text-[#0E1C2F] whitespace-nowrap">{d.name}</td>
                    <td className="px-3 py-2.5 text-[#3D5068]">{d.open.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-green-600 font-medium">{d.resolved.toLocaleString()}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: sc(d.sla) + '18', color: sc(d.sla) }}>{d.sla}%</span>
                    </td>
                    <td className="px-3 py-2.5 font-bold" style={{ color: cc(d.csat) }}>{d.csat.toFixed(1)}</td>
                    <td className="px-3 py-2.5 font-bold" style={{ color: d.critical > 30 ? '#DC2626' : '#3D5068' }}>{d.critical}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-semibold ${rising ? 'text-red-600' : 'text-green-600'}`}>
                        {rising ? '▲ Rising' : '▼ Easing'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: stColors.bg, color: stColors.text }}>{st}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
