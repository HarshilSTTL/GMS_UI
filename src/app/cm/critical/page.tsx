'use client';
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const CRITICAL_COMPLAINTS = [
  { id: 'GVM-2025-09121', citizen: 'Ramesh Bhai', district: 'Surat', dept: 'Roads & B', category: 'Road Cave-in', days: 18, sla_breached: true, escalated: true, priority: 'P1', description: 'Major road cave-in near Surat textile market affecting 500+ daily commuters. No repair crew deployed in 18 days.' },
  { id: 'GVM-2025-08934', citizen: 'Fatima Sheikh', district: 'Ahmedabad', dept: 'Health (CDHO)', category: 'Hospital Water Supply', days: 14, sla_breached: true, escalated: true, priority: 'P1', description: 'Civil hospital Ward 3 running without clean water for 14 days. Patient safety risk. Multiple complaints filed.' },
  { id: 'GVM-2025-09044', citizen: 'Suresh Tadvi', district: 'Vadodara Rural', dept: 'GWSSB', category: 'No Water Supply', days: 12, sla_breached: true, escalated: false, priority: 'P1', description: 'Entire village of 3,200 residents with no piped water for 12 days. Villagers relying on contaminated pond.' },
  { id: 'GVM-2025-08712', citizen: 'Geeta Parmar', district: 'Rajkot', dept: 'AMC', category: 'Raw Sewage Overflow', days: 9, sla_breached: true, escalated: true, priority: 'P1', description: 'Sewage overflow on residential street. Health hazard. Multiple affected residents filed complaints.' },
  { id: 'GVM-2025-09201', citizen: 'Abdul Karim', district: 'Surat (East)', dept: 'Electricity', category: 'No Power – 4 Days', days: 4, sla_breached: false, escalated: false, priority: 'P2', description: 'Industrial estate of 14 units without power for 4 days. DGVCL contractor unresponsive.' },
  { id: 'GVM-2025-08981', citizen: 'Hetal Patel', district: 'Gandhinagar', dept: 'Revenue', category: 'Land Record Fraud', days: 22, sla_breached: true, escalated: true, priority: 'P2', description: 'Fraudulent mutation in land records. Court deadline in 3 days. Revenue officer not responding.' },
];

export default function CMCriticalPage() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggleSelect(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleEscalate() {
    if (selected.length === 0) return toast.error('Select complaints to escalate');
    toast.success(`${selected.length} complaint(s) escalated to Secretary-level`);
    setSelected([]);
  }

  function handleDirective() {
    if (selected.length === 0) return toast.error('Select complaints first');
    toast.success(`Emergency directive issued for ${selected.length} complaint(s)`);
    setSelected([]);
  }

  const p1Count = CRITICAL_COMPLAINTS.filter(c => c.priority === 'P1').length;

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Critical Complaints</h1>
          <p className="text-[12px] text-[#7A8FA6]">{CRITICAL_COMPLAINTS.length} critical · {p1Count} P1 priority · Require immediate attention</p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-[12px] p-3.5 mb-5 flex gap-3">
        <span className="text-lg">🚨</span>
        <div>
          <p className="text-[12px] font-bold text-red-800">These complaints require your direct intervention</p>
          <p className="text-[11px] text-red-700">All listed complaints have either exceeded SLA significantly, have a high public impact, or have been flagged by field officers as requiring CM-level attention.</p>
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-[12px] px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-blue-800">{selected.length} selected</span>
          <div className="flex gap-2">
            <button onClick={handleEscalate} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-600 text-white hover:bg-red-700 transition-all">
              Escalate to Secretary
            </button>
            <button onClick={handleDirective} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
              Issue Directive
            </button>
            <button onClick={() => setSelected([])} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-[#DDE3EE] text-[#7A8FA6] hover:bg-gray-50 transition-all">
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {CRITICAL_COMPLAINTS.map(c => {
          const isSelected = selected.includes(c.id);
          const daysColor = c.days >= 14 ? '#DC2626' : c.days >= 7 ? '#D97706' : '#0E1C2F';
          return (
            <div
              key={c.id}
              onClick={() => toggleSelect(c.id)}
              className={`bg-white rounded-[14px] p-4 border-2 cursor-pointer transition-all shadow-[0_1px_3px_rgba(14,28,47,0.06)] ${isSelected ? 'border-blue-400 bg-blue-50/30' : 'border-[#DDE3EE] hover:border-[#BCC9D9]'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                  {isSelected && <span className="text-white text-[8px]">✓</span>}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono text-[#7A8FA6]">{c.id}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${c.priority === 'P1' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{c.priority}</span>
                    {c.sla_breached && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">SLA Breached</span>}
                    {c.escalated && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">Escalated</span>}
                    <span className="text-[10px] text-[#7A8FA6] bg-[#F0F4FA] px-1.5 py-0.5 rounded">{c.dept}</span>
                    <span className="text-[10px] text-[#7A8FA6]">{c.district}</span>
                  </div>
                  <h3 className="text-[13px] font-bold text-[#0E1C2F] mb-1">{c.category}</h3>
                  <p className="text-[11px] text-[#3D5068] mb-2">{c.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#7A8FA6]">Citizen: <span className="font-semibold text-[#3D5068]">{c.citizen}</span></span>
                    <span className="text-[12px] font-bold" style={{ color: daysColor }}>{c.days} days open</span>
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
