'use client';
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const DISTRICTS = [
  { name: 'Ahmedabad', open: 4820, sla: 79, csat: 3.7, flag: 'amber' },
  { name: 'Surat', open: 3940, sla: 71, csat: 3.3, flag: 'red' },
  { name: 'Vadodara', open: 2840, sla: 76, csat: 3.5, flag: 'amber' },
  { name: 'Rajkot', open: 2840, sla: 61, csat: 3.1, flag: 'red' },
  { name: 'Bhavnagar', open: 1210, sla: 83, csat: 3.8, flag: 'green' },
  { name: 'Jamnagar', open: 980, sla: 81, csat: 3.7, flag: 'green' },
  { name: 'Gandhinagar', open: 890, sla: 79, csat: 3.6, flag: 'amber' },
  { name: 'Mehsana', open: 1120, sla: 74, csat: 3.4, flag: 'amber' },
  { name: 'Junagadh', open: 740, sla: 85, csat: 4.0, flag: 'green' },
  { name: 'Anand', open: 680, sla: 88, csat: 4.1, flag: 'green' },
  { name: 'Kheda', open: 590, sla: 82, csat: 3.8, flag: 'green' },
  { name: 'Patan', open: 420, sla: 90, csat: 4.2, flag: 'green' },
  { name: 'Surendranagar', open: 510, sla: 77, csat: 3.5, flag: 'amber' },
  { name: 'Amreli', open: 380, sla: 86, csat: 4.0, flag: 'green' },
  { name: 'Navsari', open: 460, sla: 84, csat: 3.9, flag: 'green' },
  { name: 'Bharuch', open: 540, sla: 80, csat: 3.7, flag: 'green' },
  { name: 'Narmada', open: 290, sla: 91, csat: 4.3, flag: 'green' },
  { name: 'Valsad', open: 350, sla: 87, csat: 4.0, flag: 'green' },
  { name: 'Tapi', open: 240, sla: 89, csat: 4.1, flag: 'green' },
  { name: 'Dang', open: 180, sla: 93, csat: 4.4, flag: 'green' },
  { name: 'Surat (East)', open: 1920, sla: 68, csat: 3.2, flag: 'red' },
  { name: 'Vadodara Rural', open: 1540, sla: 71, csat: 3.4, flag: 'red' },
  { name: 'Kutch', open: 720, sla: 78, csat: 3.6, flag: 'amber' },
  { name: 'Banaskantha', open: 490, sla: 83, csat: 3.8, flag: 'green' },
  { name: 'Sabarkantha', open: 410, sla: 85, csat: 3.9, flag: 'green' },
  { name: 'Aravalli', open: 320, sla: 88, csat: 4.0, flag: 'green' },
  { name: 'Mahisagar', open: 280, sla: 87, csat: 4.0, flag: 'green' },
  { name: 'Chhota Udaipur', open: 250, sla: 90, csat: 4.2, flag: 'green' },
  { name: 'Dahod', open: 310, sla: 86, csat: 3.9, flag: 'green' },
  { name: 'Panchmahal', open: 390, sla: 84, csat: 3.8, flag: 'green' },
  { name: 'Morbi', open: 460, sla: 81, csat: 3.7, flag: 'green' },
  { name: 'Botad', open: 290, sla: 89, csat: 4.1, flag: 'green' },
  { name: 'Gir Somnath', open: 310, sla: 87, csat: 4.0, flag: 'green' },
];

const FLAG_COLORS = { red: { bg: '#FEF2F2', text: '#991B1B', dot: '#DC2626', label: 'Critical' }, amber: { bg: '#FFFBEB', text: '#92400E', dot: '#D97706', label: 'Attention' }, green: { bg: '#F0FDF4', text: '#065F46', dot: '#16A34A', label: 'Good' } };

export default function CMDistrictsPage() {
  const [filter, setFilter] = useState<'all' | 'red' | 'amber' | 'green'>('all');
  const filtered = filter === 'all' ? DISTRICTS : DISTRICTS.filter(d => d.flag === filter);
  const redCount = DISTRICTS.filter(d => d.flag === 'red').length;
  const amberCount = DISTRICTS.filter(d => d.flag === 'amber').length;

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <MapPin size={20} className="text-red-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Districts Heat Map</h1>
          <p className="text-[12px] text-[#7A8FA6]">All 33 districts · Grievance performance overview</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[{ flag: 'red', label: 'Critical', count: redCount, color: '#DC2626', bg: '#FEF2F2' },
          { flag: 'amber', label: 'Needs Attention', count: amberCount, color: '#D97706', bg: '#FFFBEB' },
          { flag: 'green', label: 'Performing Well', count: DISTRICTS.length - redCount - amberCount, color: '#16A34A', bg: '#F0FDF4' }
        ].map(s => (
          <div key={s.flag} className="rounded-[14px] px-4 py-3.5 border" style={{ background: s.bg, borderColor: s.color + '30' }}>
            <p className="text-[26px] font-bold" style={{ color: s.color }}>{s.count}</p>
            <p className="text-[11px] font-semibold" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'red', 'amber', 'green'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border capitalize transition-all ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-[#DDE3EE] text-[#3D5068]'}`}>
            {f === 'all' ? `All (${DISTRICTS.length})` : f === 'red' ? `Critical (${redCount})` : f === 'amber' ? `Attention (${amberCount})` : `Good (${DISTRICTS.length - redCount - amberCount})`}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['District', 'Open Complaints', 'SLA %', 'CSAT Score', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const fc = FLAG_COLORS[d.flag as keyof typeof FLAG_COLORS];
                const slaColor = d.sla >= 85 ? '#16A34A' : d.sla >= 70 ? '#D97706' : '#DC2626';
                return (
                  <tr key={d.name} className={i !== filtered.length - 1 ? 'border-b border-[#DDE3EE]' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: fc.dot }} />
                        <span className="font-semibold text-[#0E1C2F]">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0E1C2F]">{d.open.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${d.sla}%`, background: slaColor }} />
                        </div>
                        <span className="font-bold text-[11px]" style={{ color: slaColor }}>{d.sla}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-[13px]" style={{ color: d.csat >= 4 ? '#16A34A' : d.csat >= 3.5 ? '#D97706' : '#DC2626' }}>
                        {d.csat}
                      </span>
                      <span className="text-[10px] text-[#7A8FA6]">/5</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: fc.bg, color: fc.text }}>
                        {fc.label}
                      </span>
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
