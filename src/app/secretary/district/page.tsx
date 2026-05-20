'use client';
import React, { useState, useMemo } from 'react';

const DIST_DATA = [
  { name: 'Ahmedabad', cdho: 'Dr. R. Shah', open: 287, crit: 8, sla: 88, csat: 4.1, top: 'MCH' },
  { name: 'Surat', cdho: 'Dr. P. Patel', open: 241, crit: 11, sla: 61, csat: 3.4, top: 'Hospital' },
  { name: 'Rajkot', cdho: 'Dr. K. Joshi', open: 198, crit: 9, sla: 79, csat: 3.8, top: 'PMJAY' },
  { name: 'Vadodara', cdho: 'Dr. M. Mehta', open: 176, crit: 5, sla: 85, csat: 4.0, top: 'MCH' },
  { name: 'Gandhinagar', cdho: 'Dr. A. Dave', open: 134, crit: 3, sla: 92, csat: 4.3, top: 'PHC' },
  { name: 'Bhavnagar', cdho: 'Dr. N. Trivedi', open: 128, crit: 6, sla: 77, csat: 3.7, top: 'Hospital' },
  { name: 'Jamnagar', cdho: 'Dr. S. Rana', open: 119, crit: 4, sla: 83, csat: 3.9, top: 'MCH' },
  { name: 'Kutch', cdho: 'Dr. H. Solanki', open: 143, crit: 7, sla: 72, csat: 3.6, top: 'Hospital' },
  { name: 'Banaskantha', cdho: 'Dr. D. Parmar', open: 156, crit: 5, sla: 74, csat: 3.5, top: 'MCH' },
  { name: 'Sabarkantha', cdho: 'Dr. B. Chauhan', open: 112, crit: 4, sla: 80, csat: 3.9, top: 'PHC' },
  { name: 'Surendranagar', cdho: 'Dr. F. Malek', open: 97, crit: 12, sla: 68, csat: 3.3, top: 'CDC' },
  { name: 'Morbi', cdho: 'Dr. C. Gohel', open: 87, crit: 3, sla: 82, csat: 4.0, top: 'PHC' },
];

function slaColor(v: number) { return v >= 85 ? '#16A34A' : v >= 75 ? '#D97706' : '#DC2626'; }
function slaBg(v: number) { return v >= 85 ? '#F0FDF4' : v >= 75 ? '#FFFBEB' : '#FEF2F2'; }
function csatColor(v: number) { return v >= 4.0 ? '#16A34A' : v >= 3.5 ? '#D97706' : '#DC2626'; }

export default function SecretaryDistrictPage() {
  const [distFilter, setDistFilter] = useState('all');
  const [metricFilter, setMetricFilter] = useState('sla');

  const filtered = useMemo(() => {
    let data = [...DIST_DATA];
    if (distFilter === 'critical') data = data.filter(d => d.sla < 75);
    if (distFilter === 'high') data = data.filter(d => d.open > 150);
    if (metricFilter === 'open') data.sort((a, b) => b.open - a.open);
    if (metricFilter === 'critical') data.sort((a, b) => b.crit - a.crit);
    if (metricFilter === 'csat') data.sort((a, b) => a.csat - b.csat);
    if (metricFilter === 'sla') data.sort((a, b) => a.sla - b.sla);
    return data;
  }, [distFilter, metricFilter]);

  const maxOpen = Math.max(...DIST_DATA.map(d => d.open));

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">District Analysis</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">
          District-wise grievance performance across Health &amp; Family Welfare Department
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="text-[11px] text-[#7A8FA6] font-medium">Filter:</span>
        <select
          value={distFilter}
          onChange={e => setDistFilter(e.target.value)}
          className="text-[11px] px-3 py-1.5 border border-[#DDE3EE] rounded-lg bg-white text-[#0E1C2F] outline-none focus:border-blue-400 cursor-pointer"
        >
          <option value="all">All districts</option>
          <option value="critical">Critical SLA only</option>
          <option value="high">High volume</option>
        </select>
        <select
          value={metricFilter}
          onChange={e => setMetricFilter(e.target.value)}
          className="text-[11px] px-3 py-1.5 border border-[#DDE3EE] rounded-lg bg-white text-[#0E1C2F] outline-none focus:border-blue-400 cursor-pointer"
        >
          <option value="sla">SLA adherence</option>
          <option value="open">Open complaints</option>
          <option value="critical">Critical count</option>
          <option value="csat">CSAT score</option>
        </select>
      </div>

      {/* District Table */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)] mb-5">
        <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">District-wise Grievance Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['District', 'CDHO', 'Open', 'Critical', 'SLA %', 'CSAT', 'Top Category', 'Status'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[9px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const statusText = d.sla >= 85 ? 'On track' : d.sla >= 75 ? 'At risk' : 'Breach';
                const statusBg = d.sla >= 85 ? '#F0FDF4' : d.sla >= 75 ? '#FFFBEB' : '#FEF2F2';
                const statusFg = d.sla >= 85 ? '#16A34A' : d.sla >= 75 ? '#D97706' : '#DC2626';
                return (
                  <tr key={d.name} className={`${i < filtered.length - 1 ? 'border-b border-[#F0F2F7]' : ''} hover:bg-[#F8FAFD] transition-colors`}>
                    <td className="px-3 py-2.5 font-semibold text-[#0E1C2F]">{d.name}</td>
                    <td className="px-3 py-2.5 text-[#7A8FA6] text-[11px]">{d.cdho}</td>
                    <td className="px-3 py-2.5 font-semibold text-[#0E1C2F]">{d.open}</td>
                    <td className="px-3 py-2.5 font-semibold" style={{ color: d.crit > 8 ? '#DC2626' : '#0E1C2F' }}>{d.crit}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: slaBg(d.sla), color: slaColor(d.sla) }}>
                        {d.sla}%
                      </span>
                      <div className="w-14 bg-[#F0F2F7] rounded-full h-1 overflow-hidden mt-1 inline-block align-middle ml-1.5">
                        <div className="h-full rounded-full" style={{ width: `${d.sla}%`, background: slaColor(d.sla) }} />
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-bold" style={{ color: csatColor(d.csat) }}>{d.csat.toFixed(1)}</td>
                    <td className="px-3 py-2.5 text-[11px] text-[#7A8FA6]">{d.top}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: statusBg, color: statusFg }}>{statusText}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLA adherence bar chart */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)] mb-5">
        <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">SLA Adherence by District</h2>
        </div>
        <div className="p-5">
          <div className="flex items-end gap-2 h-48">
            {DIST_DATA.map(d => (
              <div key={d.name} className="flex-1 flex flex-col items-center justify-end gap-1">
                <span className="text-[9px] font-semibold" style={{ color: slaColor(d.sla) }}>{d.sla}%</span>
                <div
                  className="w-full rounded-t-sm"
                  style={{ height: `${(d.sla / 100) * 160}px`, background: slaColor(d.sla), minHeight: 8 }}
                />
                <span className="text-[8px] text-[#7A8FA6] text-center truncate w-full">{d.name.slice(0, 5)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F0F2F7] text-[10px] text-[#7A8FA6]">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: '#16A34A' }} />On track (≥85%)</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: '#D97706' }} />At risk (75–84%)</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: '#DC2626' }} />Breach (&lt;75%)</div>
          </div>
        </div>
      </div>

      {/* Open complaints bar chart */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">Open Complaints Volume by District</h2>
        </div>
        <div className="p-5">
          <div className="space-y-2.5">
            {[...DIST_DATA].sort((a, b) => b.open - a.open).map(d => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="text-[11px] text-[#0E1C2F] w-28 flex-shrink-0 font-medium">{d.name}</span>
                <div className="flex-1 bg-[#F0F2F7] rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full bg-[#185FA5]" style={{ width: `${(d.open / maxOpen) * 100}%` }} />
                </div>
                <span className="text-[11px] font-semibold text-[#0E1C2F] w-8 text-right">{d.open}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
