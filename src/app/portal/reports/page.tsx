'use client';
import React from 'react';
import { BarChart2 } from 'lucide-react';
import { MOCK_COMPLAINTS } from '@/data';

export default function ReportsPage() {
  const total = MOCK_COMPLAINTS.length;
  const resolved = MOCK_COMPLAINTS.filter(c => c.status === 'resolved').length;
  const breached = MOCK_COMPLAINTS.filter(c => c.slaStatus === 'breach').length;
  const escalated = MOCK_COMPLAINTS.filter(c => c.status === 'escalated').length;
  const onTimeRate = Math.round(((total - breached) / total) * 100);

  const deptBreakdown = MOCK_COMPLAINTS.reduce<Record<string, number>>((acc, c) => {
    acc[c.department] = (acc[c.department] ?? 0) + 1;
    return acc;
  }, {});

  const deptRows = Object.entries(deptBreakdown).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...Object.values(deptBreakdown));

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <BarChart2 size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">SLA Reports</h1>
          <p className="text-[12px] text-[#7A8FA6]">Performance analytics for your department</p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Complaints', value: total, color: '#1A56C4' },
          { label: 'SLA On-time Rate', value: `${onTimeRate}%`, color: '#16A34A' },
          { label: 'Resolved', value: resolved, color: '#16A34A' },
          { label: 'Escalated', value: escalated, color: '#7C3AED' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3.5 relative overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]" style={{ background: k.color }} />
            <div className="text-[10px] font-semibold text-[#7A8FA6] uppercase tracking-wide mb-1">{k.label}</div>
            <div className="text-[28px] font-bold text-[#0E1C2F]">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Department breakdown */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="px-5 py-4 border-b border-[#DDE3EE]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F]">Complaints by Department</h2>
        </div>
        <div className="p-5 space-y-3">
          {deptRows.map(([dept, count]) => (
            <div key={dept}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-[#0E1C2F]">{dept}</span>
                <span className="text-[12px] font-bold text-[#3D5068]">{count}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
