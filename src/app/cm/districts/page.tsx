'use client';
import React from 'react';

const DISTS = [
  { name: 'Ahmedabad',       div: 'Central',    open: 1842, csat: 4.1, sla: 88, crit: 18, top: 'Revenue',       trend: 'up'     },
  { name: 'Surat',           div: 'South',      open: 1614, csat: 3.4, sla: 62, crit: 24, top: 'Water Supply',  trend: 'down'   },
  { name: 'Rajkot',          div: 'Saurashtra', open: 1287, csat: 3.8, sla: 79, crit: 14, top: 'Health',        trend: 'stable' },
  { name: 'Vadodara',        div: 'Central',    open: 1190, csat: 4.0, sla: 85, crit: 9,  top: 'Education',     trend: 'up'     },
  { name: 'Gandhinagar',     div: 'Central',    open: 743,  csat: 4.4, sla: 93, crit: 4,  top: 'Revenue',       trend: 'up'     },
  { name: 'Bhavnagar',       div: 'Saurashtra', open: 891,  csat: 3.7, sla: 77, crit: 12, top: 'Health',        trend: 'stable' },
  { name: 'Jamnagar',        div: 'Saurashtra', open: 834,  csat: 3.9, sla: 82, crit: 8,  top: 'Water Supply',  trend: 'stable' },
  { name: 'Kutch',           div: 'Kutch',      open: 967,  csat: 3.5, sla: 72, crit: 16, top: 'Roads',         trend: 'down'   },
  { name: 'Banaskantha',     div: 'North',      open: 1021, csat: 3.3, sla: 68, crit: 19, top: 'Water Supply',  trend: 'down'   },
  { name: 'Sabarkantha',     div: 'North',      open: 723,  csat: 3.6, sla: 80, crit: 7,  top: 'Agriculture',   trend: 'stable' },
  { name: 'Surendranagar',   div: 'Saurashtra', open: 678,  csat: 3.2, sla: 65, crit: 22, top: 'Health',        trend: 'down'   },
  { name: 'Mahesana',        div: 'North',      open: 612,  csat: 3.7, sla: 78, crit: 9,  top: 'Revenue',       trend: 'stable' },
  { name: 'Patan',           div: 'North',      open: 498,  csat: 3.4, sla: 71, crit: 11, top: 'Water Supply',  trend: 'down'   },
  { name: 'Anand',           div: 'Central',    open: 567,  csat: 4.0, sla: 87, crit: 5,  top: 'Education',     trend: 'up'     },
  { name: 'Kheda',           div: 'Central',    open: 534,  csat: 3.8, sla: 83, crit: 6,  top: 'Agriculture',   trend: 'stable' },
  { name: 'Bharuch',         div: 'South',      open: 589,  csat: 3.6, sla: 76, crit: 10, top: 'Revenue',       trend: 'stable' },
  { name: 'Navsari',         div: 'South',      open: 445,  csat: 3.9, sla: 84, crit: 4,  top: 'Roads',         trend: 'up'     },
  { name: 'Valsad',          div: 'South',      open: 467,  csat: 3.7, sla: 80, crit: 7,  top: 'Water Supply',  trend: 'stable' },
  { name: 'Tapi',            div: 'South',      open: 312,  csat: 3.3, sla: 69, crit: 8,  top: 'Agriculture',   trend: 'down'   },
  { name: 'Dang',            div: 'South',      open: 198,  csat: 3.1, sla: 61, crit: 12, top: 'Health',        trend: 'down'   },
  { name: 'Narmada',         div: 'South',      open: 287,  csat: 3.2, sla: 64, crit: 9,  top: 'Water Supply',  trend: 'down'   },
  { name: 'Chhota Udaipur',  div: 'East',       open: 354,  csat: 3.0, sla: 58, crit: 14, top: 'Health',        trend: 'down'   },
  { name: 'Panchmahal',      div: 'East',       open: 478,  csat: 3.2, sla: 67, crit: 11, top: 'Revenue',       trend: 'down'   },
  { name: 'Dahod',           div: 'East',       open: 512,  csat: 2.9, sla: 54, crit: 18, top: 'Health',        trend: 'down'   },
  { name: 'Mahisagar',       div: 'East',       open: 334,  csat: 3.1, sla: 63, crit: 10, top: 'Water Supply',  trend: 'down'   },
  { name: 'Aravalli',        div: 'North',      open: 389,  csat: 3.5, sla: 74, crit: 8,  top: 'Agriculture',   trend: 'stable' },
  { name: 'Gir Somnath',     div: 'Saurashtra', open: 434,  csat: 3.8, sla: 81, crit: 6,  top: 'Roads',         trend: 'stable' },
  { name: 'Amreli',          div: 'Saurashtra', open: 398,  csat: 3.6, sla: 77, crit: 9,  top: 'Agriculture',   trend: 'stable' },
  { name: 'Botad',           div: 'Saurashtra', open: 312,  csat: 3.5, sla: 75, crit: 5,  top: 'Water Supply',  trend: 'stable' },
  { name: 'Devbhoomi Dwarka',div: 'Saurashtra', open: 287,  csat: 3.7, sla: 79, crit: 4,  top: 'Roads',         trend: 'stable' },
  { name: 'Morbi',           div: 'Saurashtra', open: 423,  csat: 3.6, sla: 80, crit: 7,  top: 'Health',        trend: 'stable' },
  { name: 'Porbandar',       div: 'Saurashtra', open: 278,  csat: 3.9, sla: 85, crit: 3,  top: 'Roads',         trend: 'up'     },
  { name: 'Devgadh Baria',   div: 'East',       open: 198,  csat: 3.3, sla: 66, crit: 7,  top: 'Health',        trend: 'down'   },
];

const HM_DEPTS = ['Health', 'Education', 'Revenue', 'PWD', 'Water', 'Agri', 'Food', 'Labour'];
const HM_SHARES = [0.15, 0.12, 0.20, 0.08, 0.18, 0.07, 0.12, 0.08];

function cc(v: number) { return v >= 4.0 ? '#16A34A' : v >= 3.5 ? '#D97706' : '#DC2626'; }
function sc(v: number) { return v >= 85 ? '#16A34A' : v >= 75 ? '#D97706' : '#DC2626'; }

function hmColor(pct: number) {
  if (pct > 0.75) return { bg: '#991b1b', text: '#fca5a5' };
  if (pct > 0.55) return { bg: '#dc2626', text: '#fecaca' };
  if (pct > 0.35) return { bg: '#d97706', text: '#fde68a' };
  if (pct > 0.15) return { bg: '#1a5f8a', text: '#bae6fd' };
  return { bg: '#1a3a6a', text: '#93c5fd' };
}

export default function CMDistrictsPage() {
  const csatSorted = [...DISTS].sort((a, b) => a.csat - b.csat);
  const volSorted = [...DISTS].sort((a, b) => b.open - a.open);
  const maxVol = volSorted[0].open;

  const hmDists = DISTS.slice(0, 12);
  const hmData = hmDists.map(d => HM_SHARES.map(s => Math.round(d.open * s)));
  const hmMax = Math.max(...hmData.flat());

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">District Intelligence</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">All 33 districts · CSAT rankings, volume, heatmap, and performance data</p>
      </div>

      {/* CSAT ranking + Volume ranking */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* Bottom 15 CSAT */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">CSAT Ranking — Bottom 15 Districts</h2>
          </div>
          <div className="p-4 space-y-2">
            {csatSorted.slice(0, 15).map((d, i) => {
              const label = d.csat < 3.3 ? 'Critical' : d.csat < 3.7 ? 'Watch' : 'OK';
              const lc = d.csat < 3.3 ? { bg: '#FEF2F2', text: '#DC2626' } : d.csat < 3.7 ? { bg: '#FFFBEB', text: '#D97706' } : { bg: '#F0FDF4', text: '#16A34A' };
              return (
                <div key={d.name} className="flex items-center gap-2.5">
                  <span className="text-[11px] font-semibold text-[#7A8FA6] w-5 text-right flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-[#0E1C2F]">{d.name}</div>
                    <div className="text-[9px] text-[#7A8FA6]">{d.div} Division</div>
                  </div>
                  <div className="w-20 h-1.5 bg-[#F0F2F7] rounded-full overflow-hidden flex-shrink-0">
                    <div className="h-full rounded-full" style={{ width: `${(d.csat / 5) * 100}%`, background: cc(d.csat) }} />
                  </div>
                  <span className="text-[11px] font-bold w-7 text-right flex-shrink-0" style={{ color: cc(d.csat) }}>{d.csat.toFixed(1)}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: lc.bg, color: lc.text }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 15 Volume */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Complaint Volume — Top 15 Districts</h2>
          </div>
          <div className="p-4 space-y-2">
            {volSorted.slice(0, 15).map((d, i) => (
              <div key={d.name} className="flex items-center gap-2.5">
                <span className="text-[11px] font-semibold text-[#7A8FA6] w-5 text-right flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-[#0E1C2F]">{d.name}</div>
                  <div className="text-[9px] text-[#7A8FA6]">{d.top} · SLA {d.sla}%</div>
                </div>
                <div className="w-20 h-1.5 bg-[#F0F2F7] rounded-full overflow-hidden flex-shrink-0">
                  <div className="h-full rounded-full bg-blue-400" style={{ width: `${(d.open / maxVol) * 100}%` }} />
                </div>
                <span className="text-[11px] font-bold text-[#0E1C2F] w-12 text-right flex-shrink-0">{d.open.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)] mb-4">
        <div className="px-5 py-3.5 border-b border-[#DDE3EE] flex items-center gap-3">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">District × Department Complaint Heatmap</h2>
          <span className="text-[10px] text-[#7A8FA6]">Higher = more complaints</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `100px repeat(${HM_DEPTS.length}, 1fr)` }}>
              <div />
              {HM_DEPTS.map(d => <div key={d} className="text-[9px] text-[#7A8FA6] text-center px-1">{d}</div>)}
            </div>
            {/* Rows */}
            {hmDists.map((dist, di) => (
              <div key={dist.name} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `100px repeat(${HM_DEPTS.length}, 1fr)` }}>
                <div className="text-[9px] text-[#3D5068] flex items-center">{dist.name}</div>
                {hmData[di].map((v, ci) => {
                  const cl = hmColor(v / hmMax);
                  return (
                    <div key={ci} className="h-6 rounded flex items-center justify-center text-[8px] font-bold"
                      style={{ background: cl.bg, color: cl.text }}>{v}</div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 text-[9px] text-[#7A8FA6]">
            <span>Low</span>
            {['#1a3a6a', '#1a5f8a', '#d97706', '#dc2626', '#991b1b'].map(c => (
              <div key={c} className="w-5 h-2.5 rounded" style={{ background: c }} />
            ))}
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Full district table */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">Full District Data — All 33 Districts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['District', 'Division', 'Open', 'Critical', 'SLA %', 'CSAT', 'Top Category', 'Trend', 'Action'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-[9px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DISTS.map((d, i) => {
                const act = d.csat < 3.3 || d.sla < 65 ? 'URGENT' : d.sla < 75 || d.csat < 3.5 ? 'MONITOR' : 'OK';
                const actC = act === 'URGENT' ? { bg: '#FEF2F2', text: '#DC2626' } : act === 'MONITOR' ? { bg: '#FFFBEB', text: '#D97706' } : { bg: '#F0FDF4', text: '#16A34A' };
                const trendIcon = d.trend === 'up' ? '▲' : d.trend === 'down' ? '▼' : '—';
                const trendColor = d.trend === 'up' ? '#16A34A' : d.trend === 'down' ? '#DC2626' : '#7A8FA6';
                const leftBorder = d.csat < 3.3 ? 'border-l-2 border-l-red-500' : d.sla < 70 ? 'border-l-2 border-l-amber-400' : '';
                return (
                  <tr key={d.name} className={`${leftBorder} ${i < DISTS.length - 1 ? 'border-b border-[#F0F2F7]' : ''}`}>
                    <td className="px-3 py-2 font-semibold text-[#0E1C2F] whitespace-nowrap">{d.name}</td>
                    <td className="px-3 py-2 text-[#7A8FA6] text-[10px]">{d.div}</td>
                    <td className="px-3 py-2 text-[#3D5068]">{d.open.toLocaleString()}</td>
                    <td className="px-3 py-2 font-bold" style={{ color: d.crit > 15 ? '#DC2626' : '#3D5068' }}>{d.crit}</td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: sc(d.sla) + '18', color: sc(d.sla) }}>{d.sla}%</span>
                    </td>
                    <td className="px-3 py-2 font-bold" style={{ color: cc(d.csat) }}>{d.csat.toFixed(1)}</td>
                    <td className="px-3 py-2 text-[10px] text-[#7A8FA6]">{d.top}</td>
                    <td className="px-3 py-2 font-bold text-[11px]" style={{ color: trendColor }}>{trendIcon}</td>
                    <td className="px-3 py-2">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: actC.bg, color: actC.text }}>{act}</span>
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
