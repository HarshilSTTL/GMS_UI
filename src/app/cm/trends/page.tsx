'use client';
import React from 'react';

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

const DEPTS_TREND = [
  { name: 'Health',   color: '#3A8FE8', data: [2100,2200,2350,2400,2500,2600,2700,2750,2800,2820,2840,2847] },
  { name: 'Education',color: '#28C880', data: [1900,2000,2050,2100,2150,2200,2250,2280,2310,2330,2340,2341] },
  { name: 'Revenue',  color: '#F0A030', data: [2400,2500,2700,2800,2900,2950,3000,3050,3080,3100,3110,3120] },
  { name: 'PWD',      color: '#C9A84C', data: [1500,1600,1650,1700,1750,1780,1800,1830,1850,1870,1880,1890] },
  { name: 'Water',    color: '#00B4B4', data: [1700,1800,1900,2000,2050,2080,2100,2130,2160,2190,2200,2210] },
];

const SLA_TREND = [82,81,80,79,78,76,77,76,77,78,78,78];
const INTAKE    = [14200,14800,15400,15900,16200,16800,17200,17600,17900,18100,18300,18492];
const RESOLVED  = INTAKE.map(v => Math.round(v * 0.88));

const SEASONAL = [
  { name: 'Health',    color: '#3A8FE8', data: [2100,2000,2200,2400,2600,2800,3000,2900,2700,2500,2400,2300] },
  { name: 'Revenue',   color: '#F0A030', data: [2200,2400,2600,2800,2600,2400,2200,2300,2500,2700,2800,2900] },
  { name: 'Water',     color: '#00B4B4', data: [1400,1500,1800,2200,2400,2600,2800,2700,2400,2100,1900,1700] },
  { name: 'Education', color: '#28C880', data: [1800,1900,2000,1200,800,700,1800,2100,2200,2300,2200,2000] },
  { name: 'Roads',     color: '#C9A84C', data: [1200,1100,1100,1200,1300,1400,1600,1900,2100,1800,1500,1300] },
];

function MultiLineChart({ series, height = 150 }: { series: { name: string; color: string; data: number[] }[]; height?: number }) {
  const W = 500, H = height, PAD = 10;
  const allVals = series.flatMap(s => s.data);
  const min = Math.min(...allVals), max = Math.max(...allVals);
  const toY = (v: number) => H - PAD - ((v - min) / (max - min || 1)) * (H - PAD * 2);
  const toX = (i: number) => PAD + (i / (MONTHS.length - 1)) * (W - PAD * 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      {series.map(s => {
        const pts = s.data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
        return <polyline key={s.name} points={pts} fill="none" stroke={s.color} strokeWidth="1.8" strokeLinejoin="round" />;
      })}
    </svg>
  );
}

function SLALineChart() {
  const W = 500, H = 110, PAD = 10;
  const min = 70, max = 95;
  const toY = (v: number) => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
  const toX = (i: number) => PAD + (i / (MONTHS.length - 1)) * (W - PAD * 2);
  const slaPts = SLA_TREND.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const fillPts = `${PAD},${H - PAD} ${slaPts} ${W - PAD},${H - PAD}`;
  const targetY = toY(85);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 110 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="slaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A8FE8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3A8FE8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill="url(#slaGrad)" />
      <line x1={PAD} y1={targetY} x2={W - PAD} y2={targetY} stroke="#16A34A" strokeWidth="1.5" strokeDasharray="5,4" />
      <polyline points={slaPts} fill="none" stroke="#3A8FE8" strokeWidth="2" strokeLinejoin="round" />
      {SLA_TREND.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill="#3A8FE8" />)}
    </svg>
  );
}

export default function CMTrendsPage() {
  const maxIntake = Math.max(...INTAKE);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">Trend Intelligence</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">12-month patterns and performance trajectories · AI-powered analysis</p>
      </div>

      {/* Multi-dept trend */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 mb-4 shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-bold text-[#0E1C2F]">12-Month Complaint Volume — Top 5 Departments</p>
          <div className="flex items-center gap-3 flex-wrap">
            {DEPTS_TREND.map(s => (
              <span key={s.name} className="flex items-center gap-1.5 text-[10px] text-[#3D5068]">
                <span className="w-3 h-0.5 rounded inline-block" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>
        <MultiLineChart series={DEPTS_TREND} height={160} />
        <div className="flex justify-between mt-1 px-1">
          {MONTHS.map((m, i) => <span key={i} className="text-[8px] text-[#7A8FA6]">{m}</span>)}
        </div>
      </div>

      {/* SLA trend + Intake vs resolution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* SLA trend */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-bold text-[#0E1C2F]">SLA Adherence Trend vs 85% Target</p>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block" />SLA</span>
              <span className="flex items-center gap-1.5"><span className="w-3 border-t-2 border-dashed border-green-500 inline-block" />85% target</span>
            </div>
          </div>
          <SLALineChart />
          <div className="flex justify-between mt-1 px-1">
            {MONTHS.map((m, i) => <span key={i} className="text-[8px] text-[#7A8FA6]">{m}</span>)}
          </div>
        </div>

        {/* Intake vs resolution */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-bold text-[#0E1C2F]">Intake vs Resolution — Monthly</p>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm inline-block" style={{ background: 'rgba(232,64,64,0.6)' }} />Received</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm inline-block" style={{ background: 'rgba(40,200,128,0.7)' }} />Resolved</span>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-28">
            {MONTHS.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full flex items-end justify-center gap-0.5" style={{ height: '80px' }}>
                  <div className="w-[45%] rounded-t" style={{ height: `${(INTAKE[i] / maxIntake) * 80}px`, background: 'rgba(232,64,64,0.6)' }} title={`Filed: ${INTAKE[i]}`} />
                  <div className="w-[45%] rounded-t" style={{ height: `${(RESOLVED[i] / maxIntake) * 80}px`, background: 'rgba(40,200,128,0.7)' }} title={`Resolved: ${RESOLVED[i]}`} />
                </div>
                <span className="text-[8px] text-[#7A8FA6]">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seasonal patterns */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-bold text-[#0E1C2F]">Seasonal Patterns — Complaints by Month and Category</p>
          <div className="flex items-center gap-3 flex-wrap">
            {SEASONAL.map(s => (
              <span key={s.name} className="flex items-center gap-1.5 text-[10px] text-[#3D5068]">
                <span className="w-3 h-0.5 rounded inline-block" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>
        <MultiLineChart series={SEASONAL} height={130} />
        <div className="flex justify-between mt-1 px-1">
          {MONTHS.map((m, i) => <span key={i} className="text-[8px] text-[#7A8FA6]">{m}</span>)}
        </div>
      </div>
    </div>
  );
}
