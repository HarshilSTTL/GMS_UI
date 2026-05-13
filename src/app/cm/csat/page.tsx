'use client';
import React, { useState } from 'react';
import { Star } from 'lucide-react';

const CSAT_BY_DEPT = [
  { name: 'Education', score: 4.3, responses: 142, dist: [5, 12, 18, 45, 62] },
  { name: 'Revenue', score: 4.1, responses: 318, dist: [8, 21, 34, 98, 157] },
  { name: 'DGVCL', score: 4.0, responses: 274, dist: [9, 18, 41, 89, 117] },
  { name: 'Agriculture', score: 3.9, responses: 98, dist: [4, 8, 14, 32, 40] },
  { name: 'GWSSB', score: 3.8, responses: 421, dist: [18, 42, 67, 142, 152] },
  { name: 'AMC', score: 3.4, responses: 892, dist: [72, 118, 156, 284, 262] },
  { name: 'Health (CDHO)', score: 3.2, responses: 287, dist: [41, 58, 74, 68, 46] },
  { name: 'Roads & B', score: 3.1, responses: 543, dist: [89, 102, 121, 134, 97] },
];

const CSAT_MONTHLY = [
  { month: 'Nov', score: 3.4 },
  { month: 'Dec', score: 3.5 },
  { month: 'Jan', score: 3.6 },
  { month: 'Feb', score: 3.7 },
  { month: 'Mar', score: 3.8 },
  { month: 'Apr', score: 3.9 },
  { month: 'May', score: 4.0 },
];

const RECENT_FEEDBACK = [
  { id: 1, citizen: 'Rajesh Patel', dept: 'Revenue', score: 5, comment: 'Very quick resolution. Officer was professional and helpful.', date: '2025-05-06' },
  { id: 2, citizen: 'Meena Joshi', dept: 'Roads & B', score: 1, comment: 'Complaint still unresolved after 3 weeks. No updates received.', date: '2025-05-05' },
  { id: 3, citizen: 'Sunita Rao', dept: 'AMC', score: 4, comment: 'Garbage collected on time after complaint. Satisfied.', date: '2025-05-05' },
  { id: 4, citizen: 'Vikram Shah', dept: 'GWSSB', score: 2, comment: 'Water supply resumed but quality issues remain.', date: '2025-05-04' },
  { id: 5, citizen: 'Priya Nair', dept: 'Education', score: 5, comment: 'Issue resolved within a day. Excellent service!', date: '2025-05-04' },
];

function Stars({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} className={i <= score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
      ))}
    </div>
  );
}

export default function CMCsatPage() {
  const [view, setView] = useState<'dept' | 'feedback'>('dept');
  const overall = (CSAT_BY_DEPT.reduce((s, d) => s + d.score * d.responses, 0) / CSAT_BY_DEPT.reduce((s, d) => s + d.responses, 0)).toFixed(2);
  const totalResponses = CSAT_BY_DEPT.reduce((s, d) => s + d.responses, 0);
  const maxMonthly = Math.max(...CSAT_MONTHLY.map(m => m.score));

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
          <Star size={20} className="text-yellow-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">CSAT Analysis</h1>
          <p className="text-[12px] text-[#7A8FA6]">Citizen satisfaction scores · {totalResponses.toLocaleString()} responses this month</p>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <p className="text-[11px] text-[#7A8FA6] mb-1">Overall CSAT</p>
          <p className="text-[28px] font-bold text-yellow-500">{overall}</p>
          <div className="flex items-center gap-1 mt-1">
            <Stars score={Math.round(parseFloat(overall))} />
            <span className="text-[10px] text-[#7A8FA6]">/5</span>
          </div>
        </div>
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <p className="text-[11px] text-[#7A8FA6] mb-1">Total Responses</p>
          <p className="text-[28px] font-bold text-[#0E1C2F]">{totalResponses.toLocaleString()}</p>
          <p className="text-[10px] text-green-600 font-semibold mt-1">▲ 12% from last month</p>
        </div>
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <p className="text-[11px] text-[#7A8FA6] mb-1">Promoters (4–5 ★)</p>
          <p className="text-[28px] font-bold text-green-600">62%</p>
          <p className="text-[10px] text-[#7A8FA6] mt-1">Detractors: 18% · Neutral: 20%</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 mb-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
        <p className="text-[12px] font-bold text-[#0E1C2F] mb-3">CSAT Trend — Last 7 Months</p>
        <div className="flex items-end gap-3 h-24">
          {CSAT_MONTHLY.map((m, i) => {
            const pct = (m.score / maxMonthly) * 100;
            const isLast = i === CSAT_MONTHLY.length - 1;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-[#0E1C2F]">{m.score}</span>
                <div className="w-full rounded-t-md transition-all" style={{ height: `${pct * 0.7}px`, background: isLast ? '#1A56C4' : '#BFDBFE' }} />
                <span className="text-[9px] text-[#7A8FA6]">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 mb-4">
        {[['dept', 'By Department'], ['feedback', 'Recent Feedback']].map(([k, label]) => (
          <button key={k} onClick={() => setView(k as 'dept' | 'feedback')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${view === k ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-[#DDE3EE] text-[#3D5068]'}`}>
            {label}
          </button>
        ))}
      </div>

      {view === 'dept' ? (
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <table className="w-full text-[12px] border-collapse">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['Department', 'CSAT Score', 'Responses', 'Rating Distribution'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CSAT_BY_DEPT.map((d, i) => {
                const color = d.score >= 4 ? '#16A34A' : d.score >= 3.5 ? '#D97706' : '#DC2626';
                return (
                  <tr key={d.name} className={i !== CSAT_BY_DEPT.length - 1 ? 'border-b border-[#DDE3EE]' : ''}>
                    <td className="px-4 py-3 font-semibold text-[#0E1C2F]">{d.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold" style={{ color }}>{d.score}</span>
                        <Stars score={Math.round(d.score)} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#3D5068]">{d.responses.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-end gap-0.5 h-6">
                        {d.dist.map((count, j) => {
                          const pct = (count / Math.max(...d.dist)) * 100;
                          const barColor = j >= 3 ? '#16A34A' : j === 2 ? '#D97706' : '#DC2626';
                          return <div key={j} className="w-3 rounded-sm" style={{ height: `${pct}%`, background: barColor }} title={`${j + 1}★: ${count}`} />;
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-3">
          {RECENT_FEEDBACK.map(fb => {
            const bg = fb.score >= 4 ? '#F0FDF4' : fb.score === 3 ? '#FFFBEB' : '#FEF2F2';
            const border = fb.score >= 4 ? '#BBF7D0' : fb.score === 3 ? '#FDE68A' : '#FECACA';
            return (
              <div key={fb.id} className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[13px] font-semibold text-[#0E1C2F]">{fb.citizen}</span>
                    <span className="ml-2 text-[10px] text-[#7A8FA6] bg-[#F0F4FA] px-1.5 py-0.5 rounded">{fb.dept}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stars score={fb.score} />
                    <span className="text-[10px] text-[#7A8FA6]">{fb.date}</span>
                  </div>
                </div>
                <p className="text-[12px] rounded-lg px-3 py-2" style={{ background: bg, border: `1px solid ${border}`, color: '#374151' }}>
                  "{fb.comment}"
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
