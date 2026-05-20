'use client';
import React, { useState } from 'react';

type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface SopEntry {
  code: string;
  name: string;
  count: number;
  sla: number;
  pri: Priority;
}

const SOP_CATEGORIES: Record<string, SopEntry[]> = {
  mch: [
    { code: 'HFWD-MCH-001', name: 'Antenatal Care', count: 187, sla: 82, pri: 'HIGH' },
    { code: 'HFWD-MCH-002', name: 'Institutional Delivery', count: 143, sla: 91, pri: 'CRITICAL' },
    { code: 'HFWD-MCH-003', name: 'Post-Natal Care', count: 112, sla: 78, pri: 'HIGH' },
    { code: 'HFWD-MCH-004', name: 'Family Planning', count: 87, sla: 86, pri: 'MEDIUM' },
    { code: 'HFWD-MCH-005', name: 'Immunization', count: 61, sla: 94, pri: 'CRITICAL' },
    { code: 'HFWD-MCH-006', name: 'JSSK Entitlements', count: 34, sla: 76, pri: 'HIGH' },
  ],
  phc: [
    { code: 'HFWD-PHC-001', name: 'OPD Services', count: 198, sla: 74, pri: 'HIGH' },
    { code: 'HFWD-PHC-002', name: 'Essential Medicines', count: 167, sla: 69, pri: 'HIGH' },
    { code: 'HFWD-PHC-003', name: 'Diagnostic & Lab', count: 89, sla: 81, pri: 'MEDIUM' },
    { code: 'HFWD-PHC-004', name: 'Ambulance / 108', count: 57, sla: 96, pri: 'CRITICAL' },
    { code: 'HFWD-PHC-005', name: 'HWC Services', count: 43, sla: 88, pri: 'MEDIUM' },
    { code: 'HFWD-PHC-006', name: 'ASHA Incentives', count: 148, sla: 72, pri: 'MEDIUM' },
  ],
  hsp: [
    { code: 'HFWD-HSP-001', name: 'IPD Admission', count: 143, sla: 79, pri: 'CRITICAL' },
    { code: 'HFWD-HSP-002', name: 'Specialist Availability', count: 118, sla: 71, pri: 'HIGH' },
    { code: 'HFWD-HSP-003', name: 'Medical Negligence', count: 34, sla: 88, pri: 'CRITICAL' },
    { code: 'HFWD-HSP-004', name: 'Hospital Infrastructure', count: 89, sla: 83, pri: 'MEDIUM' },
    { code: 'HFWD-HSP-005', name: 'Blood Bank', count: 12, sla: 97, pri: 'CRITICAL' },
    { code: 'HFWD-HSP-007', name: 'Corruption Complaints', count: 28, sla: 91, pri: 'CRITICAL' },
  ],
  cdc: [
    { code: 'HFWD-CDC-001', name: 'Epidemic Outbreaks', count: 23, sla: 87, pri: 'CRITICAL' },
    { code: 'HFWD-CDC-002', name: 'Vector Control', count: 112, sla: 76, pri: 'HIGH' },
    { code: 'HFWD-CDC-003', name: 'TB/NTEP Treatment', count: 98, sla: 82, pri: 'HIGH' },
    { code: 'HFWD-CDC-004', name: 'HIV/ICTC Services', count: 45, sla: 89, pri: 'HIGH' },
    { code: 'HFWD-CDC-005', name: 'Leprosy/NTDs', count: 34, sla: 91, pri: 'MEDIUM' },
  ],
  abha: [
    { code: 'HFWD-ABHA-001', name: 'Ayushman Card Issues', count: 187, sla: 78, pri: 'HIGH' },
    { code: 'HFWD-ABHA-002', name: 'Claim Rejection', count: 143, sla: 74, pri: 'HIGH' },
    { code: 'HFWD-ABHA-003', name: 'Empanelled Hospital Fraud', count: 28, sla: 93, pri: 'CRITICAL' },
    { code: 'HFWD-ABHA-004', name: 'Mobile Health Van', count: 40, sla: 84, pri: 'MEDIUM' },
  ],
  other: [
    { code: 'HFWD-MHP-001', name: 'Mental Health Access', count: 78, sla: 81, pri: 'HIGH' },
    { code: 'HFWD-MHP-002', name: 'De-Addiction Services', count: 54, sla: 83, pri: 'HIGH' },
    { code: 'HFWD-MHP-003', name: 'Suicide Prevention', count: 9, sla: 98, pri: 'CRITICAL' },
    { code: 'HFWD-FSDA-001', name: 'Food Adulteration', count: 87, sla: 79, pri: 'HIGH' },
    { code: 'HFWD-FSDA-002', name: 'Spurious Medicines', count: 52, sla: 81, pri: 'HIGH' },
    { code: 'HFWD-HR-001', name: 'Staff Misconduct', count: 67, sla: 77, pri: 'HIGH' },
  ],
};

const TAB_LABELS: Record<string, string> = {
  mch: 'MCH',
  phc: 'Primary Care',
  hsp: 'Hospital',
  cdc: 'Disease Control',
  abha: 'Ayushman',
  other: 'Other',
};

const PRI_STYLE: Record<Priority, { bg: string; fg: string }> = {
  CRITICAL: { bg: '#FCEBEB', fg: '#a32d2d' },
  HIGH: { bg: '#FAEEDA', fg: '#854F0B' },
  MEDIUM: { bg: '#E6F1FB', fg: '#185FA5' },
  LOW: { bg: '#F1EFE8', fg: '#5F5E5A' },
};

function slaColor(v: number) { return v >= 85 ? '#16A34A' : v >= 75 ? '#D97706' : '#DC2626'; }

const WEEKS = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12','W13','W14','W15','W16','W17','W18','W19','W20','W21','W22','W23','W24','W25','W26','W27','W28','W29','W30'];

function TrendChart({ data }: { data: SopEntry[] }) {
  const base = data.reduce((s, d) => s + d.count, 0);
  const seed = data.reduce((s, d) => s + d.sla, 17);
  const trend = WEEKS.map((_, i) => Math.round(base * 0.7 + ((seed * (i + 1)) % (base * 0.6))));
  const resolved = trend.map(v => Math.round(v * 0.82));
  const allVals = [...trend, ...resolved];
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const W = 800, H = 160, PAD = 8;

  const pts = (arr: number[]) => arr.map((v, i) => {
    const x = PAD + (i / (arr.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / (max - min || 1)) * (H - PAD * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="trG1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E24B4A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#E24B4A" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="trG2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#639922" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#639922" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts(trend)} fill="none" stroke="#E24B4A" strokeWidth="2" strokeLinejoin="round" />
      <polyline points={pts(resolved)} fill="none" stroke="#639922" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function SecretarySOPPage() {
  const [activeTab, setActiveTab] = useState('mch');
  const data = SOP_CATEGORIES[activeTab];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">SOP Performance</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">
          SOP-wise complaint analysis and SLA compliance across Health &amp; Family Welfare
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {Object.entries(TAB_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`text-[11px] font-semibold px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
              activeTab === key
                ? 'bg-[#004B87] text-white border-[#004B87]'
                : 'bg-white text-[#7A8FA6] border-[#DDE3EE] hover:bg-[#F8FAFD]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* SOP list */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">SOP Complaints &amp; SLA Status</h2>
          </div>
          <div className="divide-y divide-[#F0F2F7]">
            {data.map(d => (
              <div key={d.code} className="flex items-start gap-3 px-4 py-3 hover:bg-[#F8FAFD] transition-colors cursor-pointer">
                <span className="text-[10px] text-[#185FA5] font-semibold min-w-[110px] mt-0.5">{d.code}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-[#0E1C2F] font-medium">{d.name}</div>
                  <div className="text-[10px] text-[#7A8FA6]">{d.count} complaints</div>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                  style={{ background: PRI_STYLE[d.pri].bg, color: PRI_STYLE[d.pri].fg }}
                >
                  {d.pri}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SLA progress bars */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">SLA Performance — Category</h2>
          </div>
          <div className="p-5 space-y-3">
            {data.map(d => (
              <div key={d.code}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#0E1C2F] font-medium">{d.name}</span>
                  <span className="font-bold" style={{ color: slaColor(d.sla) }}>{d.sla}%</span>
                </div>
                <div className="bg-[#F0F2F7] rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${d.sla}%`, background: slaColor(d.sla) }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resolution trend */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">Resolution Trend — 30 Days</h2>
        </div>
        <div className="p-5">
          <TrendChart data={data} />
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F0F2F7] text-[10px] text-[#7A8FA6]">
            <div className="flex items-center gap-1.5"><span className="w-8 h-0.5 rounded-full" style={{ background: '#E24B4A' }} />Received</div>
            <div className="flex items-center gap-1.5"><span className="w-8 h-0.5 rounded-full" style={{ background: '#639922' }} />Resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
