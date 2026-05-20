'use client';
import React from 'react';

const WEEKS = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'];
const INTAKE = [1840,1920,2100,1980,2240,2190,2380,2290,2510,2680,2720,2847];
const RESOLVED = INTAKE.map(v => Math.round(v * 0.85));

const HEAT_CATS = ['MCH','PHC','Hospital','PMJAY','CDC','Mental','FSDA','HR'];
const HEAT_DISTS = ['Ahmedabad','Surat','Rajkot','Vadodara','Gandhinagar','Bhavnagar','Banaskantha','Kutch','Sabarkantha','Surendranagar'];
const HEAT_VALS = [
  [78,52,64,41,23,15,38,29],
  [55,81,72,60,18,31,44,12],
  [42,63,45,77,35,28,51,19],
  [30,38,55,48,61,22,33,41],
  [15,27,38,29,44,70,18,36],
  [62,44,31,53,27,18,47,55],
  [49,71,58,42,39,26,62,33],
  [35,58,44,36,52,41,29,58],
  [28,43,37,61,45,33,54,24],
  [67,88,52,44,73,38,61,47],
];

const LANG_DATA = [
  { label: 'Gujarati', pct: 58, color: '#1D9E75' },
  { label: 'Hindi', pct: 24, color: '#378ADD' },
  { label: 'English', pct: 18, color: '#888780' },
];

const AI_DATA = [
  { label: 'Auto-assigned (≥85%)', val: 92, color: '#639922' },
  { label: 'Human verify (60–84%)', val: 6, color: '#BA7517' },
  { label: 'Manual queue (<60%)', val: 2, color: '#E24B4A' },
];

const MISCLASS = [
  { code: 'HFWD-PHC-001', name: 'OPD vs Hospital Admission overlap', count: '41 cases' },
  { code: 'HFWD-CDC-001', name: 'Outbreak vs Food Safety confusion', count: '27 cases' },
  { code: 'HFWD-HR-001', name: 'Staff misconduct vs Negligence', count: '19 cases' },
];

function heatColor(v: number, max: number): { bg: string; fg: string } {
  const pct = v / max;
  if (pct > 0.8) return { bg: '#A32D2D', fg: '#FCEBEB' };
  if (pct > 0.6) return { bg: '#E24B4A', fg: '#FCEBEB' };
  if (pct > 0.4) return { bg: '#EF9F27', fg: '#412402' };
  if (pct > 0.2) return { bg: '#B5D4F4', fg: '#042C53' };
  return { bg: '#E6F1FB', fg: '#185FA5' };
}

function LineChart({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data), max = Math.max(...data);
  const W = 400, H = 120, PAD = 8;
  const pts = data.map((v, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / (max - min || 1)) * (H - PAD * 2);
    return `${x},${y}`;
  });
  const fillPts = `${PAD},${H - PAD} ${pts.map(p => p).join(' ')} ${W - PAD},${H - PAD}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`lg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#lg-${color})`} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p, i) => {
        const [x, y] = p.split(',').map(Number);
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

function StackedBar() {
  const W = 800, H = 140, PAD = 8;
  const maxV = Math.max(...INTAKE);
  const barW = (W - PAD * 2) / INTAKE.length - 3;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }} preserveAspectRatio="none">
      {INTAKE.map((v, i) => {
        const r = RESOLVED[i];
        const x = PAD + i * ((W - PAD * 2) / INTAKE.length);
        const intakeH = (v / maxV) * (H - PAD * 2);
        const resH = (r / maxV) * (H - PAD * 2);
        return (
          <g key={i}>
            <rect x={x} y={H - PAD - intakeH} width={barW} height={intakeH} fill="rgba(226,75,74,0.7)" rx="2" />
            <rect x={x} y={H - PAD - resH} width={barW} height={resH} fill="rgba(99,153,34,0.8)" rx="2" />
          </g>
        );
      })}
    </svg>
  );
}

function LangDonut() {
  let cum = 0;
  const stops = LANG_DATA.map(d => {
    const s = cum, e = cum + d.pct;
    cum = e;
    return `${d.color} ${s}% ${e}%`;
  });
  return (
    <div className="relative flex items-center justify-center mx-auto" style={{ width: 120, height: 120 }}>
      <div className="rounded-full" style={{ width: 120, height: 120, background: `conic-gradient(${stops.join(', ')})` }} />
      <div className="absolute rounded-full bg-white flex flex-col items-center justify-center" style={{ width: 64, height: 64 }}>
        <span className="text-[10px] font-bold text-[#0E1C2F]">100%</span>
      </div>
    </div>
  );
}

const maxHeat = Math.max(...HEAT_VALS.flat());

export default function SecretaryTrendsPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">Trends &amp; Patterns</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">
          12-week complaint trends, heatmap, language distribution, and AI classification metrics
        </p>
      </div>

      {/* Weekly trend + Resolution ratio */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Weekly Complaint Volume — 12 Weeks</h2>
          </div>
          <div className="p-5">
            <LineChart data={INTAKE} color="#185FA5" />
            <div className="flex justify-between mt-1 px-1">
              {WEEKS.map((w, i) => (
                <span key={i} className="text-[8px] text-[#7A8FA6]">{w}</span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F0F2F7]">
              <div>
                <p className="text-[10px] text-[#7A8FA6]">Week 1 baseline</p>
                <p className="text-[13px] font-bold text-[#0E1C2F]">1,840</p>
              </div>
              <div>
                <p className="text-[10px] text-[#7A8FA6]">Current (W12)</p>
                <p className="text-[13px] font-bold text-red-600">2,847</p>
              </div>
              <div>
                <p className="text-[10px] text-[#7A8FA6]">Change</p>
                <p className="text-[13px] font-bold text-red-600">▲ 55%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Resolution vs Intake Ratio</h2>
          </div>
          <div className="p-5">
            <StackedBar />
            <div className="flex justify-between mt-1 px-1">
              {WEEKS.map((w, i) => (
                <span key={i} className="text-[8px] text-[#7A8FA6]">{w}</span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F0F2F7] text-[10px] text-[#7A8FA6]">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(226,75,74,0.7)' }} />Received</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(99,153,34,0.8)' }} />Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)] mb-4">
        <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">Complaint Intensity Heatmap — Category × District</h2>
        </div>
        <div className="p-5 overflow-x-auto">
          <div style={{ minWidth: 520 }}>
            <div className="grid gap-1" style={{ gridTemplateColumns: '90px repeat(8, 1fr)' }}>
              <div />
              {HEAT_CATS.map(c => (
                <div key={c} className="text-[9px] text-[#7A8FA6] text-center pb-1 font-medium">{c}</div>
              ))}
              {HEAT_DISTS.map((dist, di) => (
                <React.Fragment key={dist}>
                  <div className="text-[9px] text-[#7A8FA6] flex items-center pr-2 font-medium">{dist}</div>
                  {HEAT_CATS.map((_, ci) => {
                    const v = HEAT_VALS[di][ci];
                    const { bg, fg } = heatColor(v, maxHeat);
                    return (
                      <div
                        key={ci}
                        className="rounded flex items-center justify-center text-[8px] font-semibold"
                        style={{ height: 22, background: bg, color: fg }}
                      >
                        {v}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-[10px] text-[#7A8FA6]">
              <span>Low</span>
              {['#E6F1FB','#B5D4F4','#EF9F27','#E24B4A','#A32D2D'].map(c => (
                <div key={c} className="w-5 h-2.5 rounded-sm" style={{ background: c }} />
              ))}
              <span>High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language distribution + AI classification */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Language Distribution (NLP Classification)</h2>
          </div>
          <div className="p-5">
            <LangDonut />
            <div className="flex gap-5 mt-4 justify-center flex-wrap">
              {LANG_DATA.map(d => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-[11px] text-[#3D5068]">{d.label}</span>
                  <span className="text-[11px] font-semibold text-[#0E1C2F]">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
            <h2 className="text-[13px] font-bold text-[#0E1C2F]">Auto-classification Confidence</h2>
          </div>
          <div className="p-5">
            <div className="space-y-3 mb-5">
              {AI_DATA.map(d => (
                <div key={d.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#0E1C2F]">{d.label}</span>
                    <span className="font-bold" style={{ color: d.color }}>{d.val}%</span>
                  </div>
                  <div className="bg-[#F0F2F7] rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.val}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#F0F2F7] pt-4">
              <p className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-3">Top Misclassified SOP Codes</p>
              <div className="space-y-1">
                {MISCLASS.map(m => (
                  <div key={m.code} className="flex items-center gap-3 py-1.5">
                    <span className="text-[10px] text-[#185FA5] font-semibold min-w-[110px]">{m.code}</span>
                    <span className="text-[11px] text-[#0E1C2F] flex-1">{m.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#FAEEDA', color: '#854F0B' }}>{m.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
