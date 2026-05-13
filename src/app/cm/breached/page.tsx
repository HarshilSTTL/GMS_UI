'use client';
import React from 'react';
import { Clock } from 'lucide-react';

const DEPTS = [
  { icon: '💧', name: 'Water Supply & Sanitation', sla: 69 },
  { icon: '🌽', name: 'Food & Civil Supplies',     sla: 74 },
  { icon: '🏡', name: 'Revenue & Land Records',    sla: 72 },
  { icon: '🛣', name: 'Roads & Buildings (PWD)',   sla: 76 },
];

const DISTS = [
  { name: 'Dahod',          div: 'East',        sla: 54 },
  { name: 'Chhota Udaipur', div: 'East',        sla: 58 },
  { name: 'Dang',           div: 'South',       sla: 61 },
  { name: 'Surat',          div: 'South',       sla: 62 },
  { name: 'Mahisagar',      div: 'East',        sla: 63 },
  { name: 'Narmada',        div: 'South',       sla: 64 },
  { name: 'Surendranagar',  div: 'Saurashtra',  sla: 65 },
  { name: 'Devgadh Baria',  div: 'East',        sla: 66 },
  { name: 'Panchmahal',     div: 'East',        sla: 67 },
  { name: 'Banaskantha',    div: 'North',       sla: 68 },
  { name: 'Water Supply',   div: 'South',       sla: 69 }, // Tapi
  { name: 'Patan',          div: 'North',       sla: 71 },
  { name: 'Kutch',          div: 'Kutch',       sla: 72 },
  { name: 'Aravalli',       div: 'North',       sla: 74 },
  { name: 'Botad',          div: 'Saurashtra',  sla: 75 },
].filter(d => d.sla < 75).sort((a, b) => a.sla - b.sla);

// Also include from HTML data districts with sla < 75
const ALL_BREACH_DISTS = [
  { name: 'Dahod',          div: 'East',        sla: 54 },
  { name: 'Chhota Udaipur', div: 'East',        sla: 58 },
  { name: 'Dang',           div: 'South',       sla: 61 },
  { name: 'Surat',          div: 'South',       sla: 62 },
  { name: 'Mahisagar',      div: 'East',        sla: 63 },
  { name: 'Narmada',        div: 'South',       sla: 64 },
  { name: 'Surendranagar',  div: 'Saurashtra',  sla: 65 },
  { name: 'Devgadh Baria',  div: 'East',        sla: 66 },
  { name: 'Panchmahal',     div: 'East',        sla: 67 },
  { name: 'Banaskantha',    div: 'North',       sla: 68 },
  { name: 'Tapi',           div: 'South',       sla: 69 },
  { name: 'Patan',          div: 'North',       sla: 71 },
  { name: 'Kutch',          div: 'Kutch',       sla: 72 },
  { name: 'Aravalli',       div: 'North',       sla: 74 },
];

export default function CMBreachedPage() {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <Clock size={20} className="text-red-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">SLA Breached</h1>
          <p className="text-[12px] text-[#7A8FA6]">Departments and districts below 75% SLA target</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Departments with SLA below 75% */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Departments with SLA below 75%</h2>
          </div>
          <div className="p-4 space-y-4">
            {DEPTS.map(d => (
              <div key={d.name}>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-semibold text-[#3D5068]">{d.icon} {d.name}</span>
                  <span className="font-bold text-red-600">{d.sla}%</span>
                </div>
                <div className="h-2 bg-[#F0F2F7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-red-500" style={{ width: `${d.sla}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Districts with SLA below 75% */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Districts with SLA below 75%</h2>
          </div>
          <div className="p-4 space-y-3">
            {ALL_BREACH_DISTS.map(d => {
              const color = d.sla < 65 ? '#DC2626' : '#D97706';
              return (
                <div key={d.name}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-[#3D5068]">{d.name} <span className="text-[9px] text-[#7A8FA6] font-normal">({d.div})</span></span>
                    <span className="font-bold" style={{ color }}>{d.sla}%</span>
                  </div>
                  <div className="h-1.5 bg-[#F0F2F7] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.sla}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
