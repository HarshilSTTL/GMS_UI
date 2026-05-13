'use client';
import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';

type ActionType = 'all' | 'critical' | 'sla' | 'csat';

const ACTIONS = [
  {
    id: 'a1', type: 'critical', priority: 'CRITICAL',
    title: 'Deploy emergency health team to Dahod — CSAT 2.9, SLA 54%, 18 critical complaints',
    target: 'Chief Secretary + Health Secretary',
    dept: 'Health & Family Welfare',
    directive: 'Direct CDHO Dahod to submit 48-hour action plan. Depute state monitoring team. Review drug supply chain and medical officer availability urgently.',
    impact: '18 critical complaints. SLA 54%. Citizen satisfaction at state low. 3 consecutive months of decline.',
    tags: ['Dahod', 'Health', 'CSAT Crisis'],
  },
  {
    id: 'a2', type: 'critical', priority: 'CRITICAL',
    title: 'Water supply emergency — Banaskantha, Tapi, Dang, Narmada all below SLA 65%',
    target: 'Water Supply Secretary + 4 District Collectors',
    dept: 'Water Supply & Sanitation',
    directive: 'GWSSB to conduct emergency infrastructure audit. Allocate emergency repair budget from contingency fund. Weekly progress report to CM office.',
    impact: '4 districts. SLA avg 65%. 1,007 open complaints. Tribal areas disproportionately affected.',
    tags: ['Water Supply', 'Tribal', 'Infrastructure'],
  },
  {
    id: 'a3', type: 'critical', priority: 'CRITICAL',
    title: 'Tribal belt CSAT crisis — Dahod, Dang, Chhota Udaipur, Narmada all below 3.2',
    target: 'Tribal Development Secretary + Health + Water Secretaries',
    dept: 'Tribal Districts',
    directive: 'Launch Jan Seva Abhiyan in tribal belt. Dedicate mobile grievance officers. Special fund allocation. Weekly Collector video conference chaired by CM.',
    impact: '4 districts. Average CSAT 3.05. 1,351 open complaints. Ground-level officer gap identified.',
    tags: ['Tribal', 'Multi-dept', 'Jan Seva'],
  },
  {
    id: 'a4', type: 'sla', priority: 'HIGH',
    title: 'Revenue & Land Records — SLA 72%, rising backlog across South Gujarat',
    target: 'Revenue Secretary + Collector Conference',
    dept: 'Revenue & Land Records',
    directive: 'Convene video conference of all Collectors. Mandate weekly SLA review. Enable e-hearing for pending mutations to reduce physical footfall and processing delays.',
    impact: '3,120 open complaints. SLA 72% — 13 points below target. Fastest growing category.',
    tags: ['Revenue', 'South Gujarat', 'SLA'],
  },
  {
    id: 'a5', type: 'sla', priority: 'HIGH',
    title: 'Food & Civil Supplies — 8 districts with PDS delivery complaints above threshold',
    target: 'Food Secretary + District Supply Officers',
    dept: 'Food & Civil Supplies',
    directive: 'Immediate audit of fair price shop operations in flagged districts. Enable mobile PDS tracking. Penalise non-performing dealers within 15 days.',
    impact: '1,420 open complaints. CSAT 3.3. SLA 74%. 8 districts flagged.',
    tags: ['Food Security', 'PDS', 'SLA'],
  },
  {
    id: 'a6', type: 'csat', priority: 'HIGH',
    title: 'Surat district — CSAT dropped to 3.4, fastest decline in state (−18% in 3 months)',
    target: 'District Collector Surat + All Dept HoDs Surat',
    dept: 'Multi-department',
    directive: 'Emergency meeting of all district department heads in Surat. Review top 3 complaint categories. Enable citizen feedback fast-track. Monthly CM office review.',
    impact: '1,614 open complaints. SLA 62%. Fastest CSAT decline in state.',
    tags: ['Surat', 'CSAT', 'Multi-dept'],
  },
  {
    id: 'a7', type: 'csat', priority: 'HIGH',
    title: 'Water Supply CSAT at 3.2 statewide — lowest among all departments',
    target: 'Water Supply Secretary + GWSSB MD',
    dept: 'Water Supply & Sanitation',
    directive: 'Statewide infrastructure audit. Establish 24×7 complaint response cell for water issues. Monthly performance scorecard published publicly.',
    impact: '2,210 open complaints. Statewide CSAT 3.2. 54 critical complaints unresolved.',
    tags: ['Water Supply', 'GWSSB', 'CSAT'],
  },
];

const TAB_LABELS: { key: ActionType; label: string }[] = [
  { key: 'all',      label: 'All (7)'         },
  { key: 'critical', label: 'Critical (3)'    },
  { key: 'sla',      label: 'SLA Breach (2)'  },
  { key: 'csat',     label: 'CSAT Alert (2)'  },
];

export default function CMActionsPage() {
  const [tab, setTab] = useState<ActionType>('all');
  const [taken, setTaken] = useState<string[]>([]);

  const visible = tab === 'all' ? ACTIONS : ACTIONS.filter(a => a.type === tab);

  function handleDirective(id: string) {
    setTaken(prev => [...prev, id]);
    toast.success('CM Directive drafted and dispatched');
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Zap size={20} className="text-amber-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">AI Action Board</h1>
          <p className="text-[12px] text-[#7A8FA6]">AI-generated actionable directives — for CM review and dispatch</p>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-3.5 mb-5 flex gap-3">
        <span className="text-lg flex-shrink-0">⚡</span>
        <div>
          <p className="text-[12px] font-bold text-amber-800 mb-0.5">AI Action Intelligence — 7 directives generated</p>
          <p className="text-[11px] text-amber-700 leading-relaxed">System-generated based on SLA breach patterns, CSAT decline signals, cross-department anomaly detection, and district distress scoring. Each directive includes the target officer, corrective action, and measurable impact.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#DDE3EE] mb-5 overflow-x-auto">
        {TAB_LABELS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-[11px] font-semibold border-b-2 transition-all whitespace-nowrap ${tab === t.key ? 'border-b-blue-600 text-blue-600' : 'border-b-transparent text-[#7A8FA6] hover:text-[#3D5068]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map(action => {
          const isCrit = action.priority === 'CRITICAL';
          const priC = isCrit
            ? { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', bar: '#DC2626' }
            : { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', bar: '#D97706' };
          const isDone = taken.includes(action.id);

          return (
            <div key={action.id} className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)] flex gap-3">
              {/* Priority bar */}
              <div className="w-0.5 rounded-full flex-shrink-0" style={{ background: priC.bar }} />
              <div className="flex-1">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-[12px] font-bold text-[#0E1C2F] leading-snug">{action.title}</h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: priC.bg, color: priC.text }}>{action.priority}</span>
                </div>
                {/* Target */}
                <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#0891B2' }}>→ Direct to: {action.target}</p>
                {/* Directive */}
                <p className="text-[11px] text-[#3D5068] leading-relaxed mb-2">{action.directive}</p>
                {/* Impact box */}
                <div className="rounded-lg px-3 py-2 mb-3 border-l-2 text-[10px] text-[#3D5068]"
                  style={{ background: '#F8FAFD', borderLeftColor: priC.bar }}>
                  📊 Impact: {action.impact}
                </div>
                {/* Tags + action */}
                <div className="flex items-center gap-2 flex-wrap">
                  {action.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{tag}</span>
                  ))}
                  <div className="ml-auto flex-shrink-0">
                    {isDone ? (
                      <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">✓ Directive issued</span>
                    ) : (
                      <button onClick={() => handleDirective(action.id)}
                        className="text-[11px] font-semibold text-blue-600 hover:underline">
                        Draft CM Directive →
                      </button>
                    )}
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
