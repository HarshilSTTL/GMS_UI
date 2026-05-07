'use client';
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';

const BREACHED = [
  { id: 'GVM-2025-08121', dept: 'Roads & B', district: 'Surat', category: 'Pothole Repair', assigned: 'Pooja Desai', sla_limit: 5, days_open: 18, priority: 'high' },
  { id: 'GVM-2025-07934', dept: 'Health (CDHO)', district: 'Ahmedabad', category: 'Sanitation', assigned: 'Meena Kapoor', sla_limit: 3, days_open: 14, priority: 'high' },
  { id: 'GVM-2025-08044', dept: 'AMC', district: 'Ahmedabad', category: 'Street Light', assigned: 'Kiran Shah', sla_limit: 3, days_open: 12, priority: 'medium' },
  { id: 'GVM-2025-07712', dept: 'GWSSB', district: 'Vadodara', category: 'Water Supply', assigned: 'Ravi Varma', sla_limit: 5, days_open: 11, priority: 'high' },
  { id: 'GVM-2025-08201', dept: 'Roads & B', district: 'Rajkot', category: 'Road Damage', assigned: 'Unassigned', sla_limit: 5, days_open: 10, priority: 'medium' },
  { id: 'GVM-2025-07981', dept: 'AMC', district: 'Surat (East)', category: 'Garbage Collection', assigned: 'Anita Sharma', sla_limit: 2, days_open: 9, priority: 'medium' },
  { id: 'GVM-2025-08341', dept: 'DGVCL', district: 'Gandhinagar', category: 'Power Outage', assigned: 'Dev Patel', sla_limit: 2, days_open: 7, priority: 'low' },
  { id: 'GVM-2025-08412', dept: 'Revenue', district: 'Mehsana', category: 'Land Record', assigned: 'Sonal Mehta', sla_limit: 7, days_open: 7, priority: 'low' },
  { id: 'GVM-2025-08534', dept: 'Roads & B', district: 'Vadodara Rural', category: 'Bridge Damage', assigned: 'Pooja Desai', sla_limit: 5, days_open: 6, priority: 'medium' },
  { id: 'GVM-2025-08621', dept: 'GWSSB', district: 'Surat', category: 'Pipe Leak', assigned: 'Ravi Varma', sla_limit: 3, days_open: 6, priority: 'low' },
];

const DEPT_BREACH_SUMMARY = [
  { dept: 'Roads & B', count: 521, pct: 37 },
  { dept: 'AMC', count: 312, pct: 17 },
  { dept: 'Health (CDHO)', count: 178, pct: 28 },
  { dept: 'GWSSB', count: 87, pct: 10 },
  { dept: 'DGVCL', count: 41, pct: 5 },
  { dept: 'Revenue', count: 23, pct: 3 },
];

export default function CMBreachedPage() {
  const [sortBy, setSortBy] = useState<'days' | 'dept'>('days');
  const sorted = [...BREACHED].sort((a, b) => {
    if (sortBy === 'days') return b.days_open - a.days_open;
    return a.dept.localeCompare(b.dept);
  });

  const totalBreached = DEPT_BREACH_SUMMARY.reduce((s, d) => s + d.count, 0);

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <Clock size={20} className="text-red-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">SLA Breached</h1>
          <p className="text-[12px] text-[#7A8FA6]">{totalBreached.toLocaleString()} total SLA breaches across all departments</p>
        </div>
      </div>

      {/* Dept Breach Summary */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 mb-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
        <p className="text-[12px] font-bold text-[#0E1C2F] mb-3">SLA Breach by Department</p>
        <div className="space-y-2.5">
          {DEPT_BREACH_SUMMARY.map(d => (
            <div key={d.dept} className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-[#3D5068] w-28 flex-shrink-0">{d.dept}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-red-400" style={{ width: `${(d.count / DEPT_BREACH_SUMMARY[0].count) * 100}%` }} />
              </div>
              <span className="text-[11px] font-bold text-red-600 w-10 text-right">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent breaches table */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-bold text-[#0E1C2F]">Recent SLA Breaches</p>
        <div className="flex gap-2">
          <span className="text-[11px] text-[#7A8FA6]">Sort:</span>
          {(['days', 'dept'] as const).map(k => (
            <button key={k} onClick={() => setSortBy(k)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${sortBy === k ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-[#DDE3EE] text-[#3D5068]'}`}>
              {k === 'days' ? 'Days Open' : 'Department'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['Token', 'Category', 'Department', 'District', 'Assigned To', 'SLA Limit', 'Days Open', 'Action'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => {
                const overdue = c.days_open - c.sla_limit;
                return (
                  <tr key={c.id} className={i !== sorted.length - 1 ? 'border-b border-[#DDE3EE]' : ''}>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-[#7A8FA6]">{c.id.slice(-5)}</td>
                    <td className="px-3 py-2.5 font-semibold text-[#0E1C2F] whitespace-nowrap">{c.category}</td>
                    <td className="px-3 py-2.5 text-[#3D5068]">{c.dept}</td>
                    <td className="px-3 py-2.5 text-[#3D5068]">{c.district}</td>
                    <td className="px-3 py-2.5">
                      <span className={c.assigned === 'Unassigned' ? 'text-red-500 font-semibold' : 'text-[#3D5068]'}>{c.assigned}</span>
                    </td>
                    <td className="px-3 py-2.5 text-[#3D5068]">{c.sla_limit}d</td>
                    <td className="px-3 py-2.5">
                      <div>
                        <span className="text-red-600 font-bold">{c.days_open}d</span>
                        <span className="text-[10px] text-red-400 ml-1">(+{overdue}d)</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => toast.success(`Escalated ${c.id.slice(-5)} to Secretary`)}
                        className="px-2 py-1 rounded text-[10px] font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all whitespace-nowrap"
                      >
                        Escalate
                      </button>
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
