'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, RotateCcw, AlertTriangle, CheckCircle, Link2, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { StatusBadge, PriorityBadge, ChannelBadge, SLABadge } from '@/components/gms/StatusBadge';
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
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const user = JSON.parse(localStorage.getItem('gms-auth') || '{}')?.state?.user;

  function handleSendUpdate() {
    if (!remark.trim()) { toast.error('Please enter an update message.'); return; }
    fetch(`/api/grievances/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_update', actorId: user?.id, message: remark })
    }).then(r => r.json()).then(d => { if (d.data) setComplaint(d.data); });
    toast.success('Update sent & citizen notified via ' + notifyVia);
    setRemark('');
  }
  async function handleResolve() {
    const res = await fetch(`/api/grievances/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'resolve', actorId: user?.id }) });
    const d = await res.json(); if (d.data) setComplaint(d.data);
    toast.success(`GVM complaint ${complaint!.token} marked as resolved. CSAT survey sent to citizen.`);
  }
  async function handleEscalate() {
    const res = await fetch(`/api/grievances/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'escalate', actorId: user?.id }) });
    const d = await res.json(); if (d.data) setComplaint(d.data);
    toast.warning(`Complaint ${complaint!.token} escalated to L2.`);
  }
  async function handleAcknowledge() {
    setIsAcknowledged(true);
    const res = await fetch(`/api/grievances/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'acknowledge', actorId: user?.id }) });
    const d = await res.json(); if (d.data) setComplaint(d.data);
    toast.success('Case acknowledged. Citizen notified via SMS.');
  }
  function handleReassign() { router.push('/portal/reassign'); }

  return (
    <div>
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
              {isAcknowledged && (
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
            {!isAcknowledged && (
              <button onClick={handleAcknowledge} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-800 text-[12px] font-semibold rounded-lg hover:bg-amber-100 transition-colors">
                ✋ Acknowledge
              </button>
            )}
            <button onClick={handleReassign} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-[12px] font-semibold rounded-lg hover:bg-orange-600 transition-colors">
              <RotateCcw size={13} /> Reassign
            </button>
            <button onClick={() => router.push('/portal/grouped')} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-[12px] font-semibold rounded-lg hover:bg-purple-700 transition-colors">
              <Link2 size={13} /> Group
            </button>
            <button onClick={handleEscalate} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EE] text-[#3D5068] text-[12px] font-semibold rounded-lg hover:border-red-300 hover:text-red-600 transition-colors">
              <AlertTriangle size={13} /> Escalate
            </button>
            <button onClick={handleResolve} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-[12px] font-semibold rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle size={13} /> Resolve
            </button>
          </div>
        </div>
      </div>

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
