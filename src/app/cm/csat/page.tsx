'use client';
import React from 'react';

const DISTS = [
  { name: 'Ahmedabad',       div: 'Central',    csat: 4.1, sla: 88, open: 1842, top: 'Revenue'       },
  { name: 'Surat',           div: 'South',      csat: 3.4, sla: 62, open: 1614, top: 'Water Supply'  },
  { name: 'Rajkot',          div: 'Saurashtra', csat: 3.8, sla: 79, open: 1287, top: 'Health'        },
  { name: 'Vadodara',        div: 'Central',    csat: 4.0, sla: 85, open: 1190, top: 'Education'     },
  { name: 'Gandhinagar',     div: 'Central',    csat: 4.4, sla: 93, open: 743,  top: 'Revenue'       },
  { name: 'Bhavnagar',       div: 'Saurashtra', csat: 3.7, sla: 77, open: 891,  top: 'Health'        },
  { name: 'Jamnagar',        div: 'Saurashtra', csat: 3.9, sla: 82, open: 834,  top: 'Water Supply'  },
  { name: 'Kutch',           div: 'Kutch',      csat: 3.5, sla: 72, open: 967,  top: 'Roads'         },
  { name: 'Banaskantha',     div: 'North',      csat: 3.3, sla: 68, open: 1021, top: 'Water Supply'  },
  { name: 'Sabarkantha',     div: 'North',      csat: 3.6, sla: 80, open: 723,  top: 'Agriculture'   },
  { name: 'Surendranagar',   div: 'Saurashtra', csat: 3.2, sla: 65, open: 678,  top: 'Health'        },
  { name: 'Mahesana',        div: 'North',      csat: 3.7, sla: 78, open: 612,  top: 'Revenue'       },
  { name: 'Patan',           div: 'North',      csat: 3.4, sla: 71, open: 498,  top: 'Water Supply'  },
  { name: 'Anand',           div: 'Central',    csat: 4.0, sla: 87, open: 567,  top: 'Education'     },
  { name: 'Kheda',           div: 'Central',    csat: 3.8, sla: 83, open: 534,  top: 'Agriculture'   },
  { name: 'Bharuch',         div: 'South',      csat: 3.6, sla: 76, open: 589,  top: 'Revenue'       },
  { name: 'Navsari',         div: 'South',      csat: 3.9, sla: 84, open: 445,  top: 'Roads'         },
  { name: 'Valsad',          div: 'South',      csat: 3.7, sla: 80, open: 467,  top: 'Water Supply'  },
  { name: 'Tapi',            div: 'South',      csat: 3.3, sla: 69, open: 312,  top: 'Agriculture'   },
  { name: 'Dang',            div: 'South',      csat: 3.1, sla: 61, open: 198,  top: 'Health'        },
  { name: 'Narmada',         div: 'South',      csat: 3.2, sla: 64, open: 287,  top: 'Water Supply'  },
  { name: 'Chhota Udaipur',  div: 'East',       csat: 3.0, sla: 58, open: 354,  top: 'Health'        },
  { name: 'Panchmahal',      div: 'East',       csat: 3.2, sla: 67, open: 478,  top: 'Revenue'       },
  { name: 'Dahod',           div: 'East',       csat: 2.9, sla: 54, open: 512,  top: 'Health'        },
  { name: 'Mahisagar',       div: 'East',       csat: 3.1, sla: 63, open: 334,  top: 'Water Supply'  },
  { name: 'Aravalli',        div: 'North',      csat: 3.5, sla: 74, open: 389,  top: 'Agriculture'   },
  { name: 'Gir Somnath',     div: 'Saurashtra', csat: 3.8, sla: 81, open: 434,  top: 'Roads'         },
  { name: 'Amreli',          div: 'Saurashtra', csat: 3.6, sla: 77, open: 398,  top: 'Agriculture'   },
  { name: 'Botad',           div: 'Saurashtra', csat: 3.5, sla: 75, open: 312,  top: 'Water Supply'  },
  { name: 'Devbhoomi Dwarka',div: 'Saurashtra', csat: 3.7, sla: 79, open: 287,  top: 'Roads'         },
  { name: 'Morbi',           div: 'Saurashtra', csat: 3.6, sla: 80, open: 423,  top: 'Health'        },
  { name: 'Porbandar',       div: 'Saurashtra', csat: 3.9, sla: 85, open: 278,  top: 'Roads'         },
  { name: 'Devgadh Baria',   div: 'East',       csat: 3.3, sla: 66, open: 198,  top: 'Health'        },
];

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
const CSAT_TREND = [3.9, 3.8, 3.8, 3.7, 3.6, 3.5, 3.6, 3.5, 3.5, 3.6, 3.6, 3.6];
const TARGET = 4.0;

const ISSUE_MAP: Record<string, string> = {
  'Health': 'Staff absence, drug shortage',
  'Water Supply': 'Infrastructure failure',
  'Revenue': 'Mutation delays',
  'Roads': 'Monsoon damage backlog',
  'Agriculture': 'Compensation delays',
  'Education': 'Teacher transfers',
  'Food/PDS': 'FPS dealer issues',
};

function cc(v: number) { return v >= 4.0 ? '#16A34A' : v >= 3.5 ? '#D97706' : '#DC2626'; }
function sc(v: number) { return v >= 85 ? '#16A34A' : v >= 75 ? '#D97706' : '#DC2626'; }

// SVG line chart with target dashed line
function CsatLineChart() {
  const W = 400, H = 110, PAD = 10;
  const min = 2.5, max = 4.5;
  const toY = (v: number) => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
  const toX = (i: number) => PAD + (i / (CSAT_TREND.length - 1)) * (W - PAD * 2);

  const trendPts = CSAT_TREND.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const fillPts = `${PAD},${H - PAD} ${trendPts} ${W - PAD},${H - PAD}`;
  const targetY = toY(TARGET);
  const targetPts = `${PAD},${targetY} ${W - PAD},${targetY}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 110 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="csatGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill="url(#csatGrad)" />
      <polyline points={targetPts} fill="none" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="5,4" />
      <polyline points={trendPts} fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinejoin="round" />
      {CSAT_TREND.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill="#C9A84C" />
      ))}
    </svg>
  );
}

export default function CMCsatPage() {
  // Distribution buckets
  const buckets = [0, 0, 0, 0, 0, 0];
  DISTS.forEach(d => {
    if (d.csat < 2.5) buckets[0]++;
    else if (d.csat < 3.0) buckets[1]++;
    else if (d.csat < 3.5) buckets[2]++;
    else if (d.csat < 4.0) buckets[3]++;
    else if (d.csat < 4.5) buckets[4]++;
    else buckets[5]++;
  });
  const bucketLabels = ['<2.5', '2.5–3.0', '3.0–3.5', '3.5–4.0', '4.0–4.5', '>4.5'];
  const bucketColors = ['#991b1b', '#E84040', '#F0A030', '#C9A84C', '#28C880', '#00B4B4'];
  const maxBucket = Math.max(...buckets);

  const below35 = DISTS.filter(d => d.csat < 3.5).length;
  const bestDist = [...DISTS].sort((a, b) => b.csat - a.csat)[0];
  const worstDist = [...DISTS].sort((a, b) => a.csat - b.csat)[0];
  const bottom15 = [...DISTS].sort((a, b) => a.csat - b.csat).slice(0, 15);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">CSAT Deep-Dive</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">Citizen satisfaction intelligence · All 33 districts</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="h-0.5 rounded-full mb-3 -mt-1 -mx-4" style={{ background: '#DC2626' }} />
          <p className="text-[10px] text-[#7A8FA6] uppercase tracking-wide mb-1">Districts below 3.5</p>
          <p className="text-[28px] font-bold text-[#0E1C2F] leading-none">{below35}</p>
          <p className="text-[10px] text-red-600 font-semibold mt-1.5">Urgent intervention</p>
        </div>
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="h-0.5 rounded-full mb-3 -mt-1 -mx-4" style={{ background: '#D97706' }} />
          <p className="text-[10px] text-[#7A8FA6] uppercase tracking-wide mb-1">Depts below 3.5</p>
          <p className="text-[28px] font-bold text-[#0E1C2F] leading-none">5</p>
          <p className="text-[10px] text-amber-600 font-semibold mt-1.5">Needs monitoring</p>
        </div>
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="h-0.5 rounded-full mb-3 -mt-1 -mx-4" style={{ background: '#16A34A' }} />
          <p className="text-[10px] text-[#7A8FA6] uppercase tracking-wide mb-1">Best CSAT District</p>
          <p className="text-[28px] font-bold text-green-600 leading-none">{bestDist.csat.toFixed(1)}</p>
          <p className="text-[10px] text-green-600 font-semibold mt-1.5">{bestDist.name}</p>
        </div>
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="h-0.5 rounded-full mb-3 -mt-1 -mx-4" style={{ background: '#DC2626' }} />
          <p className="text-[10px] text-[#7A8FA6] uppercase tracking-wide mb-1">Worst CSAT District</p>
          <p className="text-[28px] font-bold text-red-600 leading-none">{worstDist.csat.toFixed(1)}</p>
          <p className="text-[10px] text-red-600 font-semibold mt-1.5">{worstDist.name} — action needed</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* CSAT trend */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-bold text-[#0E1C2F]">CSAT Trend — State Average (12 Months)</p>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 inline-block" />CSAT</span>
              <span className="flex items-center gap-1.5"><span className="w-3 border-t-2 border-dashed border-green-500 inline-block" />Target 4.0</span>
            </div>
          </div>
          <CsatLineChart />
          <div className="flex justify-between mt-1 px-1">
            {MONTHS.map((m, i) => <span key={i} className="text-[8px] text-[#7A8FA6]">{m}</span>)}
          </div>
        </div>

        {/* Distribution bar chart */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
          <p className="text-[13px] font-bold text-[#0E1C2F] mb-4">CSAT Distribution — All 33 Districts</p>
          <div className="flex items-end gap-2 h-28">
            {buckets.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold" style={{ color: bucketColors[i] }}>{count}</span>
                <div className="w-full rounded-t-md" style={{ height: `${maxBucket > 0 ? (count / maxBucket) * 72 : 0}px`, background: bucketColors[i] }} />
                <span className="text-[8px] text-[#7A8FA6] text-center leading-tight">{bucketLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 15 districts table */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">Bottom 15 Districts — CSAT Below Threshold (4.0 Target)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['#', 'District', 'Division', 'CSAT', 'Gap', 'SLA %', 'Open', 'Primary Issue', 'Action'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-[9px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bottom15.map((d, i) => {
                const gap = (TARGET - d.csat).toFixed(1);
                const iss = ISSUE_MAP[d.top] ?? 'Multi-dept coordination needed';
                const act = d.csat < 3.2 ? 'Urgent' : 'Monitor';
                const actC = d.csat < 3.2 ? { bg: '#FEF2F2', text: '#DC2626' } : { bg: '#FFFBEB', text: '#D97706' };
                const lb = d.csat < 3.0 ? 'border-l-2 border-l-red-500' : 'border-l-2 border-l-amber-400';
                return (
                  <tr key={d.name} className={`${lb} ${i < bottom15.length - 1 ? 'border-b border-[#F0F2F7]' : ''}`}>
                    <td className="px-3 py-2.5 text-[#7A8FA6]">{i + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-[#0E1C2F] whitespace-nowrap">{d.name}</td>
                    <td className="px-3 py-2.5 text-[#7A8FA6] text-[10px]">{d.div}</td>
                    <td className="px-3 py-2.5 font-bold" style={{ color: cc(d.csat) }}>{d.csat.toFixed(1)}</td>
                    <td className="px-3 py-2.5 font-bold text-red-600">−{gap}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: sc(d.sla) + '18', color: sc(d.sla) }}>{d.sla}%</span>
                    </td>
                    <td className="px-3 py-2.5 text-[#3D5068]">{d.open.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-[10px] text-[#7A8FA6]">{iss}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: actC.bg, color: actC.text }}>{act}</span>
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
