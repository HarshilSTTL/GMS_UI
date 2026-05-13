'use client';
import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';

const AI_ACTIONS = [
  {
    id: 'a1', priority: 'critical', icon: '🚨',
    title: 'Issue emergency directive to Roads & Buildings',
    description: 'Roads & Infrastructure complaints up 25% MoM with 521 SLA breaches. Pattern matches pre-monsoon surge from 2023. Recommend issuing emergency repair directive to 12 high-complaint zones before June 1.',
    impact: 'Est. 800+ complaint prevention',
    dept: 'Roads & Buildings',
    actionLabel: 'Issue Directive',
    status: 'pending',
  },
  {
    id: 'a2', priority: 'high', icon: '⚡',
    title: 'Re-assign 47 stalled Health complaints in Surat',
    description: 'CDHO Surat has 47 complaints with no activity for 5+ days. Nodal officer last logged in 6 days ago. Auto-reassignment to backup officer recommended.',
    impact: 'Prevent 47 SLA breaches',
    dept: 'Health (CDHO)',
    actionLabel: 'Auto-Reassign',
    status: 'pending',
  },
  {
    id: 'a3', priority: 'high', icon: '📢',
    title: 'Send mass update for 320 GWSSB water outage complaints',
    description: 'Pipeline repair in Ward 7–12 (Ahmedabad) is complete. 320 complaints are awaiting status update. AI can draft and send bulk citizen notifications.',
    impact: 'Resolve 320 complaints instantly',
    dept: 'GWSSB',
    actionLabel: 'Send Bulk Update',
    status: 'pending',
  },
  {
    id: 'a4', priority: 'medium', icon: '📊',
    title: 'Schedule department review for AMC',
    description: 'AMC has shown declining CSAT (3.4) and low SLA adherence (74%) for 3 consecutive months. A structured performance review with the Municipal Commissioner is recommended.',
    impact: 'Systemic improvement target',
    dept: 'AMC',
    actionLabel: 'Schedule Meeting',
    status: 'pending',
  },
  {
    id: 'a5', priority: 'medium', icon: '🏆',
    title: 'Recognize top performers — Education & Revenue dept',
    description: 'Education (95% SLA, 4.3 CSAT) and Revenue (91% SLA, 4.1 CSAT) are top performers this month. Recognition can boost morale and set benchmarks.',
    impact: 'Staff motivation & benchmarking',
    dept: 'Multiple',
    actionLabel: 'Send Recognition',
    status: 'pending',
  },
  {
    id: 'a6', priority: 'low', icon: '🔄',
    title: 'Archive 2,400+ resolved complaints older than 90 days',
    description: 'System has 2,418 resolved complaints older than 90 days consuming active query space. Archival will improve system performance by ~12%.',
    impact: 'Performance improvement',
    dept: 'System',
    actionLabel: 'Archive Records',
    status: 'pending',
  },
];

const PRIORITY_CONFIG = {
  critical: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', dot: '#DC2626', label: 'Critical' },
  high: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', dot: '#D97706', label: 'High' },
  medium: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', dot: '#3B82F6', label: 'Medium' },
  low: { bg: '#F0FDF4', border: '#BBF7D0', text: '#065F46', dot: '#16A34A', label: 'Low' },
};

export default function CMActionsPage() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [taken, setTaken] = useState<string[]>([]);
  const visible = AI_ACTIONS.filter(a => !dismissed.includes(a.id));

  function handleAction(id: string, label: string) {
    setTaken(prev => [...prev, id]);
    toast.success(`Action taken: ${label}`);
  }

  function handleDismiss(id: string) {
    setDismissed(prev => [...prev, id]);
    toast.info('Action dismissed');
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Zap size={20} className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">AI Action Board</h1>
          <p className="text-[12px] text-[#7A8FA6]">AI-recommended actions · {visible.length} pending decisions</p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-[12px] p-3.5 mb-5 flex gap-3">
        <span className="text-lg">🤖</span>
        <div>
          <p className="text-[12px] font-bold text-purple-800">GMS AI Engine · Analyzed last 30 days of data</p>
          <p className="text-[11px] text-purple-700">Based on complaint patterns, SLA data, department performance, and historical trends, the AI has identified {AI_ACTIONS.length} actionable recommendations for your review.</p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {(['critical', 'high', 'medium', 'low'] as const).map(p => {
          const count = AI_ACTIONS.filter(a => a.priority === p).length;
          const cfg = PRIORITY_CONFIG[p];
          return (
            <div key={p} className="rounded-[12px] px-3 py-2.5 border" style={{ background: cfg.bg, borderColor: cfg.border }}>
              <p className="text-[20px] font-bold" style={{ color: cfg.dot }}>{count}</p>
              <p className="text-[10px] font-semibold capitalize" style={{ color: cfg.text }}>{cfg.label}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        {visible.map(action => {
          const cfg = PRIORITY_CONFIG[action.priority as keyof typeof PRIORITY_CONFIG];
          const isDone = taken.includes(action.id);
          return (
            <div key={action.id} className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{action.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.text }}>{cfg.label}</span>
                    <span className="text-[10px] text-[#7A8FA6] bg-[#F0F4FA] px-1.5 py-0.5 rounded">{action.dept}</span>
                  </div>
                  <h3 className="text-[13px] font-bold text-[#0E1C2F] mb-1">{action.title}</h3>
                  <p className="text-[11px] text-[#3D5068] mb-2">{action.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      💡 {action.impact}
                    </span>
                    <div className="flex gap-2">
                      {!isDone ? (
                        <>
                          <button onClick={() => handleDismiss(action.id)}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-[#DDE3EE] text-[#7A8FA6] hover:bg-gray-50 transition-all">
                            Dismiss
                          </button>
                          <button onClick={() => handleAction(action.id, action.actionLabel)}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
                            {action.actionLabel}
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                          ✓ Action taken
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="text-center py-12 bg-white border border-[#DDE3EE] rounded-[14px]">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-[14px] font-bold text-[#0E1C2F]">All actions reviewed</p>
            <p className="text-[12px] text-[#7A8FA6]">Check back tomorrow for new AI recommendations</p>
          </div>
        )}
      </div>
    </div>
  );
}
