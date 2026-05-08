'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { X, Sparkles, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useComplaints, useUpdateComplaint } from '@/hooks/useComplaints';
import { StatusBadge, PriorityBadge } from '@/components/gms/StatusBadge';
import { GroupCardSkeleton } from '@/components/gms/Skeletons';
import type { Complaint } from '@/types';

/* ── CONSTANTS ── */
const CH_ICONS: Record<string, string> = {
  web: '🌐', mobile: '📱', whatsapp: '💬', call: '📞', email: '✉', walk_in: '🚶',
};

const GROUP_LABELS: Record<string, string> = {
  'grp-phc-daskroi': 'GROUP-001',
  'grp-sg-highway': 'GROUP-002',
};

const CH_LABELS: Record<string, string> = {
  web: 'Web', mobile: 'App', whatsapp: 'WhatsApp', call: 'Helpline', email: 'Email', walk_in: 'Walk-in',
};

/* ── AI SUGGESTIONS ── */
const AI_SUGGESTIONS = [
  {
    id: 's1',
    title: '3 new complaints about water supply in Ward 7 area',
    reason: 'Similar to GVM-2025-05341. Same ward, same description keywords.',
    tokens: ['GVM-2025-05298', 'GVM-2025-05312', 'GVM-2025-05441'],
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

/* ── HELPERS ── */
function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
}

function getGroupStatus(complaints: Complaint[]): Complaint['status'] {
  if (complaints.every(c => c.status === 'resolved')) return 'resolved';
  if (complaints.some(c => c.status === 'escalated')) return 'escalated';
  if (complaints.some(c => c.status === 'in_progress' || c.status === 'under_review')) return 'in_progress';
  return 'open';
}

function getGroupPriority(complaints: Complaint[]): Complaint['priority'] {
  if (complaints.some(c => c.priority === 'critical')) return 'critical';
  if (complaints.some(c => c.priority === 'high')) return 'high';
  return 'medium';
}

function getGroupSubtitle(members: Complaint[], primary: Complaint): string {
  const channels = [...new Set(members.map(m => m.channel))];
  return `${members.length} separate complaint${members.length !== 1 ? 's' : ''} from ${channels.length} channel${channels.length !== 1 ? 's' : ''} · Same root cause · Grouped by Nodal Officer`;
}

/* ── MAIN PAGE ── */
export default function GroupedCasesPage() {
  const { data: complaints = [], isLoading } = useComplaints();
  const updateComplaint = useUpdateComplaint();
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  const activeSuggestions = AI_SUGGESTIONS.filter(s => !dismissedSuggestions.includes(s.id));

  // Build groups from data
  const groups = useMemo(() => {
    const grouped = complaints.filter(c => c.groupId);
    const groupMap = new Map<string, Complaint[]>();
    grouped.forEach(c => {
      const arr = groupMap.get(c.groupId!) || [];
      arr.push(c);
      groupMap.set(c.groupId!, arr);
    });

    return Array.from(groupMap.entries()).map(([groupId, members]) => {
      const primary = members.find(m => m.isGroupPrimary) || members[0];
      return { groupId, primary, members };
    });
  }, [complaints]);

  async function handleResolveAll(memberIds: string[]) {
    const now = new Date().toISOString();
    await Promise.all(
      memberIds.map(id =>
        updateComplaint.mutateAsync({ id, data: { status: 'resolved', resolvedAt: now } })
      )
    );
    toast.success(`All ${memberIds.length} complaints in group resolved. Citizen notifications sent.`);
  }

  async function handleUngroup(memberIds: string[]) {
    await Promise.all(
      memberIds.map(id =>
        updateComplaint.mutateAsync({ id, data: { groupId: undefined, isGroupPrimary: false } })
      )
    );
    toast.info(`Group disbanded. ${memberIds.length} complaints returned to individual queue.`);
  }

  function handleAcceptSuggestion(s: typeof AI_SUGGESTIONS[0]) {
    toast.success(`${s.tokens.length} complaints grouped under ${s.primaryToken}.`);
    setDismissedSuggestions(prev => [...prev, s.id]);
  }

  function handleDismissSuggestion(id: string) {
    setDismissedSuggestions(prev => [...prev, id]);
    toast.info('Suggestion dismissed.');
  }

  return (
    <div>
      {/* Toolbar — matches HTML .table-toolbar */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <span className="text-[15px] font-bold text-[#0E1C2F] flex-1" style={{ fontFamily: 'var(--font-heading)' }}>
          Grouped Complaint Clusters
        </span>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A56C4] text-white text-[12px] font-semibold rounded-lg hover:bg-[#0E3A8C] transition-colors shadow-sm shadow-blue-600/20">
          🤖 AI suggestions
        </button>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#DDE3EE] text-[#3D5068] text-[12px] font-semibold rounded-lg hover:bg-[#F0F2F7] transition-colors">
          + Create new group
        </button>
      </div>

      <Suspense fallback={<div className="grid gap-3.5"><GroupCardSkeleton /><GroupCardSkeleton /></div>}>
        {isLoading ? (
          <div className="grid gap-3.5"><GroupCardSkeleton /><GroupCardSkeleton /></div>
        ) : (
          <>
            {/* AI Suggestions */}
            {activeSuggestions.length > 0 && (
              <div className="mb-4 space-y-2.5">
                <p className="text-[12px] font-bold text-[#0E1C2F]">🤖 AI Grouping Suggestions</p>
                {activeSuggestions.map(s => (
                  <div key={s.id} className="bg-gradient-to-br from-blue-50 to-teal-50 border border-[#BFDBFE] rounded-[14px] px-4 py-3.5 flex gap-3">
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
                        <button onClick={() => handleAcceptSuggestion(s)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
                          ✓ Accept &amp; Group
                        </button>
                        <button onClick={() => handleDismissSuggestion(s.id)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 transition-all">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Group cards — matches HTML structure exactly */}
            <div className="grid gap-3.5">
              {groups.length === 0 ? (
                <div className="bg-white border border-[#DDE3EE] rounded-[14px] py-14 text-center">
                  <div className="text-4xl mb-3">🔗</div>
                  <p className="text-[15px] font-bold text-[#0E1C2F] mb-1">No grouped cases</p>
                  <p className="text-[12px] text-[#7A8FA6]">Accept an AI suggestion above or group similar complaints manually.</p>
                </div>
              ) : (
                groups.map(({ groupId, primary, members }, index) => {
                  const isFirst = index === 0;
                  const allIds = members.map(m => m.id);
                  const groupLabel = GROUP_LABELS[groupId] || groupId;
                  const groupStatus = getGroupStatus(members);
                  const groupPriority = getGroupPriority(members);
                  const allResolved = members.every(m => m.status === 'resolved');

                  /* HTML: first group gets orange dc-head, all groups use detail-card */
                  return (
                    <div key={groupId} className={cn(
                      'bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]'
                    )}>
                      {/* ── dc-head ── */}
                      <div className={cn(
                        'px-4 py-3 border-b flex items-start justify-between gap-3',
                        isFirst ? 'bg-[#FFF7ED] border-[#FDDCAF]' : 'border-[#DDE3EE]'
                      )}>
                        <div>
                          {/* Row 1: GROUP-001 + group-indicator + priority + status */}
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[13px] font-bold text-[#EA580C]" style={{ fontFamily: 'var(--font-heading)' }}>
                              {groupLabel}
                            </span>
                            {/* HTML .group-indicator */}
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded-[10px] border border-[rgba(234,88,12,0.2)]">
                              🔗 {members.length} complaint{members.length !== 1 ? 's' : ''}
                            </span>
                            <PriorityBadge priority={groupPriority} />
                            <StatusBadge status={groupStatus as typeof primary.status} />
                          </div>
                          {/* Row 2: Group title */}
                          <div className="text-[14px] font-bold text-[#0E1C2F]">
                            {primary.title}
                          </div>
                          {/* Row 3: Subtitle */}
                          <div className="text-[11px] text-[#7A8FA6] mt-0.5">
                            {getGroupSubtitle(members, primary)}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {isFirst && (
                            <>
                              <button
                                onClick={() => handleResolveAll(allIds)}
                                className="px-3.5 py-2 rounded-[7px] text-[12px] font-semibold bg-[#EA580C] text-white hover:bg-[#C2430A] transition-colors cursor-pointer"
                              >
                                Manage group
                              </button>
                              <button
                                onClick={() => handleUngroup(allIds)}
                                className="px-3.5 py-2 rounded-[7px] text-[12px] font-semibold bg-white border border-[#DDE3EE] text-[#3D5068] hover:bg-[#F0F2F7] transition-colors cursor-pointer"
                              >
                                View all
                              </button>
                            </>
                          )}
                          {!isFirst && (
                            <button className="px-3.5 py-2 rounded-[7px] text-[12px] font-semibold bg-[#EA580C] text-white hover:bg-[#C2430A] transition-colors cursor-pointer">
                              Manage group
                            </button>
                          )}
                        </div>
                      </div>

                      {/* ── dc-body: only for first group ── */}
                      {isFirst && (
                        <div className="px-4 py-3.5">
                          {/* HTML .group-map */}
                          <div className="flex flex-col gap-2">
                            {members.map(m => {
                              const isPrimary = m.id === primary.id;
                              return (
                                <div
                                  key={m.id}
                                  className={cn(
                                    'flex items-start gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all',
                                    isPrimary
                                      ? 'bg-[#FFF7ED] border-[#EA580C] border-2'
                                      : 'bg-[#F0F2F7] border-[#DDE3EE] hover:border-[#EA580C] hover:bg-[#FFF7ED]'
                                  )}
                                >
                                  <span className="text-[16px] flex-shrink-0 mt-0.5">
                                    {isPrimary ? '📌' : (CH_ICONS[m.channel] ?? '📋')}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[11px] font-semibold text-[#1A56C4]" style={{ fontFamily: 'var(--font-heading)' }}>
                                      {m.token}
                                    </div>
                                    <div className="text-[12px] font-medium text-[#0E1C2F]">
                                      {m.title} ({CH_LABELS[m.channel] ?? m.channel})
                                    </div>
                                    <div className="text-[10px] text-[#7A8FA6] mt-0.5">
                                      {m.citizenName} &middot; {formatRelativeDate(m.createdAt)}{m.slaStatus === 'breach' ? ' · SLA Breached' : ''}
                                    </div>
                                  </div>
                                  <span className={cn(
                                    'text-[9px] font-bold px-1.5 py-0.5 rounded-[6px] flex-shrink-0 border',
                                    isPrimary
                                      ? 'bg-[#FFF7ED] text-[#EA580C] border-[rgba(234,88,12,0.25)]'
                                      : 'bg-[#F0F2F7] text-[#7A8FA6] border-[#DDE3EE]'
                                  )}>
                                    {isPrimary ? 'Primary' : 'Linked'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* AI confidence box — HTML .ai-box */}
                          <div className="bg-gradient-to-br from-[#EFF6FF] to-[#F0FDF9] border border-[#BFDBFE] rounded-lg p-3 flex gap-2.5 items-start mt-3">
                            <span className="text-[16px] flex-shrink-0 mt-0.5">🤖</span>
                            <p className="text-[11px] text-[#3D5068] leading-relaxed">
                              All {members.length} complaints geo-match {primary.ward}. AI confidence: <strong>{members.length >= 4 ? '97' : '91'}% same root cause</strong>. Recommended action: Single resolution will close all {members.length} automatically. Citizen notifications will be sent to all {members.length}.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </Suspense>
    </div>
  );
}
