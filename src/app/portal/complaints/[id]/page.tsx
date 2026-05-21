'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Send, RotateCcw, AlertTriangle, CheckCircle, Link2, User, Paperclip, FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge, PriorityBadge, ChannelBadge, SLABadge } from '@/components/gms/StatusBadge';
import { ActionPopup, ActionPopupData } from '@/components/gms/ActionPopup';
import type { TimelineEntry } from '@/types/complaint';

function getTimelineIcon(type: string): { icon: string; bg: string } {
  const icons: Record<string, { icon: string; bg: string }> = {
    created: { icon: '📝', bg: '#FED7AA' },
    assigned: { icon: '👤', bg: '#BFDBFE' },
    status_change: { icon: '🔄', bg: '#C7D2FE' },
    resolved: { icon: '✅', bg: '#BBEB7A' },
    escalated: { icon: '⚠️', bg: '#FDBA74' },
    note: { icon: '📌', bg: '#DDD6FE' },
    forwarded: { icon: '📤', bg: '#F3E8FF' },
    reassigned: { icon: '↔️', bg: '#D1D5DB' },
    acknowledged: { icon: '👁️', bg: '#CFFAFE' },
    transferred: { icon: '✈️', bg: '#FCC0FF' },
    reopened: { icon: '🔓', bg: '#FECDD3' },
    feedback: { icon: '⭐', bg: '#FEF3C7' },
    document_requested: { icon: '📎', bg: '#FDE68A' },
    document_resubmitted: { icon: '📄', bg: '#BFDBFE' },
  };
  return icons[type] || { icon: '•', bg: '#E5E7EB' };
}

function TimelineItem({ event, isLast }: { event: TimelineEntry; isLast: boolean }) {
  const { icon, bg } = getTimelineIcon(event.type);
  return (
    <div className="flex gap-3 relative pb-4">
      {!isLast && (
        <div className="absolute left-[13px] top-7 bottom-0 w-px bg-[#DDE3EE]" />
      )}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] flex-shrink-0 z-10 border-2 border-white"
        style={{ background: bg }}
      >
        {icon}
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-[12px] font-semibold text-[#0E1C2F]">{event.title}</p>
        <p className="text-[10px] text-[#7A8FA6] mt-0.5">
          {new Date(event.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · {event.actor}
        </p>
        {event.description && (
          <div className="mt-1.5 text-[11px] text-[#3D5068] bg-[#F0F2F7] px-3 py-2 rounded-lg border-l-2 border-[#C8D0DE] leading-relaxed">
            {event.description}
          </div>
        )}
      </div>
    </div>
  );
}

function CommLogItem({ log }: { log: { id: string; title: string; message: string; channels: string[]; actor: string; timestamp: string; icon: string; iconBg: string } }) {
  return (
    <div className="flex gap-3 py-3 border-b border-[#DDE3EE] last:border-0">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] flex-shrink-0 mt-0.5" style={{ background: log.iconBg }}>
        {log.icon}
      </div>
      <div className="flex-1">
        <p className="text-[12px] font-semibold text-[#0E1C2F] mb-1.5">{log.title}</p>
        <p className="text-[11px] text-[#3D5068] bg-[#F0F2F7] rounded-lg px-3 py-2 border border-[#DDE3EE] mb-2 italic leading-relaxed">
          &ldquo;{log.message}&rdquo;
        </p>
        <div className="flex items-center gap-2 flex-wrap text-[10px]">
          {log.channels.map(ch => (
            <span key={ch} className={cn('px-2 py-0.5 rounded-full font-semibold', ch === 'SMS' ? 'bg-amber-100 text-amber-700' : ch === 'Email' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700')}>
              {ch === 'SMS' ? '✉ SMS' : ch === 'Email' ? '📧 Email' : '💬 WhatsApp'}
            </span>
          ))}
          <span className="text-[#7A8FA6]">{log.actor} · {new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
        </div>
      </div>
    </div>
  );
}

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [complaint, setComplaint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'comms' | 'details'>('timeline');

  React.useEffect(() => {
    fetch(`/api/grievances/${id}`).then(r => r.json()).then(d => { setComplaint(d.data || d); setIsLoading(false); });
  }, [id]);

  const timeline = complaint?.timeline || [];
  const commLogs: any[] = [];

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-[13px] text-[#7A8FA6]">Loading complaint…</div>;
  }

  if (!complaint) {
    return (
      <div className="py-20 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-[16px] font-bold text-[#0E1C2F]">Complaint not found</p>
        <Link href="/portal/complaints" className="text-blue-600 text-[13px] mt-2 inline-block hover:underline">← Back to complaints</Link>
      </div>
    );
  }

  const [remark, setRemark] = useState('');
  const [notifyVia, setNotifyVia] = useState('SMS + Email');
  const [newStatus, setNewStatus] = useState('');
  const [acting, setActing] = useState(false);
  const [popup, setPopup] = useState<ActionPopupData | null>(null);
  const [showDocReqModal, setShowDocReqModal] = useState(false);
  const [docReqNote, setDocReqNote] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveNotes, setResolveNotes] = useState('');

  const user = JSON.parse(localStorage.getItem('gms-auth') || '{}')?.state?.user;

  async function patchAction(action: string, extra: Record<string, any> = {}) {
    setActing(true);
    try {
      const res = await fetch(`/api/grievances/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, actorId: user?.id, ...extra }),
      });
      const d = await res.json();
      if (!res.ok || !d.data) throw new Error(d.error || 'Action failed');
      setComplaint(d.data);
      return d.data;
    } finally {
      setActing(false);
    }
  }

  async function handleSendUpdate() {
    if (!remark.trim()) {
      setPopup({ type: 'error', title: 'Message required', description: 'Please enter an update message before sending.' });
      return;
    }
    try {
      await patchAction('send_update', { message: remark });
      setRemark('');
      setPopup({
        type: 'send_update',
        token: complaint.token,
        title: 'Update Sent to Citizen',
        description: `Your update has been delivered to the citizen. They will be notified via ${notifyVia}.`,
        meta: [{ label: 'Notification channel', value: notifyVia }],
      });
    } catch (e: any) {
      setPopup({ type: 'error', title: 'Failed to send update', description: e.message });
    }
  }

  async function handleResolve() {
    if (!resolveNotes.trim()) {
      setPopup({ type: 'error', title: 'Resolution notes required', description: 'Please enter resolution notes before marking this grievance as resolved.' });
      return;
    }
    try {
      const updated = await patchAction('resolve', { resolutionNotes: resolveNotes });
      setShowResolveModal(false);
      setResolveNotes('');
      setPopup({
        type: 'resolve',
        token: complaint.token,
        title: 'Grievance Resolved Successfully',
        description: 'The grievance has been marked as resolved. The citizen has been notified and a satisfaction survey has been sent.',
        meta: [
          { label: 'New Status', value: 'Resolved' },
          { label: 'Resolved at', value: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) },
        ],
      });
    } catch (e: any) {
      setPopup({ type: 'error', title: 'Could not resolve grievance', description: e.message });
    }
  }

  async function handleEscalate() {
    try {
      await patchAction('escalate');
      setPopup({
        type: 'escalate',
        token: complaint.token,
        title: 'Grievance Escalated',
        description: 'The grievance has been escalated to senior authority for urgent review. The citizen has been notified.',
        meta: [
          { label: 'New Status', value: 'Escalated' },
          { label: 'Notified', value: 'Supervisor + Citizen' },
        ],
      });
    } catch (e: any) {
      setPopup({ type: 'error', title: 'Could not escalate grievance', description: e.message });
    }
  }

  async function handleAcknowledge() {
    try {
      await patchAction('acknowledge');
      setPopup({
        type: 'acknowledge',
        token: complaint.token,
        title: 'Grievance Acknowledged',
        description: 'You have acknowledged this grievance. The citizen has been notified via SMS that their complaint is under review.',
        meta: [
          { label: 'New Status', value: 'Acknowledged' },
          { label: 'Citizen notified', value: 'SMS sent' },
        ],
      });
    } catch (e: any) {
      setPopup({ type: 'error', title: 'Could not acknowledge grievance', description: e.message });
    }
  }

  function handleReassign() { router.push('/portal/reassign'); }

  async function handleRequestDocument() {
    if (!docReqNote.trim()) {
      setPopup({ type: 'error', title: 'Note required', description: 'Please explain what document is needed before submitting the request.' });
      return;
    }
    try {
      await patchAction('request_document', { requestNote: docReqNote });
      setShowDocReqModal(false);
      setDocReqNote('');
      setPopup({
        type: 'request_document',
        token: complaint.token,
        title: 'Document Requested',
        description: 'The citizen has been notified and asked to resubmit the grievance with the required document.',
        meta: [
          { label: 'New Status', value: 'Action Required' },
          { label: 'Citizen notified', value: 'SMS + In-app' },
        ],
      });
    } catch (e: any) {
      setPopup({ type: 'error', title: 'Request failed', description: e.message });
    }
  }

  return (
    <div>
      {/* Action result popup */}
      {popup && <ActionPopup data={popup} onClose={() => setPopup(null)} />}

      {/* Seek Information modal */}
      {showDocReqModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(14,28,47,0.55)', backdropFilter: 'blur(3px)' }} onClick={() => setShowDocReqModal(false)}>
          <div className="bg-white rounded-[14px] w-full max-w-[600px] shadow-xl overflow-hidden border border-[#E5E7EB]" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 pt-5 pb-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[16px] font-bold text-[#0E1C2F]">Seek Information from Citizen</h2>
                <span className="text-[11px] font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Document Request</span>
              </div>
              <p className="text-[11px] text-[#7A8FA6]">Request additional documents or information. Citizen will be notified and can edit their grievance to add the required details.</p>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-4">
              {/* Information Request */}
              <div>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-2 uppercase tracking-wide">What information do you need? <span className="text-red-500">*</span></label>
                <textarea
                  value={docReqNote}
                  onChange={e => setDocReqNote(e.target.value)}
                  rows={4}
                  placeholder="Describe the documents or information needed from the citizen (e.g., 'Please attach photos of the affected area', 'Provide a copy of your utility bill', 'Submit the repair estimate')..."
                  className="w-full px-4 py-3 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] text-[#0E1C2F] resize-none outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
                <p className="text-[10px] text-[#7A8FA6] mt-1.5">Be specific about what you need (photos, documents, utility bills, etc.)</p>
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-2 uppercase tracking-wide">Notify citizen via</label>
                  <select className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] text-[#3D5068] font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all">
                    <option value="SMS + Email">📱 SMS + 📧 Email</option>
                    <option value="SMS">📱 SMS only</option>
                    <option value="Email">📧 Email only</option>
                    <option value="WhatsApp">💬 WhatsApp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-2 uppercase tracking-wide">Mark status as</label>
                  <select className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] text-[#3D5068] font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all">
                    <option value="document_requested">🔔 Action Required</option>
                    <option value="pending_info">⏳ Pending Information</option>
                    <option value="under_review">🔍 Under Review</option>
                  </select>
                </div>
              </div>

              {/* Info box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-[10px] p-4">
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  <strong className="text-blue-900">✓ What happens:</strong> The citizen receives a notification with your request. They can log in and edit their grievance to add the requested documents or information. The grievance becomes editable for them temporarily.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDocReqModal(false)}
                  className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border-2 border-[#DDE3EE] text-[#3D5068] bg-white hover:bg-[#F8F9FA] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestDocument}
                  disabled={acting || !docReqNote.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12px] font-bold text-white disabled:opacity-50 transition-colors hover:shadow-lg"
                  style={{ background: '#2563EB' }}
                >
                  ↗ Send Request & Notify Citizen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Grievance modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(14,28,47,0.55)', backdropFilter: 'blur(3px)' }} onClick={() => setShowResolveModal(false)}>
          <div className="bg-white rounded-[18px] w-full max-w-[420px] shadow-[0_8px_40px_rgba(14,28,47,0.22)] overflow-hidden border border-green-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4 bg-green-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[20px]">✅</div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#0E1C2F]">Mark Grievance as Resolved</h2>
                  <p className="text-[11px] text-[#7A8FA6]">Please document how this grievance was resolved</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5 uppercase tracking-wide">Resolution Details <span className="text-red-500">*</span></label>
              <textarea
                value={resolveNotes}
                onChange={e => setResolveNotes(e.target.value)}
                rows={5}
                placeholder="Describe how you resolved this grievance. Include actions taken, outcome, and any follow-up required..."
                className="w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] resize-none outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/10 transition-colors"
              />
              <p className="text-[10px] text-[#7A8FA6] mt-1.5">This resolution summary will be sent to the citizen and added to the grievance record.</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowResolveModal(false)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white hover:bg-[#F0F2F7] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleResolve}
                  disabled={acting || !resolveNotes.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12px] font-semibold text-white disabled:opacity-50 transition-colors"
                  style={{ background: '#16A34A' }}
                >
                  <CheckCircle size={13} /> Confirm Resolution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back + breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <Link href="/portal/complaints" className="flex items-center gap-1.5 text-[12px] text-[#7A8FA6] hover:text-[#3D5068] transition-colors">
          <ArrowLeft size={14} /> All Complaints
        </Link>
        <span className="text-[#DDE3EE]">/</span>
        <span className="text-[12px] text-[#0E1C2F] font-semibold font-mono">{complaint.token}</span>
      </div>

      {/* Header */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-5 mb-4 shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[13px] font-bold text-blue-600 font-mono">{complaint.token}</span>
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
              <SLABadge slaStatus={complaint.slaStatus} slaDaysLeft={complaint.slaDaysLeft} />
              {complaint.groupId && (
                <span className="text-[10px] font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                  🔗 Grouped
                </span>
              )}
              {complaint.status === 'acknowledged' && (
                <span className="text-[10px] font-semibold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full">
                  ✋ Acknowledged
                </span>
              )}
            </div>
            <h1 className="text-[18px] font-bold text-[#0E1C2F] mb-1">{complaint.title}</h1>
            <p className="text-[12px] text-[#7A8FA6]">
              Filed via <ChannelBadge channel={complaint.channel} className="ml-1" /> ·
              <span className="ml-1">{complaint.citizenName} · {complaint.citizenPhone}</span> ·
              <span className="ml-1">{complaint.ward}, {complaint.district}</span>
            </p>
          </div>
          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap flex-shrink-0">
            {!['acknowledged', 'in_progress', 'under_review', 'escalated', 'resolved', 'closed'].includes(complaint.status) && (
              <button onClick={handleAcknowledge} disabled={acting} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-800 text-[12px] font-semibold rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50">
                ✋ Acknowledge
              </button>
            )}
            {!['resolved', 'closed', 'document_requested'].includes(complaint.status) && (
              <button onClick={() => { setDocReqNote(''); setShowDocReqModal(true); }} disabled={acting} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-[12px] font-semibold rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50">
                ↗ Seek Information
              </button>
            )}
            <button onClick={handleReassign} disabled={acting} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-[12px] font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50">
              <RotateCcw size={13} /> Reassign
            </button>
            <button onClick={() => router.push('/portal/grouped')} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-[12px] font-semibold rounded-lg hover:bg-purple-700 transition-colors">
              <Link2 size={13} /> Group
            </button>
            {complaint.status !== 'resolved' && complaint.status !== 'closed' && complaint.status !== 'escalated' && (
              <button onClick={handleEscalate} disabled={acting} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EE] text-[#3D5068] text-[12px] font-semibold rounded-lg hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50">
                <AlertTriangle size={13} /> Escalate
              </button>
            )}
            {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
              <button onClick={() => setShowResolveModal(true)} disabled={acting} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-[12px] font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                <CheckCircle size={13} /> {acting ? 'Resolving…' : 'Resolve'}
              </button>
            )}
            {complaint.status === 'resolved' && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-300 text-green-700 text-[12px] font-semibold rounded-lg">
                <CheckCircle size={13} /> Resolved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status banners */}
      {complaint.status === 'resolved' && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-[12px] px-5 py-3.5 mb-4">
          <span className="text-[22px]">✅</span>
          <div>
            <p className="text-[13px] font-bold text-green-800">Grievance Resolved</p>
            <p className="text-[11px] text-green-700">
              {complaint.resolvedAt
                ? `Resolved on ${new Date(complaint.resolvedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`
                : 'This grievance has been successfully resolved.'
              } · Citizen satisfaction survey sent.
            </p>
          </div>
        </div>
      )}
      {complaint.status === 'escalated' && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-[12px] px-5 py-3.5 mb-4">
          <span className="text-[22px]">🚨</span>
          <div>
            <p className="text-[13px] font-bold text-red-800">Grievance Escalated</p>
            <p className="text-[11px] text-red-700">This grievance has been escalated to senior authority for urgent attention.</p>
          </div>
        </div>
      )}
      {complaint.status === 'document_requested' && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-[12px] px-5 py-3.5 mb-4">
          <span className="text-[22px]">📎</span>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-amber-800">Document Requested — Awaiting Citizen Response</p>
            {complaint.documentRequest && (
              <p className="text-[11px] text-amber-700 mt-0.5">
                <span className="font-semibold">Requested by:</span> {complaint.documentRequest.requestedByName} ·{' '}
                <span className="font-semibold">Note:</span> {complaint.documentRequest.note}
              </p>
            )}
          </div>
        </div>
      )}
      {complaint.isResubmitted && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-[12px] px-5 py-3.5 mb-4">
          <span className="text-[22px]">📄</span>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-blue-800">Document Resubmitted by Citizen</p>
            <p className="text-[11px] text-blue-700 space-y-2">
              <div>The citizen has updated this grievance with additional documents.</div>
              {complaint.resubmittedAttachmentUrl && (
                <a
                  href={complaint.resubmittedAttachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline font-semibold"
                >
                  <Paperclip size={12} /> View Attachment
                </a>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left: main content */}
        <div className="xl:col-span-2 space-y-4">

          {/* Citizen description */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
            <div className="px-4 py-3 border-b border-[#DDE3EE]">
              <span className="text-[12px] font-bold text-[#0E1C2F]">Citizen Description</span>
            </div>
            <div className="p-4">
              <p className="text-[13px] text-[#3D5068] italic leading-relaxed bg-[#F0F2F7] rounded-lg px-4 py-3 border-l-3 border-[#C8D0DE]">
                &ldquo;{complaint.description}&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-[#7A8FA6]">
                <ChannelBadge channel={complaint.channel} />
                <span>Filed {new Date(complaint.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                <span>· AI auto-classified (94% confidence)</span>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {(complaint.attachments?.length || complaint.resubmittedAttachmentUrl) && (
            <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
              <div className="px-4 py-3 border-b border-[#DDE3EE]">
                <span className="text-[12px] font-bold text-[#0E1C2F] flex items-center gap-2">
                  <Paperclip size={14} className="text-blue-600" /> Attached Documents
                </span>
              </div>
              <div className="p-4 space-y-2">
                {complaint.attachments?.map((url: string, idx: number) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#F0F2F7] hover:bg-[#E5E7EB] rounded-lg transition-colors border border-[#DDE3EE]"
                  >
                    <FileText size={16} className="text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[#0E1C2F] truncate">Document {idx + 1}</p>
                      <p className="text-[10px] text-[#7A8FA6]">Filed with grievance</p>
                    </div>
                    <Download size={14} className="text-[#7A8FA6] flex-shrink-0" />
                  </a>
                ))}
                {complaint.resubmittedAttachmentUrl && (
                  <a
                    href={complaint.resubmittedAttachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                  >
                    <FileText size={16} className="text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-green-800 truncate">Resubmitted Document</p>
                      <p className="text-[10px] text-green-700">Uploaded by citizen</p>
                    </div>
                    <Download size={14} className="text-green-600 flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* AI suggestion */}
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-xl px-4 py-3.5 flex gap-3">
            <span className="text-[18px] flex-shrink-0 mt-0.5">🤖</span>
            <div>
              <p className="text-[12px] font-semibold text-[#0E1C2F]">AI Insight</p>
              <p className="text-[11px] text-[#3D5068] mt-0.5 leading-relaxed">
                This appears to be a <strong>pipeline blockage or valve closure</strong> issue in Zone 3 distribution network.
                Similar complaint was resolved 14 days ago in adjacent Ward 6 (GVM-2025-04901).
                Check GWSSB Zone 3 valve map before site visit.
              </p>
            </div>
          </div>

          {/* Timeline / Comms / Details tabs */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
            <div className="flex border-b border-[#DDE3EE]">
              {(['timeline', 'comms', 'details'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-5 py-3 text-[12px] font-semibold border-b-2 transition-all capitalize',
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-[#7A8FA6] hover:text-[#3D5068]'
                  )}
                >
                  {tab === 'timeline' ? 'Action Timeline' : tab === 'comms' ? 'Citizen Comms' : 'Details'}
                </button>
              ))}
            </div>
            <div className="p-4">
              {activeTab === 'timeline' && (
                <div>
                  {timeline.length === 0 ? (
                    <p className="text-[12px] text-[#7A8FA6] text-center py-8">No timeline events yet.</p>
                  ) : (
                    timeline.map((event: TimelineEntry, i: number) => (
                      <TimelineItem key={event.id} event={event} isLast={i === timeline.length - 1} />
                    ))
                  )}
                  {/* Pending step */}
                  <div className="flex gap-3 opacity-50">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 border-[#C8D0DE] text-[#7A8FA6] bg-white flex-shrink-0">
                      {timeline.length + 1}
                    </div>
                    <div className="pt-1">
                      <p className="text-[12px] font-semibold text-[#7A8FA6]">Resolution & closure</p>
                      <p className="text-[10px] text-[#7A8FA6]">Pending · SLA deadline in {complaint.slaDaysLeft}d</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'comms' && (
                <div>
                  {commLogs.length === 0 ? (
                    <p className="text-[12px] text-[#7A8FA6] text-center py-8">No communications logged yet.</p>
                  ) : (
                    commLogs.map(log => <CommLogItem key={log.id} log={log} />)
                  )}
                </div>
              )}
              {activeTab === 'details' && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[12px]">
                  {[
                    { label: 'Token', value: complaint.token },
                    { label: 'Category', value: complaint.category },
                    { label: 'Department', value: complaint.department },
                    { label: 'District', value: complaint.district },
                    { label: 'Ward', value: complaint.ward ?? '—' },
                    { label: 'Location', value: complaint.location },
                    { label: 'Citizen', value: complaint.citizenName },
                    { label: 'Phone', value: complaint.citizenPhone },
                    { label: 'Filed At', value: new Date(complaint.createdAt).toLocaleString('en-IN') },
                    { label: 'Last Updated', value: new Date(complaint.updatedAt).toLocaleString('en-IN') },
                    { label: 'Assigned To', value: complaint.assignedTo?.name ?? 'Unassigned' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] font-semibold text-[#7A8FA6] uppercase tracking-wide mb-0.5">{label}</p>
                      <p className="text-[#0E1C2F] font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Send update to citizen */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
            <div className="px-4 py-3 border-b border-[#DDE3EE] flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#0E1C2F]">Send Update to Citizen</span>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                SMS + Email triggered on submit
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Update message to citizen</label>
                <textarea
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  rows={3}
                  placeholder="Type the update to share with the citizen (e.g. field visit completed, issue identified, expected resolution by...)..."
                  className="w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Update status to</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE3EE] rounded-lg text-[12px] text-[#3D5068] outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">Keep current</option>
                    <option>In Progress</option>
                    <option>Site visit done</option>
                    <option>Pending material</option>
                    <option>Under Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Notify citizen via</label>
                  <select
                    value={notifyVia}
                    onChange={e => setNotifyVia(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE3EE] rounded-lg text-[12px] text-[#3D5068] outline-none focus:border-blue-500 transition-colors"
                  >
                    <option>SMS + Email</option>
                    <option>SMS only</option>
                    <option>Email only</option>
                    <option>WhatsApp</option>
                    <option>No notification</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSendUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
              >
                <Send size={13} /> Send Update & Notify Citizen
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Quick info */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
            <div className="px-4 py-3 border-b border-[#DDE3EE]">
              <span className="text-[12px] font-bold text-[#0E1C2F]">Complaint Info</span>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Status', node: <StatusBadge status={complaint.status} /> },
                { label: 'Priority', node: <PriorityBadge priority={complaint.priority} /> },
                { label: 'SLA', node: <SLABadge slaStatus={complaint.slaStatus} slaDaysLeft={complaint.slaDaysLeft} /> },
                { label: 'Channel', node: <ChannelBadge channel={complaint.channel} /> },
              ].map(({ label, node }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] text-[#7A8FA6] font-medium">{label}</span>
                  {node}
                </div>
              ))}
            </div>
          </div>

          {/* Assigned officer */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
            <div className="px-4 py-3 border-b border-[#DDE3EE]">
              <span className="text-[12px] font-bold text-[#0E1C2F]">Assigned Officer</span>
            </div>
            <div className="p-4">
              {complaint.assignedTo ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white" style={{ backgroundColor: complaint.assignedTo.color }}>
                    {complaint.assignedTo.initials}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#0E1C2F]">{complaint.assignedTo.name}</p>
                    <p className="text-[11px] text-[#7A8FA6]">{complaint.assignedTo.role}</p>
                    <p className="text-[10px] text-[#7A8FA6]">{complaint.assignedTo.department}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[12px] text-[#7A8FA6]">
                  <User size={14} />
                  <span>Not assigned yet</span>
                </div>
              )}
              <button
                onClick={handleReassign}
                className="mt-3 w-full py-1.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#3D5068] font-semibold hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                Change assignment
              </button>
            </div>
          </div>

          {/* Citizen info */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
            <div className="px-4 py-3 border-b border-[#DDE3EE]">
              <span className="text-[12px] font-bold text-[#0E1C2F]">Citizen</span>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-[13px] font-semibold text-[#0E1C2F]">{complaint.citizenName}</p>
              <p className="text-[12px] text-[#3D5068]">{complaint.citizenPhone}</p>
              {complaint.citizenEmail && <p className="text-[12px] text-[#7A8FA6]">{complaint.citizenEmail}</p>}
              <p className="text-[11px] text-[#7A8FA6]">📍 {complaint.location}</p>
              <div className="flex gap-2 pt-1">
                <button onClick={() => toast.info('Opening call...')} className="flex-1 py-1.5 bg-green-50 border border-green-200 text-green-700 text-[11px] font-semibold rounded-lg hover:bg-green-100 transition-colors">
                  📞 Call
                </button>
                <button onClick={() => toast.info('Sending SMS...')} className="flex-1 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                  ✉ SMS
                </button>
              </div>
            </div>
          </div>

          {/* Resolve checklist */}
          {complaint.status !== 'resolved' && (
            <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
              <div className="px-4 py-3 border-b border-[#DDE3EE]">
                <span className="text-[12px] font-bold text-[#0E1C2F]">Resolution Checklist</span>
              </div>
              <div className="p-4 space-y-2">
                {[
                  'Root cause identified', 'On-ground action taken',
                  'Evidence documented', 'Citizen informed of resolution',
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-green-600 cursor-pointer" />
                    <span className="text-[12px] text-[#3D5068]">{item}</span>
                  </label>
                ))}
                <button
                  onClick={handleResolve}
                  className="w-full mt-2 py-2 bg-green-600 text-white text-[12px] font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  ✅ Mark as Resolved
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
