'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { MessageSquare, Upload, AlertTriangle, Phone, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useComplaints, useUpdateComplaint } from '@/hooks/useComplaints';
import { useOfficers } from '@/hooks/useOfficers';
import { StatusBadge, PriorityBadge, SLABadge } from '@/components/gms/StatusBadge';
import { WorkCardSkeleton } from '@/components/gms/Skeletons';
import { useAuthStore } from '@/stores/auth-store';
import type { Complaint } from '@/types';

/* ── AI SUGGESTIONS PER CATEGORY ── */
function getAISuggestion(c: Complaint): string | null {
  if (c.category === 'Water Supply') {
    return 'This is likely a pipeline blockage or valve closure issue in Zone 3 distribution network. Similar complaint was resolved 14 days ago in adjacent Ward 6 (GVM-2025-04901). Check GWSSB Zone 3 valve map before site visit.';
  }
  if (c.category === 'Health') {
    return 'Multiple complaints from same location indicate systemic staff shortage at this PHC. Recommend escalating to CDHO for immediate staff deployment. Pattern matches 3 other PHCs in the district.';
  }
  if (c.category === 'Roads & Infrastructure') {
    return 'GIS analysis shows 3 other road complaints within 500m radius in last 30 days. Consider batching repair work for cost efficiency. PWD Zone 2 team available this week.';
  }
  return null;
}

/* ── EVIDENCE EMOJI BY CATEGORY ── */
function getEvidenceEmojis(c: Complaint): string[] {
  if (c.category === 'Water Supply') return ['🏚', '💧'];
  if (c.category === 'Roads & Infrastructure') return ['🛣'];
  if (c.category === 'Sewage & Drainage') return ['🌊', '🏚'];
  if (c.category === 'Health') return ['🏥', '💊'];
  if (c.category === 'Encroachment') return ['🏗'];
  if (c.category === 'Electricity & Lighting') return ['💡', '🌃'];
  return ['📋'];
}

/* ── WORK CARD ── */
function WorkCard({ complaint }: { complaint: Complaint }) {
  const { data: officers = [] } = useOfficers();
  const updateComplaint = useUpdateComplaint();
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'evidence'>('details');
  const [currentStatus, setCurrentStatus] = useState(complaint.status);

  const aiSuggestion = getAISuggestion(complaint);
  const evidenceEmojis = getEvidenceEmojis(complaint);
  const isResolved = currentStatus === 'resolved';
  const isOpen = currentStatus === 'open' || currentStatus === 'acknowledged';
  // In-progress / escalated / under_review cards get the full treatment (tab strip, AI, textarea)
  const isActive = !isOpen && !isResolved;

  async function handleUpdateStatus() {
    if (!note.trim()) { toast.error('Please enter an update before saving.'); return; }
    toast.success(`Update saved for ${complaint.token}. Citizen notified via SMS.`);
    setNote('');
  }

  async function handleBeginWork() {
    setCurrentStatus('in_progress');
    await updateComplaint.mutateAsync({ id: complaint.id, data: { status: 'in_progress' } });
    toast.success(`${complaint.token} — work started. Citizen notified.`);
  }

  async function handleResolve() {
    setCurrentStatus('resolved');
    await updateComplaint.mutateAsync({ id: complaint.id, data: { status: 'resolved', resolvedAt: new Date().toISOString() } });
    toast.success(`Complaint ${complaint.token} marked as resolved. CSAT survey sent to citizen.`);
  }

  function handleEscalate() {
    toast.info(`Escalation dialog for ${complaint.token}.`);
  }

  function handleContact() {
    toast.info(`📞 Calling ${complaint.citizenName} at ${complaint.citizenPhone}...`);
  }

  const tabs = [
    { key: 'details' as const, label: 'Details' },
    { key: 'timeline' as const, label: 'Timeline' },
    { key: 'evidence' as const, label: 'Evidence' },
  ];

  /* ── HTML: open cards get opacity:0.75 ── */
  return (
    <div className={cn(
      'bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]',
      isOpen && 'opacity-75',
      isResolved && 'opacity-75 border-green-200'
    )}>
      {/* ── wc-head ── */}
      <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* wc-id: token · category */}
          <div className="text-[12px] font-bold text-[#1A56C4] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {complaint.token} &middot; {complaint.category}
          </div>
          {/* wc-title */}
          <h3 className="text-[15px] font-bold text-[#0E1C2F] mb-1">{complaint.title}</h3>
          {/* wc-meta: 📍 location · citizen · phone */}
          <p className="text-[11px] text-[#7A8FA6]">
            📍 {complaint.ward}, {complaint.district} &middot; {complaint.citizenName} &middot; {complaint.citizenPhone}
          </p>
        </div>
        {/* Right side: stacked badges */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <PriorityBadge priority={complaint.priority} />
          <SLABadge slaStatus={complaint.slaStatus} slaDaysLeft={complaint.slaDaysLeft} />
          <StatusBadge status={currentStatus as typeof complaint.status} />
        </div>
      </div>

      {/* ── wc-body ── */}
      {/* HTML: Only active (in-progress) cards get tab strip + AI box. Open cards get just description + evidence */}
      {isActive ? (
        <div className="px-5 py-4">
          {/* Tab strip */}
          <div className="flex gap-0 border-b border-[#DDE3EE] mb-4">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  'text-[12px] font-semibold px-4 py-2 cursor-pointer border-b-2 transition-colors bg-transparent border-t-0 border-l-0 border-r-0',
                  activeTab === t.key
                    ? 'text-[#1A56C4] border-[#1A56C4]'
                    : 'text-[#7A8FA6] border-transparent hover:text-[#3D5068]'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Details tab */}
          {activeTab === 'details' && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.8px] text-[#7A8FA6] mb-2">Citizen&apos;s description</p>
              <p className="text-[13px] text-[#3D5068] leading-relaxed bg-[#F8FAFD] rounded-lg px-3.5 py-3 mb-3 italic">
                &ldquo;{complaint.description}&rdquo;
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.8px] text-[#7A8FA6] mb-2">Evidence attached</p>
              <div className="flex items-center gap-2 mb-3">
                {evidenceEmojis.map((emoji, i) => (
                  <div key={i} className="w-16 h-16 rounded-lg bg-[#dde8f5] border border-[#DDE3EE] flex items-center justify-center text-[26px] cursor-pointer hover:scale-105 transition-transform">
                    {emoji}
                  </div>
                ))}
                <span className="text-[11px] text-[#7A8FA6] ml-1">{evidenceEmojis.length} photo{evidenceEmojis.length > 1 ? 's' : ''} uploaded by citizen</span>
              </div>

              {aiSuggestion && (
                <div className="bg-gradient-to-br from-[#EFF6FF] to-[#F0FDF9] border border-[#BFDBFE] rounded-lg p-3 flex gap-2.5 items-start">
                  <span className="text-[16px] flex-shrink-0 mt-0.5">🤖</span>
                  <p className="text-[11px] text-[#3D5068] leading-relaxed">
                    <strong>AI suggests:</strong> {aiSuggestion}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Timeline tab */}
          {activeTab === 'timeline' && (
            <div className="flex flex-col">
              <TimelineItem icon="✓" bg="#D1FAE5" fg="#065F46" title="Complaint filed by citizen" meta={`${formatRelativeDate(complaint.createdAt)} · Via ${complaint.channel}`} />
              <TimelineItem icon="✓" bg="#D1FAE5" fg="#065F46" title="AI classified & auto-assigned" meta="Instantly · Auto-classified" />
              <TimelineItem icon="⏳" bg="#EBF2FF" fg="#1A56C4" title="Field visit scheduled" meta="Tomorrow 10 AM" desc="Zone 3 supervisor informed. Checking valve status remotely." />
              <TimelineItem icon="4" bg="#F0F2F7" fg="#7A8FA6" title="Resolution & closure" meta="Pending · SLA deadline approaching" last />
            </div>
          )}

          {/* Evidence tab */}
          {activeTab === 'evidence' && (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">📎</div>
              <p className="text-[12px] text-[#7A8FA6]">No additional evidence uploaded yet.</p>
              <button className="mt-3 text-[11px] font-semibold text-[#1A56C4] bg-[#EBF2FF] px-3 py-1.5 rounded-lg border border-[rgba(26,86,196,0.2)]">
                + Upload evidence
              </button>
            </div>
          )}
        </div>
      ) : !isResolved ? (
        /* ── Open card body: simple description + evidence, NO tab strip, NO AI box ── */
        <div className="px-5 py-4">
          <p className="text-[13px] text-[#3D5068] leading-relaxed bg-[#F8FAFD] rounded-lg px-3.5 py-3 mb-3 italic">
            &ldquo;{complaint.description}&rdquo;
          </p>
          <div className="flex items-center gap-2">
            {evidenceEmojis.map((emoji, i) => (
              <div key={i} className="w-16 h-16 rounded-lg bg-[#dde8f5] border border-[#DDE3EE] flex items-center justify-center text-[26px] cursor-pointer hover:scale-105 transition-transform">
                {emoji}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── action-area ── */}
      {!isResolved && (
        <div className="px-5 py-4 border-t border-[#DDE3EE] flex flex-col gap-3">
          {isActive ? (
            /* Active card: textarea + full button row */
            <>
              <div>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-2">Update action taken</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Describe what action you have taken or are planning to take..."
                  className="w-full px-3 py-2.5 border border-[#DDE3EE] rounded-[7px] text-[12px] text-[#0E1C2F] resize-none min-h-[72px] outline-none focus:border-[#1A56C4] focus:ring-2 focus:ring-[#1A56C4]/10 transition-colors leading-relaxed"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleUpdateStatus} className="px-3.5 py-2 rounded-[7px] text-[12px] font-semibold bg-[#1A56C4] text-white hover:bg-[#0E3A8C] transition-colors cursor-pointer shadow-sm shadow-blue-600/20">
                  ✓ Update status
                </button>
                <button className="px-3.5 py-2 rounded-[7px] text-[12px] font-semibold bg-white border border-[#DDE3EE] text-[#3D5068] hover:bg-[#F0F2F7] transition-colors cursor-pointer">
                  📷 Upload evidence
                </button>
                <button onClick={handleEscalate} className="px-3.5 py-2 rounded-[7px] text-[12px] font-semibold bg-white border border-[#DDE3EE] text-[#3D5068] hover:bg-[#F0F2F7] transition-colors cursor-pointer">
                  🚨 Escalate up
                </button>
                <button onClick={handleContact} className="px-3.5 py-2 rounded-[7px] text-[12px] font-semibold bg-white border border-[#DDE3EE] text-[#3D5068] hover:bg-[#F0F2F7] transition-colors cursor-pointer">
                  📞 Call citizen
                </button>
                <button onClick={handleResolve} className="px-3.5 py-2 rounded-[7px] text-[12px] font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors cursor-pointer">
                  ✅ Mark resolved
                </button>
              </div>
            </>
          ) : (
            /* Open card: simplified buttons — "Begin work" not "Update status", no textarea */
            <div className="flex flex-wrap gap-2">
              <button onClick={handleBeginWork} className="px-3.5 py-2 rounded-[7px] text-[12px] font-semibold bg-[#1A56C4] text-white hover:bg-[#0E3A8C] transition-colors cursor-pointer shadow-sm shadow-blue-600/20">
                ✓ Begin work
              </button>
              <button className="px-3.5 py-2 rounded-[7px] text-[12px] font-semibold bg-white border border-[#DDE3EE] text-[#3D5068] hover:bg-[#F0F2F7] transition-colors cursor-pointer">
                📷 Upload evidence
              </button>
              <button onClick={handleContact} className="px-3.5 py-2 rounded-[7px] text-[12px] font-semibold bg-white border border-[#DDE3EE] text-[#3D5068] hover:bg-[#F0F2F7] transition-colors cursor-pointer">
                📞 Call citizen
              </button>
            </div>
          )}
        </div>
      )}

      {/* Resolved card */}
      {isResolved && (
        <div className="px-5 py-4 border-t border-[#DDE3EE]">
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <CheckCircle size={14} />
            <span className="text-[12px] font-semibold">Resolved — CSAT survey sent to citizen</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── TIMELINE ITEM ── */
function TimelineItem({ icon, bg, fg, title, meta, desc, last }: {
  icon: string; bg: string; fg: string; title: string; meta: string; desc?: string; last?: boolean;
}) {
  return (
    <div className="flex gap-3 relative pb-3.5" style={last ? { paddingBottom: 0 } : {}}>
      {!last && <div className="absolute left-[14px] top-[26px] bottom-0 w-px bg-[#DDE3EE]" />}
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] flex-shrink-0 z-[1]" style={{ background: bg, color: fg }}>
        {icon}
      </div>
      <div className="flex-1 pt-1">
        <p className={cn('text-[12px] font-semibold', last ? 'text-[#7A8FA6]' : 'text-[#0E1C2F]')}>{title}</p>
        <p className="text-[10px] text-[#7A8FA6] mt-0.5">{meta}</p>
        {desc && (
          <p className="text-[11px] text-[#3D5068] mt-1 leading-relaxed bg-[#F0F2F7] px-2.5 py-2 rounded-md border-l-2 border-[#C8D0DE]">
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── HELPERS ── */
function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
}

/* ── MAIN PAGE ── */
export default function MyWorkPage() {
  const { user } = useAuthStore();
  const { data: complaints = [], isLoading } = useComplaints();
  const [activeFilter, setActiveFilter] = useState<'all' | 'due_today' | 'overdue'>('all');

  const myComplaints = useMemo(() =>
    complaints.filter(c =>
      c.assignedTo && (c.assignedTo.name === user?.name || c.assignedTo.id === 'o1')
    ), [complaints, user?.name]);

  const filtered = useMemo(() => {
    if (activeFilter === 'due_today') return myComplaints.filter(c => c.status !== 'resolved' && c.slaDaysLeft <= 1 && c.slaDaysLeft >= 0);
    if (activeFilter === 'overdue') return myComplaints.filter(c => c.status !== 'resolved' && c.slaDaysLeft < 0);
    return myComplaints;
  }, [myComplaints, activeFilter]);

  const counts = useMemo(() => ({
    all: myComplaints.length,
    due_today: myComplaints.filter(c => c.status !== 'resolved' && c.slaDaysLeft <= 1 && c.slaDaysLeft >= 0).length,
    overdue: myComplaints.filter(c => c.status !== 'resolved' && c.slaDaysLeft < 0).length,
  }), [myComplaints]);

  const filters = [
    { key: 'all' as const, label: 'All' },
    { key: 'due_today' as const, label: 'Due today' },
    { key: 'overdue' as const, label: 'Overdue' },
  ];

  return (
    <div>
      {/* Toolbar — HTML .table-toolbar */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <span className="text-[15px] font-bold text-[#0E1C2F] flex-1" style={{ fontFamily: 'var(--font-heading)' }}>My Work Queue</span>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              'flex items-center gap-1.5 bg-white border rounded-lg px-3 py-1.5 text-[11px] cursor-pointer transition-colors',
              activeFilter === f.key
                ? 'border-[#1A56C4] bg-[#EBF2FF] text-[#1A56C4]'
                : 'border-[#DDE3EE] text-[#3D5068] hover:border-[#C8D0DE]'
            )}
          >
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      {/* Work cards */}
      <Suspense fallback={<div className="space-y-3"><WorkCardSkeleton /><WorkCardSkeleton /></div>}>
        {isLoading ? (
          <div className="space-y-3"><WorkCardSkeleton /><WorkCardSkeleton /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] py-14 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-[15px] font-bold text-[#0E1C2F] mb-1">All caught up!</p>
            <p className="text-[12px] text-[#7A8FA6]">No complaints in this category right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => <WorkCard key={c.id} complaint={c} />)}
          </div>
        )}
      </Suspense>
    </div>
  );
}
