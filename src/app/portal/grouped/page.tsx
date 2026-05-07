'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Link2, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useComplaints } from '@/hooks/useComplaints';
import { PriorityBadge, SLABadge, StatusBadge } from '@/components/gms/StatusBadge';

const AI_SUGGESTIONS = [
  {
    id: 's1',
    title: '3 new complaints about water supply in Satellite area',
    reason: 'Similar to GVM-2025-05341. Same ward, same description keywords.',
    tokens: ['GVM-2025-05441', 'GVM-2025-05456', 'GVM-2025-05471'],
    primaryToken: 'GVM-2025-05341',
    confidence: 94,
  },
  {
    id: 's2',
    title: '2 complaints about street lights on Manek Chowk Road',
    reason: 'Same location, same category as GVM-2025-05255.',
    tokens: ['GVM-2025-05488', 'GVM-2025-05502'],
    primaryToken: 'GVM-2025-05255',
    confidence: 87,
  },
];

export default function GroupedCasesPage() {
  const { data: complaints = [], isLoading } = useComplaints();
  const groupedComplaints = complaints.filter(c => c.groupId);
  const primaryCases = groupedComplaints.filter(c => c.isGroupPrimary);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  const activeSuggestions = AI_SUGGESTIONS.filter(s => !dismissedSuggestions.includes(s.id));

  function handleAcceptSuggestion(s: typeof AI_SUGGESTIONS[0]) {
    toast.success(`✅ ${s.tokens.length} complaints grouped under ${s.primaryToken}.`);
    setDismissedSuggestions(prev => [...prev, s.id]);
  }

  function handleDismissSuggestion(id: string) {
    setDismissedSuggestions(prev => [...prev, id]);
    toast.info('Suggestion dismissed.');
  }

  function handleResolveAll(groupId: string, count: number) {
    toast.success(`✅ All ${count} complaints in group resolved. Citizen notifications sent.`);
  }

  function handleUngroup(token: string) {
    toast.info(`🔓 ${token} ungrouped. Members returned to individual queue.`);
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-[13px] text-[#7A8FA6]">Loading grouped cases…</div>
  );

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <Link2 size={20} className="text-orange-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Grouped Cases</h1>
          <p className="text-[12px] text-[#7A8FA6]">
            {primaryCases.length} complaint group{primaryCases.length !== 1 ? 's' : ''} · {groupedComplaints.length} total linked cases
          </p>
        </div>
      </div>

      {/* AI Suggestions */}
      {activeSuggestions.length > 0 && (
        <div className="mb-5 space-y-3">
          <p className="text-[12px] font-bold text-[#0E1C2F]">🤖 AI Grouping Suggestions</p>
          {activeSuggestions.map(s => (
            <div key={s.id} className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-[14px] px-4 py-3.5 flex gap-3">
              <span className="text-[18px] flex-shrink-0 mt-0.5">🤖</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[12px] font-semibold text-[#0E1C2F]">{s.title}</p>
                    <p className="text-[11px] text-[#3D5068] mt-0.5">{s.reason}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        {s.confidence}% confidence
                      </span>
                      <span className="text-[10px] text-[#7A8FA6]">Primary: {s.primaryToken}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.tokens.map(t => (
                        <span key={t} className="text-[9px] font-mono bg-white border border-blue-200 text-blue-700 px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleDismissSuggestion(s.id)} className="w-6 h-6 rounded-full hover:bg-blue-100 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <X size={12} />
                  </button>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAcceptSuggestion(s)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
                  >
                    ✓ Accept & Group
                  </button>
                  <button
                    onClick={() => handleDismissSuggestion(s.id)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Group cards */}
      <div className="space-y-3">
        {primaryCases.length === 0 ? (
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] py-14 text-center">
            <div className="text-4xl mb-3">🔗</div>
            <p className="text-[15px] font-bold text-[#0E1C2F] mb-1">No grouped cases</p>
            <p className="text-[12px] text-[#7A8FA6]">Accept an AI suggestion above or group similar complaints manually.</p>
          </div>
        ) : (
          primaryCases.map(primary => {
            const members = groupedComplaints.filter(c => c.groupId === primary.groupId && !c.isGroupPrimary);
            const allCount = members.length + 1;
            return (
              <div key={primary.id} className="bg-white border-2 border-orange-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
                {/* Group header */}
                <div className="px-4 py-3 bg-orange-50/60 border-b border-orange-200 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                      Primary
                    </span>
                    <Link href={`/portal/complaints/${primary.id}`} className="text-[12px] font-bold text-blue-600 hover:underline font-mono">
                      {primary.token}
                    </Link>
                    <PriorityBadge priority={primary.priority} />
                    <SLABadge slaStatus={primary.slaStatus} slaDaysLeft={primary.slaDaysLeft} />
                    <StatusBadge status={primary.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#7A8FA6]">{allCount} cases</span>
                    <button
                      onClick={() => handleResolveAll(primary.groupId!, allCount)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-green-600 text-white hover:bg-green-700 transition-all"
                    >
                      <CheckCircle size={11} /> Resolve All
                    </button>
                    <button
                      onClick={() => handleUngroup(primary.token)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-[#DDE3EE] text-[#7A8FA6] hover:border-red-300 hover:text-red-600 transition-all"
                    >
                      Ungroup
                    </button>
                  </div>
                </div>

                {/* Primary complaint details */}
                <div className="p-4">
                  <p className="text-[14px] font-semibold text-[#0E1C2F] mb-1">{primary.title}</p>
                  <p className="text-[11px] text-[#7A8FA6] mb-2">
                    {primary.ward}, {primary.district} · {primary.citizenName} · {primary.department}
                  </p>
                  <p className="text-[11px] text-[#3D5068] bg-[#F8FAFD] rounded-lg px-3 py-2 border border-[#EDF1F7] italic">
                    "{primary.description}"
                  </p>
                </div>

                {/* Linked members */}
                {members.length > 0 && (
                  <div className="border-t border-[#DDE3EE] px-4 py-3">
                    <p className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-2">
                      Linked Complaints ({members.length})
                    </p>
                    <div className="space-y-1.5">
                      {members.map(m => (
                        <div key={m.id} className="flex items-center gap-3 py-2 px-3 bg-[#F8FAFD] rounded-[8px] border border-[#EDF1F7]">
                          <Link href={`/portal/complaints/${m.id}`} className="text-[11px] font-bold text-blue-600 hover:underline font-mono flex-shrink-0">{m.token}</Link>
                          <span className="text-[11px] text-[#3D5068] flex-1 truncate">{m.title}</span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <StatusBadge status={m.status} />
                            <SLABadge slaStatus={m.slaStatus} slaDaysLeft={m.slaDaysLeft} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
