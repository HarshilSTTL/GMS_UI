'use client';
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const CRITICAL_ITEMS = [
  { dept: 'Health',    dist: 'Surendranagar', code: 'HFWD-CDC-001', issue: 'Dengue outbreak — 23 cases in 3 villages',           age: 8,  lv: 'L3' },
  { dept: 'Health',    dist: 'Kutch',         code: 'HFWD-HSP-003', issue: 'Medical negligence death — inquiry pending',          age: 11, lv: 'L3' },
  { dept: 'Water',     dist: 'Dang',          code: 'GWSS-001',     issue: 'Acute water shortage — 6 tribal villages',            age: 7,  lv: 'L3' },
  { dept: 'Health',    dist: 'Dahod',         code: 'HFWD-MCH-002', issue: 'No specialist doctor for 30 days',                   age: 9,  lv: 'L3' },
  { dept: 'Revenue',   dist: 'Surat',         code: 'REV-021',      issue: '250 mutations pending more than 90 days',             age: 14, lv: 'L3' },
  { dept: 'Food/PDS',  dist: 'Banaskantha',   code: 'FCS-014',      issue: 'FPS dealer fraud — 340 families affected',            age: 6,  lv: 'L2' },
  { dept: 'Water',     dist: 'Narmada',       code: 'GWSS-018',     issue: 'Pipeline collapse — tribal hamlet cut off',           age: 10, lv: 'L3' },
  { dept: 'Health',    dist: 'Chhota Udaipur',code: 'HFWD-PHC-002', issue: '14 essential medicines out of stock',                 age: 5,  lv: 'L2' },
  { dept: 'Roads/PWD', dist: 'Sabarkantha',   code: 'PWD-047',      issue: 'Bridge closure — 4 villages inaccessible',           age: 12, lv: 'L3' },
  { dept: 'Agriculture',dist:'Patan',         code: 'AGRI-033',     issue: 'Crop compensation unpaid — 180 farmers',              age: 21, lv: 'L2' },
];

export default function CMCriticalPage() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(code: string) {
    setSelected(prev => prev.includes(code) ? prev.filter(x => x !== code) : [...prev, code]);
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Critical Complaints</h1>
          <p className="text-[12px] text-[#7A8FA6]">{CRITICAL_ITEMS.length} critical escalations requiring CM-level awareness</p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-[12px] p-3.5 mb-5 flex gap-3">
        <span className="text-lg">🚨</span>
        <div>
          <p className="text-[12px] font-bold text-red-800">Live critical escalations — all departments and districts</p>
          <p className="text-[11px] text-red-700">These complaints have exceeded SLA, have high public impact, or have been flagged for CM-level intervention.</p>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-[12px] px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-blue-800">{selected.length} selected</span>
          <div className="flex gap-2">
            <button onClick={() => { toast.success(`Escalated ${selected.length} complaint(s)`); setSelected([]); }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-600 text-white hover:bg-red-700 transition-all">
              Escalate to Secretary
            </button>
            <button onClick={() => { toast.success(`Directive issued for ${selected.length} complaint(s)`); setSelected([]); }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
              Issue Directive
            </button>
            <button onClick={() => setSelected([])} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-[#DDE3EE] text-[#7A8FA6]">Clear</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead className="bg-[#F8FAFD]">
              <tr>
                <th className="px-3 py-2.5 w-8 border-b border-[#DDE3EE]" />
                {['Department', 'District', 'Code', 'Issue', 'Age', 'Level', 'Status'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[9px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRITICAL_ITEMS.map((c, i) => {
                const sel = selected.includes(c.code);
                return (
                  <tr key={c.code}
                    onClick={() => toggle(c.code)}
                    className={`cursor-pointer border-l-2 border-l-red-500 ${i < CRITICAL_ITEMS.length - 1 ? 'border-b border-[#F0F2F7]' : ''} ${sel ? 'bg-blue-50/40' : 'hover:bg-[#F8FAFD]'}`}>
                    <td className="px-3 py-2.5 text-center">
                      <div className={`w-3.5 h-3.5 rounded border-2 inline-flex items-center justify-center ${sel ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {sel && <span className="text-white text-[7px]">✓</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-[#3D5068]">{c.dept}</td>
                    <td className="px-3 py-2.5 font-semibold text-[#0E1C2F] whitespace-nowrap">{c.dist}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-blue-600 whitespace-nowrap">{c.code}</td>
                    <td className="px-3 py-2.5 text-[#3D5068]">{c.issue}</td>
                    <td className="px-3 py-2.5 font-bold whitespace-nowrap" style={{ color: c.age > 10 ? '#DC2626' : '#D97706' }}>{c.age}d</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: c.lv === 'L3' ? '#FEF2F2' : '#FFFBEB', color: c.lv === 'L3' ? '#DC2626' : '#D97706' }}>{c.lv}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">OPEN</span>
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
