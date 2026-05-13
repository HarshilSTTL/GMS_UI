'use client';
import React, { useState } from 'react';

const DEPARTMENTS = [
  { name: 'AMC', full: 'Ahmedabad Municipal Corp.', total: 5120, open: 1840, resolved: 3280, sla: 74, csat: 3.4, breached: 312, icon: '🏙️', trend: 'down' },
  { name: 'GWSSB', full: 'Gujarat Water Supply Board', total: 2840, open: 890, resolved: 1950, sla: 82, csat: 3.8, breached: 87, icon: '💧', trend: 'up' },
  { name: 'Revenue', full: 'Revenue Department', total: 1890, open: 420, resolved: 1470, sla: 91, csat: 4.1, breached: 23, icon: '🏛', trend: 'up' },
  { name: 'DGVCL', full: 'Dakshin Gujarat Vij Co.', total: 2340, open: 610, resolved: 1730, sla: 88, csat: 4.0, breached: 41, icon: '⚡', trend: 'stable' },
  { name: 'Roads & B', full: 'Roads & Buildings Dept.', total: 3210, open: 1420, resolved: 1790, sla: 63, csat: 3.1, breached: 521, icon: '🛣️', trend: 'down' },
  { name: 'Education', full: 'Education Department', total: 980, open: 210, resolved: 770, sla: 95, csat: 4.3, breached: 8, icon: '📚', trend: 'up' },
  { name: 'Health (CDHO)', full: 'Community Health Dept.', total: 1560, open: 640, resolved: 920, sla: 71, csat: 3.2, breached: 178, icon: '🏥', trend: 'down' },
  { name: 'Agriculture', full: 'Agriculture & Farmers', total: 720, open: 190, resolved: 530, sla: 89, csat: 3.9, breached: 15, icon: '🌾', trend: 'stable' },
];

export default function CMDepartmentsPage() {
  const [sortBy, setSortBy] = useState<'sla' | 'total' | 'csat'>('total');
  const sorted = [...DEPARTMENTS].sort((a, b) => {
    if (sortBy === 'sla') return a.sla - b.sla;
    if (sortBy === 'csat') return a.csat - b.csat;
    return b.total - a.total;
  });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">All Departments — Performance Matrix</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">{DEPARTMENTS.length} departments · State-wide performance overview</p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-[12px] text-[#7A8FA6]">Sort by:</span>
        {(['total', 'sla', 'csat'] as const).map(k => (
          <button
            key={k}
            onClick={() => setSortBy(k)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${sortBy === k ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-[#DDE3EE] text-[#3D5068] hover:border-blue-300'}`}
          >
            {k === 'total' ? 'Total Volume' : k === 'sla' ? 'SLA %' : 'CSAT Score'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sorted.map(dept => {
          const slaColor = dept.sla >= 85 ? '#16A34A' : dept.sla >= 70 ? '#D97706' : '#DC2626';
          const csatColor = dept.csat >= 4 ? '#16A34A' : dept.csat >= 3.5 ? '#D97706' : '#DC2626';
          return (
            <div key={dept.name} className="bg-white border border-[#DDE3EE] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl flex-shrink-0">{dept.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-bold text-[#0E1C2F]">{dept.name}</h3>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${dept.trend === 'up' ? 'bg-green-100 text-green-700' : dept.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                      {dept.trend === 'up' ? '▲ Improving' : dept.trend === 'down' ? '▼ Declining' : '→ Stable'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A8FA6]">{dept.full}</p>
                </div>
                <div className="text-right">
                  <p className="text-[20px] font-bold text-[#0E1C2F]">{dept.total.toLocaleString()}</p>
                  <p className="text-[10px] text-[#7A8FA6]">total complaints</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-[16px] font-bold text-red-600">{dept.open.toLocaleString()}</p>
                  <p className="text-[10px] text-[#7A8FA6]">Open</p>
                </div>
                <div className="text-center">
                  <p className="text-[16px] font-bold text-green-600">{dept.resolved.toLocaleString()}</p>
                  <p className="text-[10px] text-[#7A8FA6]">Resolved</p>
                </div>
                <div className="text-center">
                  <p className="text-[16px] font-bold text-red-500">{dept.breached}</p>
                  <p className="text-[10px] text-[#7A8FA6]">SLA Breached</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[#7A8FA6]">SLA Adherence</span>
                    <span className="font-bold" style={{ color: slaColor }}>{dept.sla}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${dept.sla}%`, background: slaColor }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[#7A8FA6]">CSAT Score</span>
                    <span className="font-bold" style={{ color: csatColor }}>{dept.csat}/5</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(dept.csat / 5) * 100}%`, background: csatColor }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
