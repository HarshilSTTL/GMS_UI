'use client';
import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

const MONTHLY_DATA = [
  { month: 'Nov', filed: 8420, resolved: 7210, sla: 81, avg_days: 3.8 },
  { month: 'Dec', filed: 7890, resolved: 7540, sla: 83, avg_days: 3.5 },
  { month: 'Jan', filed: 9120, resolved: 8210, sla: 79, avg_days: 4.1 },
  { month: 'Feb', filed: 8640, resolved: 8390, sla: 84, avg_days: 3.6 },
  { month: 'Mar', filed: 10240, resolved: 9120, sla: 82, avg_days: 3.9 },
  { month: 'Apr', filed: 11320, resolved: 9840, sla: 77, avg_days: 4.3 },
  { month: 'May', filed: 12480, resolved: 10210, sla: 75, avg_days: 4.6 },
];

const CATEGORY_TREND = [
  { category: 'Water Supply', prev: 2840, curr: 3120, change: 9.8 },
  { category: 'Roads & Infrastructure', prev: 3210, curr: 4020, change: 25.2 },
  { category: 'Sanitation', prev: 1890, curr: 2140, change: 13.2 },
  { category: 'Electricity', prev: 1420, curr: 1380, change: -2.8 },
  { category: 'Revenue / Land', prev: 980, curr: 820, change: -16.3 },
  { category: 'Education', prev: 540, curr: 490, change: -9.3 },
  { category: 'Health', prev: 1240, curr: 1560, change: 25.8 },
];

const AI_INSIGHTS = [
  { type: 'warning', icon: '⚠️', title: 'Road complaints spike — Pre-monsoon pattern', body: 'Roads & Infrastructure complaints up 25.2% vs last month. Historical data shows this spikes 40% in June-July. Pre-emptive repair drive recommended.' },
  { type: 'info', icon: '📈', title: 'Health complaints rising in Surat district', body: 'Health-related complaints in Surat up 31% week-over-week. Correlates with seasonal flu patterns. CDHO should be notified.' },
  { type: 'success', icon: '✅', title: 'Revenue dept showing consistent improvement', body: 'Revenue complaints down 16.3% MoM. SLA adherence at 91%. Officer training program showing measurable results.' },
];

type ChartType = 'volume' | 'sla' | 'avgdays';

export default function CMTrendsPage() {
  const [metric, setMetric] = useState<ChartType>('volume');

  const maxFiled = Math.max(...MONTHLY_DATA.map(m => m.filed));
  const maxResolved = Math.max(...MONTHLY_DATA.map(m => m.resolved));
  const maxVal = Math.max(maxFiled, maxResolved);

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <TrendingUp size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Trend Intelligence</h1>
          <p className="text-[12px] text-[#7A8FA6]">7-month analysis · AI-powered pattern detection</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-2 mb-5">
        {AI_INSIGHTS.map((insight, i) => (
          <div key={i} className={`rounded-[12px] p-3.5 border flex gap-3 ${insight.type === 'warning' ? 'bg-amber-50 border-amber-200' : insight.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
            <span className="text-lg flex-shrink-0">{insight.icon}</span>
            <div>
              <p className={`text-[12px] font-bold mb-0.5 ${insight.type === 'warning' ? 'text-amber-800' : insight.type === 'success' ? 'text-green-800' : 'text-blue-800'}`}>{insight.title}</p>
              <p className={`text-[11px] ${insight.type === 'warning' ? 'text-amber-700' : insight.type === 'success' ? 'text-green-700' : 'text-blue-700'}`}>{insight.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Volume Chart */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 mb-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[12px] font-bold text-[#0E1C2F]">Monthly Volume Trend</p>
          <div className="flex gap-3 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-blue-400 inline-block" /> Filed</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-green-400 inline-block" /> Resolved</span>
          </div>
        </div>
        <div className="flex items-end gap-2 h-28">
          {MONTHLY_DATA.map((m, i) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex items-end gap-0.5 justify-center" style={{ height: '80px' }}>
                <div className="w-[45%] rounded-t" style={{ height: `${(m.filed / maxVal) * 80}px`, background: '#93C5FD' }} title={`Filed: ${m.filed}`} />
                <div className="w-[45%] rounded-t" style={{ height: `${(m.resolved / maxVal) * 80}px`, background: '#86EFAC' }} title={`Resolved: ${m.resolved}`} />
              </div>
              <span className="text-[9px] text-[#7A8FA6]">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* SLA Trend */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <p className="text-[12px] font-bold text-[#0E1C2F] mb-3">SLA Adherence %</p>
          <div className="flex items-end gap-1.5 h-20">
            {MONTHLY_DATA.map((m, i) => {
              const color = m.sla >= 85 ? '#16A34A' : m.sla >= 70 ? '#D97706' : '#DC2626';
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8px] font-bold" style={{ color }}>{m.sla}</span>
                  <div className="w-full rounded-t" style={{ height: `${(m.sla / 100) * 56}px`, background: color + '60' }} />
                  <span className="text-[8px] text-[#7A8FA6]">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Avg Resolution Days */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <p className="text-[12px] font-bold text-[#0E1C2F] mb-3">Avg. Resolution Days</p>
          <div className="flex items-end gap-1.5 h-20">
            {MONTHLY_DATA.map((m) => {
              const color = m.avg_days <= 3.5 ? '#16A34A' : m.avg_days <= 4.5 ? '#D97706' : '#DC2626';
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8px] font-bold" style={{ color }}>{m.avg_days}</span>
                  <div className="w-full rounded-t" style={{ height: `${(m.avg_days / 6) * 56}px`, background: color + '60' }} />
                  <span className="text-[8px] text-[#7A8FA6]">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Trend */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="px-4 py-3 border-b border-[#DDE3EE] bg-[#F8FAFD]">
          <p className="text-[12px] font-bold text-[#0E1C2F]">Category MoM Change</p>
        </div>
        <div className="divide-y divide-[#DDE3EE]">
          {CATEGORY_TREND.map(cat => {
            const isUp = cat.change > 0;
            return (
              <div key={cat.category} className="flex items-center px-4 py-3 gap-3">
                <div className="flex-1">
                  <p className="text-[12px] font-semibold text-[#0E1C2F]">{cat.category}</p>
                  <p className="text-[10px] text-[#7A8FA6]">{cat.prev.toLocaleString()} → {cat.curr.toLocaleString()}</p>
                </div>
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(Math.abs(cat.change) * 2, 100)}%`, background: isUp ? '#DC2626' : '#16A34A' }} />
                </div>
                <span className={`text-[12px] font-bold w-14 text-right ${isUp ? 'text-red-600' : 'text-green-600'}`}>
                  {isUp ? '▲' : '▼'} {Math.abs(cat.change)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
