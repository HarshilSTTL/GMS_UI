'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, User, MapPin, Phone, Building, Calendar, Star, RefreshCw, AlertTriangle, MessageSquare, Download, Send, CheckCircle, FileText, Paperclip, Upload } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Grievance {
  id: string; token: string; title: string; description: string; category: string;
  department: string; status: string; priority: string; channel: string;
  slaStatus: string; slaDaysLeft: number; location: string; ward: string;
  district: string; officer: string; officerDept: string;
  submittedDate: string; updatedAt: string; resolvedAt?: string;
  feedback: string | null; rating: number | null;
  documentRequest?: { note: string; requestedBy: string; requestedByName: string; requestedAt: string };
  isResubmitted?: boolean;
  resubmittedAttachment?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FFFBEB' },
  in_progress: { label: 'In Progress', color: '#1A56C4', bg: '#EBF2FF' },
  resolved: { label: 'Resolved', color: '#16A34A', bg: '#F0FDF4' },
  escalated: { label: 'Escalated', color: '#DC2626', bg: '#FEF2F2' },
  acknowledged: { label: 'Acknowledged', color: '#0891B2', bg: '#ECFEFF' },
  under_review: { label: 'Under Review', color: '#7C3AED', bg: '#F5F3FF' },
  document_requested: { label: 'Action Required', color: '#B45309', bg: '#FEF3C7' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  critical: { label: 'CRITICAL', color: '#DC2626' },
  high: { label: 'HIGH', color: '#D97706' },
  medium: { label: 'MEDIUM', color: '#1A56C4' },
  low: { label: 'LOW', color: '#16A34A' },
};

const TIMELINE_STEPS = [
  { label: 'Filed', desc: 'Grievance submitted via portal', icon: '📝', time: 'Same minute' },
  { label: 'Auto-Routed', desc: 'AI mapped to administrative unit', icon: '🤖', time: '< 5 min' },
  { label: 'In Progress', desc: 'Officer investigating', icon: '🔍', time: 'Per SLA' },
  { label: 'Action Taken', desc: 'Resolution implemented', icon: '✅', time: 'Within SLA' },
  { label: 'Resolved', desc: 'Pending your feedback', icon: '🎉', time: 'On completion' },
];

export default function GrievanceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [g, setG] = useState<Grievance | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'reopen' | 'feedback' | 'escalate' | 'contact' | null>(null);
  const [reason, setReason] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [modalStep, setModalStep] = useState(0);
  const [resubDesc, setResubDesc] = useState('');
  const [resubFile, setResubFile] = useState<File | null>(null);
  const [resubmitting, setResubmitting] = useState(false);
  const [resubDone, setResubDone] = useState(false);

  function loadGrievance() {
    return fetch(`/api/grievances/${id}`)
      .then(r => r.json())
      .then(d => {
        const data = d.data || d;
        if (!data?.id) return;
        setG({
          ...data,
          submittedDate: data.createdAt || data.submittedDate,
          officer: data.assignedTo?.name || data.officer || 'Unassigned',
          officerDept: data.assignedTo?.department || data.officerDept || '',
          status: data.status === 'open' ? 'pending' : data.status,
        });
      });
  }

  useEffect(() => {
    loadGrievance().finally(() => setLoading(false));

    // Re-fetch when tab regains focus so citizen sees officer's status changes
    function onFocus() { loadGrievance().catch(() => {}); }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [id]);

  async function handleAction() {
    if (!g) return;
    const user = JSON.parse(localStorage.getItem('gms-auth') || '{}')?.state?.user;
    try {
      if (modal === 'reopen') {
        if (!reason) return toast.error('Please provide a reason for reopening');
        const res = await fetch(`/api/grievances/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'reopen', actorId: user?.id, reopenReason: reason })
        });
        const result = await res.json();
        if (result.data) {
          const mapped = { ...result.data, submittedDate: result.data.createdAt, officer: result.data.assignedTo?.name || 'Unassigned', officerDept: result.data.assignedTo?.department || '', status: result.data.status === 'open' ? 'pending' : result.data.status };
          setG(mapped);
          setModalStep(1);
          toast.success(`🔓 Grievance reopened successfully\nStatus changed to Open\nOfficer has been notified`);
        } else {
          toast.error(result.error || 'Failed to reopen grievance');
        }
      } else if (modal === 'feedback') {
        if (!rating) return toast.error('Please select a rating');
        const res = await fetch(`/api/grievances/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'feedback', actorId: user?.id, feedbackText: comment, rating })
        });
        const result = await res.json();
        if (result.data) {
          const mapped = { ...result.data, submittedDate: result.data.createdAt, officer: result.data.assignedTo?.name || 'Unassigned', officerDept: result.data.assignedTo?.department || '', status: result.data.status === 'open' ? 'pending' : result.data.status };
          setG(mapped);
          setModalStep(1);
          toast.success(`⭐ Thank you for your feedback!\nYour rating: ${rating}/5 stars has been recorded`);
        } else {
          toast.error(result.error || 'Failed to submit feedback');
        }
      } else if (modal === 'escalate') {
        if (!reason) return toast.error('Please select a reason for escalation');
        const res = await fetch(`/api/grievances/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'escalate', actorId: user?.id, escalationReason: reason })
        });
        const result = await res.json();
        if (result.data) {
          const mapped = { ...result.data, submittedDate: result.data.createdAt, officer: result.data.assignedTo?.name || 'Unassigned', officerDept: result.data.assignedTo?.department || '', status: result.data.status === 'open' ? 'pending' : result.data.status };
          setG(mapped);
          setModalStep(1);
          toast.warning(`🚨 Grievance escalated to higher authority\nStatus changed to Escalated\nYou will receive priority updates`);
        } else {
          toast.error(result.error || 'Failed to escalate grievance');
        }
      } else if (modal === 'contact') {
        setModalStep(1);
        toast.success(`💬 Message sent to ${g.officer}\nExpect a response within 24 hours`);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }

  async function handleResubmit() {
    if (!g) return;
    const user = JSON.parse(localStorage.getItem('gms-auth') || '{}')?.state?.user;
    setResubmitting(true);
    try {
      let attachmentUrl: string | undefined;

      // Upload file to Cloudinary if provided
      if (resubFile) {
        const uploadForm = new FormData();
        uploadForm.append('file', resubFile);
        uploadForm.append('grievanceId', id);

        const uploadRes = await fetch('/api/documents/upload', {
          method: 'POST',
          body: uploadForm,
        });

        const uploadResult = await uploadRes.json();
        if (!uploadResult.success) {
          toast.error(`Upload failed: ${uploadResult.error}`);
          setResubmitting(false);
          return;
        }

        attachmentUrl = uploadResult.data.url;
      }

      // Resubmit with attachment URL
      const res = await fetch(`/api/grievances/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resubmit_document',
          actorId: user?.id,
          newDescription: resubDesc.trim() || undefined,
          attachmentUrl: attachmentUrl,
        }),
      });
      const result = await res.json();
      if (result.data) {
        const data = result.data;
        setG({
          ...data,
          submittedDate: data.createdAt || data.submittedDate,
          officer: data.assignedTo?.name || data.officer || 'Unassigned',
          officerDept: data.assignedTo?.department || data.officerDept || '',
          status: data.status,
        });
        setResubDone(true);
        setResubFile(null);
        toast.success('✅ Document resubmitted successfully');
      } else {
        toast.error(result.error || 'Failed to resubmit');
      }
    } catch (error) {
      toast.error(`An error occurred: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setResubmitting(false);
    }
  }

  if (loading || !g) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /></div>;
  }

  const sc = STATUS_CONFIG[g.status] || STATUS_CONFIG.pending;
  const pc = PRIORITY_CONFIG[g.priority] || PRIORITY_CONFIG.medium;
  const slaColor = g.slaDaysLeft < 0 ? '#DC2626' : g.slaDaysLeft <= 2 ? '#D97706' : '#16A34A';
  const currentStepIdx = ['pending', 'acknowledged'].includes(g.status) ? 0 : g.status === 'in_progress' ? 2 : g.status === 'escalated' ? 2 : g.status === 'resolved' ? 4 : 1;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/citizen/grievances')} className="w-8 h-8 rounded-lg bg-[#F0F2F7] flex items-center justify-center hover:bg-[#DDE3EE] transition-colors">
          <ArrowLeft size={16} className="text-[#3D5068]" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[16px] font-bold text-[#0E1C2F]">{g.title}</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ color: pc.color, background: pc.color + '18', textTransform: 'uppercase' }}>{pc.label}</span>
          </div>
          <p className="text-[11px] text-[#7A8FA6] font-mono">{g.token}</p>
        </div>
        <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ color: sc.color, background: sc.bg }}>{sc.label}</span>
      </div>

      {/* Action Required Banner */}
      {g.status === 'document_requested' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-[14px] p-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-[28px] flex-shrink-0">📎</span>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-amber-900">Action Required: Additional Document Needed</p>
              {g.documentRequest && (
                <p className="text-[12px] text-amber-800 mt-1 leading-relaxed">
                  <span className="font-semibold">{g.documentRequest.requestedByName}</span> has requested an additional document:{' '}
                  <span className="italic">&ldquo;{g.documentRequest.note}&rdquo;</span>
                </p>
              )}
              <p className="text-[11px] text-amber-700 mt-1">Please update your description and attach the requested document below, then resubmit.</p>
            </div>
          </div>

          {resubDone ? (
            <div className="bg-green-50 border border-green-200 rounded-[10px] p-4 flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-[13px] font-bold text-green-800">Resubmitted Successfully</p>
                <p className="text-[11px] text-green-700">Your grievance is back in progress. The officer has been notified.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[12px] border border-amber-200 p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Update Description (optional)</label>
                <textarea
                  value={resubDesc}
                  onChange={e => setResubDesc(e.target.value)}
                  rows={3}
                  placeholder={g.description}
                  className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-amber-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Attach Document</label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#DDE3EE] rounded-[10px] cursor-pointer hover:border-amber-400 transition-colors bg-[#FAFBFC]">
                  <Upload size={16} className="text-[#7A8FA6] flex-shrink-0" />
                  <span className="text-[12px] text-[#7A8FA6]">
                    {resubFile ? resubFile.name : 'Click to select a file (photo, PDF, etc.)'}
                  </span>
                  <input type="file" className="hidden" onChange={e => setResubFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              <button
                onClick={handleResubmit}
                disabled={resubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[13px] font-bold text-white disabled:opacity-60 transition-colors"
                style={{ background: '#D97706' }}
              >
                {resubmitting
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Resubmitting...</>
                  : <><Send size={14} /> Resubmit Grievance</>
                }
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Details Card */}
          <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
            <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-4">Grievance Details</h2>
            <p className="text-[12px] text-[#3D5068] leading-relaxed mb-4">{g.description}</p>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              {[
                { icon: FileText, label: 'Category', value: g.category },
                { icon: MapPin, label: 'Location', value: g.location },
                { icon: Building, label: 'Department', value: g.department },
                { icon: User, label: 'Assigned To', value: g.officer === 'Unassigned' ? 'Pending Assignment' : `${g.officer} (${g.officerDept})` },
                { icon: Calendar, label: 'Filed On', value: new Date(g.submittedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
                { icon: Phone, label: 'Channel', value: g.channel },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-2 p-2.5 rounded-lg bg-[#F0F2F7]">
                  <item.icon size={13} className="text-[#7A8FA6] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#7A8FA6]">{item.label}</p>
                    <p className="text-[11px] font-semibold text-[#0E1C2F]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            {g.feedback && (
              <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-[10px]">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] text-[#7A8FA6]">Your Rating:</span>
                  {[1,2,3,4,5].map(n => <Star key={n} size={12} className={n <= (g.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />)}
                </div>
                <p className="text-[11px] text-[#3D5068]">{g.feedback}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
            <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-4">Grievance Timeline</h2>
            <div className="space-y-0">
              {TIMELINE_STEPS.map((step, idx) => {
                const isDone = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${isDone ? 'bg-[#F4811F] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {isDone ? <CheckCircle size={16} /> : <span className="text-[10px]">{idx + 1}</span>}
                      </div>
                      {idx < TIMELINE_STEPS.length - 1 && (
                        <div className={`w-0.5 h-8 ${idx < currentStepIdx ? 'bg-[#F4811F]' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-[12px] font-semibold ${isDone ? 'text-[#0E1C2F]' : 'text-[#7A8FA6]'}`}>{step.label}</p>
                      <p className="text-[11px] text-[#7A8FA6]">{step.desc}</p>
                      <p className="text-[10px] text-[#7A8FA6] mt-0.5">{step.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* SLA Card */}
          <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
            <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-3">SLA Status</h2>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-[24px] font-bold" style={{ color: slaColor }}>{g.slaDaysLeft < 0 ? Math.abs(g.slaDaysLeft) : g.slaDaysLeft}</span>
              <span className="text-[12px] text-[#7A8FA6] mb-1">{g.slaDaysLeft < 0 ? 'days overdue' : 'days remaining'}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${g.slaDaysLeft < 0 ? 100 : Math.max(0, ((7 - g.slaDaysLeft) / 7) * 100)}%`, background: slaColor }} />
            </div>
            <p className="text-[10px] text-[#7A8FA6] mt-1.5">Last updated: {new Date(g.updatedAt).toLocaleDateString('en-IN')}</p>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
            <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-3">Actions</h2>
            <div className="space-y-2">
              {g.status === 'resolved' && (
                <>
                  {!g.rating && (
                    <button onClick={() => { setModal('feedback'); setModalStep(0); setRating(0); setComment(''); }} className="w-full flex items-center gap-2.5 p-3 rounded-[10px] bg-[#F0F2F7] hover:bg-[#DDE3EE] transition-colors text-left">
                      <Star size={14} className="text-yellow-500" />
                      <span className="text-[12px] font-semibold text-[#0E1C2F]">Provide Feedback</span>
                    </button>
                  )}
                  <button onClick={() => { setModal('reopen'); setModalStep(0); setReason(''); }} className="w-full flex items-center gap-2.5 p-3 rounded-[10px] bg-[#F0F2F7] hover:bg-[#DDE3EE] transition-colors text-left">
                    <RefreshCw size={14} className="text-[#F4811F]" />
                    <span className="text-[12px] font-semibold text-[#0E1C2F]">Reopen Case</span>
                  </button>
                </>
              )}
              {g.status !== 'resolved' && g.status !== 'escalated' && (
                <button onClick={() => { setModal('escalate'); setModalStep(0); setReason(''); }} className="w-full flex items-center gap-2.5 p-3 rounded-[10px] bg-[#F0F2F7] hover:bg-[#DDE3EE] transition-colors text-left">
                  <AlertTriangle size={14} className="text-red-500" />
                  <span className="text-[12px] font-semibold text-[#0E1C2F]">Escalate Grievance</span>
                </button>
              )}
              {g.officer !== 'Unassigned' && (
                <button onClick={() => { setModal('contact'); setModalStep(0); setComment(''); }} className="w-full flex items-center gap-2.5 p-3 rounded-[10px] bg-[#F0F2F7] hover:bg-[#DDE3EE] transition-colors text-left">
                  <MessageSquare size={14} className="text-blue-600" />
                  <span className="text-[12px] font-semibold text-[#0E1C2F]">Contact Officer</span>
                </button>
              )}
            </div>
          </div>

          {/* Escalation Levels */}
          <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
            <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-3">Escalation Levels</h2>
            {[
              { level: 'Level 1', name: 'Medical Officer', time: '0–48 hrs' },
              { level: 'Level 2', name: 'Taluka Health Officer', time: 'After SLA breach' },
              { level: 'Level 3', name: 'Chief District Health Officer', time: '+24 hrs' },
              { level: 'Level 4', name: 'Director Health Services', time: '+24 hrs' },
              { level: 'Level 5', name: 'Principal Secretary HFWD', time: 'Apex' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-[#F0F2F7] last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#F4811F] text-white text-[10px] font-bold flex items-center justify-center">{idx + 1}</div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#0E1C2F]">{item.name}</p>
                    <p className="text-[9px] text-[#7A8FA6]">{item.level}</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#7A8FA6]">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => { setModal(null); setModalStep(0); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            {modalStep === 0 ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0E1C2F]">
                      {modal === 'reopen' && 'Reopen Case'}
                      {modal === 'feedback' && 'Provide Feedback'}
                      {modal === 'escalate' && 'Escalate Grievance'}
                      {modal === 'contact' && `Contact ${g.officer}`}
                    </h3>
                    <p className="text-[11px] text-[#7A8FA6] mt-1">
                      {modal === 'reopen' && 'Tell us why you are not satisfied with the resolution'}
                      {modal === 'feedback' && 'Rate how the grievance was handled'}
                      {modal === 'escalate' && 'Moves your case to higher authority'}
                      {modal === 'contact' && `Send a message to the assigned officer`}
                    </p>
                  </div>
                  <button onClick={() => setModal(null)} className="text-[#7A8FA6] hover:text-[#3D5068]">
                    <span className="text-lg">✕</span>
                  </button>
                </div>

                {(modal === 'reopen' || modal === 'escalate') && (
                  <div className="mb-3">
                    {modal === 'reopen' && (
                      <div className="bg-amber-50 border border-amber-100 rounded-[10px] p-3 text-[11px] text-amber-800 mb-3">
                        <AlertTriangle size={14} className="inline mr-1" /> Reopening will reset the SLA timer and reassign to the original officer.
                      </div>
                    )}
                    {modal === 'escalate' && (
                      <div className="bg-red-50 border border-red-100 rounded-[10px] p-3 text-[11px] text-red-800 mb-3">
                        <AlertTriangle size={14} className="inline mr-1" /> Escalating moves your case to Director Health Services. Use this only if SLA is breached.
                      </div>
                    )}
                    <select value={reason} onChange={e => setReason(e.target.value)} className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F]">
                      <option value="">Select a reason...</option>
                      {modal === 'escalate' ? (
                        <>
                          <option>SLA breached — no response</option>
                          <option>Officer denied service</option>
                          <option>Issue continues despite &quot;resolved&quot; status</option>
                          <option>Corruption / misconduct suspected</option>
                          <option>Other</option>
                        </>
                      ) : (
                        <>
                          <option>Issue not actually resolved</option>
                          <option>Problem recurred after resolution</option>
                          <option>Partial resolution only</option>
                          <option>Other</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                {modal === 'feedback' && (
                  <div className="mb-3 space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#3D5068] mb-2 block">How satisfied are you?</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(n => (
                          <button key={n} onClick={() => setRating(n)} className="p-0 border-none bg-transparent cursor-pointer">
                            <Star size={32} color={rating >= n ? '#F4811F' : '#DDE3EE'} fill={rating >= n ? '#F4811F' : '#DDE3EE'} />
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#7A8FA6] mt-1">{rating ? ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'][rating] : 'Select a rating'}</p>
                    </div>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Additional comments (optional)" rows={3} className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F] resize-none" />
                  </div>
                )}

                {modal === 'contact' && (
                  <div className="mb-3">
                    <div className="bg-[#F0F2F7] rounded-[10px] p-3 mb-3">
                      <p className="text-[12px] font-bold text-[#0E1C2F]">{g.officer}</p>
                      <p className="text-[10px] text-[#7A8FA6]">{g.officerDept} &middot; +91 79 2657 8800</p>
                    </div>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Type your message to the officer..." rows={4} className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F] resize-none" />
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold bg-[#F0F2F7] text-[#3D5068] border-none">Cancel</button>
                  <button onClick={handleAction} disabled={(modal === 'reopen' && !reason) || (modal === 'escalate' && !reason) || (modal === 'feedback' && !rating) || (modal === 'contact' && !comment)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-bold bg-[#F4811F] text-white border-none disabled:opacity-40 disabled:cursor-not-allowed">
                    {modal === 'reopen' && 'Reopen'}
                    {modal === 'feedback' && 'Submit Feedback'}
                    {modal === 'escalate' && 'Escalate'}
                    {modal === 'contact' && 'Send Message'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <CheckCircle size={48} className="text-[#F4811F] mx-auto mb-3" />
                <h3 className="text-[16px] font-bold text-[#0E1C2F] mb-2">
                  {modal === 'contact' ? 'Message Sent!' : 'Action Completed!'}
                </h3>
                <p className="text-[12px] text-[#7A8FA6] mb-4">
                  {modal === 'reopen' && 'Your case has been reopened. The officer will be notified.'}
                  {modal === 'feedback' && 'Thank you for your feedback. It helps us improve.'}
                  {modal === 'escalate' && 'Your grievance has been escalated. You will receive priority updates.'}
                  {modal === 'contact' && `Message sent to ${g.officer}. They typically respond within 24 hours.`}
                </p>
                <button onClick={() => { setModal(null); setModalStep(0); }} className="px-6 py-2.5 rounded-[10px] text-[12px] font-bold bg-[#F4811F] text-white border-none">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
