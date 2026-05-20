'use client';
import React from 'react';
import { KPICard } from '@/components/gms/KPICard';
import { KPIData } from '@/types';

const ESC_KPI: KPIData[] = [
  { label: 'L1 Escalations', value: '127', trend: 'THO → CDHO', trendType: 'neutral', accentColor: '#185FA5' },
  { label: 'L2 Escalations', value: '41', trend: '▲ 8 this week', trendType: 'down', accentColor: '#BA7517' },
  { label: 'L3 Escalations', value: '15', trend: 'Needs Secretary action', trendType: 'down', accentColor: '#E24B4A' },
  { label: 'Avg Escalation Age', value: '6.2d', trend: 'Above SLA', trendType: 'warn', accentColor: '#E24B4A' },
];

const L3_ESCALATIONS = [
  { icon: '🔴', bg: '#FCEBEB', title: 'Dengue outbreak — Surendranagar (3 villages)', sub: 'HFWD-CDC-001  •  CDHO not responding  •  L3', age: '8d', ageColor: '#a32d2d' },
  { icon: '🔴', bg: '#FCEBEB', title: 'Medical negligence death — Kutch District Hospital', sub: 'HFWD-HSP-003  •  Inquiry pending  •  L3', age: '11d', ageColor: '#a32d2d' },
  { icon: '🔴', bg: '#FCEBEB', title: 'PMJAY fraud — 3 hospitals in Surat zone', sub: 'HFWD-ABHA-003  •  SHA investigation open  •  L3', age: '7d', ageColor: '#a32d2d' },
  { icon: '🟡', bg: '#FAEEDA', title: '108 Ambulance SLA breach — 6 talukas in Sabarkantha', sub: 'HFWD-PHC-004  •  EMRI coordination needed  •  L2', age: '5d', ageColor: '#854F0B' },
  { icon: '🟡', bg: '#FAEEDA', title: 'ASHA incentive backlog — Banaskantha 47 ASHAs', sub: 'HFWD-PHC-006  •  Finance approval pending  •  L2', age: '14d', ageColor: '#854F0B' },
  { icon: '🟡', bg: '#FAEEDA', title: 'Drug shortage — Essential medicines out of stock Morbi', sub: 'HFWD-PHC-002  •  GMSC supply delayed  •  L2', age: '4d', ageColor: '#854F0B' },
];

const ESC_BY_CATEGORY = [
  { name: 'Hospital Svc', val: 54, color: '#E24B4A' },
  { name: 'MCH', val: 38, color: '#D85A30' },
  { name: 'Primary Care', val: 32, color: '#EF9F27' },
  { name: 'PMJAY', val: 28, color: '#BA7517' },
  { name: 'Disease Control', val: 19, color: '#378ADD' },
  { name: 'Mental Health', val: 14, color: '#7F77DD' },
  { name: 'FSDA', val: 11, color: '#888780' },
  { name: 'HR', val: 9, color: '#5F5E5A' },
];

const DOP_COMPLIANCE = [
  { label: 'DOP-01: Critical complaint acknowledgement <30min', val: 94, color: '#639922' },
  { label: 'DOP-02: Routine complaint first response <24hr', val: 87, color: '#639922' },
  { label: 'DOP-02: Fact-finding within Day 2-3', val: 71, color: '#BA7517' },
  { label: 'DOP-02: Closure report quality (CDHO check)', val: 68, color: '#BA7517' },
  { label: 'DOP-03: L1 escalation triggered on SLA+1', val: 58, color: '#E24B4A' },
  { label: 'DOP-04: Feedback loop completion rate', val: 76, color: '#BA7517' },
];

const maxEsc = Math.max(...ESC_BY_CATEGORY.map(e => e.val));

export default function SecretaryEscalationPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">Escalation Radar</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">
          L2/L3 escalations requiring Secretary action &amp; DOP compliance tracking
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {ESC_KPI.map((k, i) => <KPICard key={i} data={k} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* L3 Escalations list */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">L3 Escalations — Secretary Radar</h2>
          </div>
          <div className="divide-y divide-[#F0F2F7]">
            {L3_ESCALATIONS.map((e, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[13px]" style={{ background: e.bg }}>
                  {e.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-[#0E1C2F] font-medium leading-snug">{e.title}</div>
                  <div className="text-[10px] text-[#7A8FA6] mt-0.5">{e.sub}</div>
                </div>
                <span className="text-[11px] font-bold flex-shrink-0" style={{ color: e.ageColor }}>{e.age}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation by SOP category */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Escalation by SOP Category</h2>
          </div>
          <div className="p-5 space-y-2.5">
            {ESC_BY_CATEGORY.map(e => (
              <div key={e.name} className="flex items-center gap-3">
                <span className="text-[11px] text-[#0E1C2F] w-28 flex-shrink-0 font-medium">{e.name}</span>
                <div className="flex-1 bg-[#F0F2F7] rounded-full h-2.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(e.val / maxEsc) * 100}%`, background: e.color }} />
                </div>
                <span className="text-[11px] font-bold w-6 text-right flex-shrink-0" style={{ color: e.color }}>{e.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DOP compliance */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">DOP Compliance — Officer-level Tracking</h2>
        </div>
        <div className="p-5 space-y-3.5">
          {DOP_COMPLIANCE.map(d => (
            <div key={d.label}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#0E1C2F]">{d.label}</span>
                <span className="font-bold" style={{ color: d.color }}>{d.val}%</span>
              </div>
              <div className="bg-[#F0F2F7] rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${d.val}%`, background: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
