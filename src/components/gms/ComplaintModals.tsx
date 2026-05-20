'use client';
import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { StatusBadge, PriorityBadge, ChannelBadge } from '@/components/gms/StatusBadge';
import { DepartmentSelector, OfficerSelector } from '@/components/gms/ReassignComponents';
import type { Complaint, Officer } from '@/types';

/* ─── DIALOG TYPES ─── */
export type DialogType = 'view' | 'reassign' | 'group' | null;

/* ─── DEPARTMENT ICONS ─── */
export const DEPT_ICONS: Record<string, string> = {
  'GWSSB': '💧', 'AMC': '🏛', 'Revenue': '🏛', 'Roads & B': '🛣', 'Roads & Buildings': '🛣',
  'DGVCL': '⚙', 'Education': '📚', 'Health (CDHO)': '🏥', 'Agriculture': '🌾',
  'AMC Heritage Cell': '🏛', 'Revenue Department': '🏛',
};

/* ─── SIMILARITY ENGINE (mock AI) ─── */
export function computeSimilarity(a: Complaint, b: Complaint): number {
  if (a.id === b.id) return 0;
  let score = 0;
  if (a.category === b.category) score += 40;
  if (a.district === b.district) score += 20;
  if (a.ward && b.ward && a.ward === b.ward) score += 25;
  if (a.department === b.department) score += 15;
  return Math.min(score, 99);
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL 1 — VIEW DETAIL (modal-xl)
   ═══════════════════════════════════════════════════════════════════════════ */
export function ViewDetailDialog({
  complaint, complaints, officers, onClose,
  onAcknowledge, onReassign, onEscalate, onResolve, onSendUpdate,
  onOpenReassign, onOpenGroup,
}: {
  complaint: Complaint;
  complaints: Complaint[];
  officers: Officer[];
  onClose: () => void;
  onAcknowledge: (id: string) => void;
  onReassign: (id: string, officer: Officer) => void;
  onEscalate: (id: string) => void;
  onResolve: (id: string) => void;
  onSendUpdate: (id: string, msg: string) => void;
  onOpenReassign: () => void;
  onOpenGroup: () => void;
}) {
  const [remark, setRemark] = useState('');
  const [statusSel, setStatusSel] = useState<string>(complaint.status);
  const [notifChannel, setNotifChannel] = useState('sms_email');

  const similarCount = useMemo(
    () => complaints.filter(c => c.id !== complaint.id && computeSimilarity(complaint, c) >= 60).length,
    [complaints, complaint.id]
  );

  const slaTotal = 5;
  const slaElapsed = Math.max(0, slaTotal - complaint.slaDaysLeft);
  const slaPct = Math.min(100, Math.round((slaElapsed / slaTotal) * 100));

  const timeline = useMemo(() => {
    const items: { icon: string; bg: string; color: string; title: string; meta: string; desc?: string }[] = [
      { icon: '✓', bg: '#F0FDF4', color: '#16A34A', title: 'Complaint filed by citizen', meta: `${complaint.channel === 'whatsapp' ? 'Via WhatsApp' : complaint.channel === 'web' ? 'Via Web Portal' : complaint.channel === 'call' ? 'Via Call Centre' : complaint.channel === 'mobile' ? 'Via Mobile App' : 'Via Walk-in'} · ${new Date(complaint.createdAt).toLocaleDateString()}` },
      { icon: '✓', bg: '#F0FDF4', color: '#16A34A', title: 'AI classified & auto-assigned', meta: `Instantly · ${complaint.department} · SLA: ${slaTotal} days` },
    ];
    if (complaint.assignedTo) {
      items.push({ icon: '✓', bg: '#F0FDF4', color: '#16A34A', title: `Assigned to ${complaint.assignedTo.name}`, meta: `By Nodal Officer · ${complaint.department}` });
    }
    if (complaint.status === 'acknowledged' || ['in_progress', 'under_review', 'escalated'].includes(complaint.status)) {
      items.push({ icon: '✓', bg: '#FEF3C7', color: '#D97706', title: 'Case acknowledged', meta: 'Citizen notified via SMS' });
    }
    if (['in_progress', 'under_review', 'escalated'].includes(complaint.status)) {
      items.push({ icon: '⏳', bg: '#EBF2FF', color: '#1A56C4', title: 'Field visit / action in progress', meta: complaint.assignedTo ? `${complaint.assignedTo.name} · Working on resolution` : 'In progress', desc: 'Officer is actively working on this case. Status will be updated on completion.' });
    }
    if (complaint.status === 'resolved') {
      items.push({ icon: '✓', bg: '#D1FAE5', color: '#16A34A', title: 'Resolved & closed', meta: `Resolved on ${complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleDateString() : 'N/A'}` });
    } else {
      items.push({ icon: `${items.length + 1}`, bg: '#F0F2F7', color: '#7A8FA6', title: 'Resolution & closure', meta: `Pending · SLA deadline in ${complaint.slaDaysLeft} days` });
    }
    return items;
  }, [complaint, slaTotal]);

  function handleSendUpdate() {
    if (!remark.trim()) { toast.error('Please enter an update message.'); return; }
    onSendUpdate(complaint.id, remark.trim());
    setRemark('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-[fadeIn_0.15s_ease]">
      <div className="bg-white rounded-[14px] w-full max-w-[960px] max-h-[90vh] shadow-[0_4px_24px_rgba(14,28,47,0.15)] flex flex-col animate-[slideUp_0.2s_cubic-bezier(0.2,0,0,1)]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#DDE3EE] flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <span className="font-bold text-[14px] text-blue-600 font-mono">{complaint.token}</span>
                <PriorityBadge priority={complaint.priority} />
                <StatusBadge status={complaint.status} />
                {complaint.groupId && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">🔗 GROUP</span>
                )}
              </div>
              <h2 className="text-[15px] font-bold text-[#0E1C2F]">{complaint.title}</h2>
              <p className="text-[12px] text-[#7A8FA6] mt-0.5">
                Filed via {complaint.channel === 'whatsapp' ? 'WhatsApp' : complaint.channel === 'web' ? 'Web Portal' : complaint.channel === 'mobile' ? 'Mobile App' : complaint.channel === 'call' ? 'Call Centre' : complaint.channel === 'email' ? 'Email' : 'Walk-in'} · {complaint.citizenName} · {complaint.citizenPhone} · {complaint.ward}, {complaint.district}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!['acknowledged', 'in_progress', 'under_review', 'escalated', 'resolved', 'closed'].includes(complaint.status) && (
                <button onClick={() => { onAcknowledge(complaint.id); }} className="px-3 py-1.5 rounded-[7px] text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-all">✋ Acknowledge</button>
              )}
              <button onClick={onOpenReassign} className="px-3 py-1.5 rounded-[7px] text-[11px] font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-all">↗ Reassign</button>
              <button onClick={onOpenGroup} className="px-3 py-1.5 rounded-[7px] text-[11px] font-semibold bg-violet-500 text-white hover:bg-violet-600 transition-all">🔗 Group</button>
              {complaint.status !== 'resolved' && complaint.status !== 'closed' && complaint.status !== 'escalated' && (
                <button onClick={() => { onEscalate(complaint.id); }} className="px-3 py-1.5 rounded-[7px] text-[11px] font-semibold bg-white text-[#3D5068] border border-[#DDE3EE] hover:bg-red-50 hover:border-red-300 transition-all">🚨 Escalate</button>
              )}
              {complaint.status !== 'resolved' && complaint.status !== 'closed' ? (
                <button onClick={() => { onResolve(complaint.id); }} className="px-3 py-1.5 rounded-[7px] text-[11px] font-semibold bg-green-600 text-white hover:bg-green-700 transition-all">✅ Resolve</button>
              ) : (
                <span className="px-3 py-1.5 rounded-[7px] text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">✅ Resolved</span>
              )}
              <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#7A8FA6] ml-1"><X size={16} /></button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin' }}>
          {/* Resolved banner */}
          {complaint.status === 'resolved' && (
            <div className="mb-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-[10px] px-4 py-3">
              <span className="text-[20px]">✅</span>
              <div>
                <p className="text-[13px] font-bold text-green-800">Grievance Resolved</p>
                <p className="text-[11px] text-green-700">
                  {complaint.resolvedAt ? `Resolved on ${new Date(complaint.resolvedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}` : 'This grievance has been resolved.'} · Survey sent to citizen.
                </p>
              </div>
            </div>
          )}
          {complaint.status === 'escalated' && (
            <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-[10px] px-4 py-3">
              <span className="text-[20px]">🚨</span>
              <div>
                <p className="text-[13px] font-bold text-red-800">Grievance Escalated</p>
                <p className="text-[11px] text-red-700">This grievance has been escalated to senior authority for urgent attention.</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 items-start">
            {/* Main column */}
            <div className="space-y-4">
              {/* Citizen description */}
              <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
                <div className="px-4 py-3 border-b border-[#DDE3EE]"><span className="text-[12px] font-bold text-[#0E1C2F]">Citizen description</span></div>
                <div className="p-4">
                  <div className="text-[13px] text-[#3D5068] leading-relaxed bg-[#F0F2F7] px-3.5 py-3 rounded-[8px]">&ldquo;{complaint.description}&rdquo;</div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <ChannelBadge channel={complaint.channel} />
                    <span className="text-[11px] text-[#7A8FA6]">Filed {Math.max(1, Math.round((Date.now() - new Date(complaint.createdAt).getTime()) / 86400000))} day(s) ago · Auto-classified by AI</span>
                  </div>
                </div>
              </div>

              {/* Action timeline */}
              <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
                <div className="px-4 py-3 border-b border-[#DDE3EE]"><span className="text-[12px] font-bold text-[#0E1C2F]">Action timeline</span></div>
                <div className="p-4">
                  <div className="flex flex-col">
                    {timeline.map((item, i) => (
                      <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                        {i < timeline.length - 1 && (<div className="absolute left-[13px] top-[28px] bottom-0 w-px bg-[#DDE3EE]" />)}
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] flex-shrink-0 z-[1]" style={{ background: item.bg, color: item.color, ...(item.icon.length > 1 && !['✓', '⏳'].includes(item.icon) ? { border: '2px solid #C8D0DE' } : {}) }}>
                          {item.icon}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className={cn('text-[12px] font-semibold', item.color === '#7A8FA6' ? 'text-[#7A8FA6]' : 'text-[#0E1C2F]')}>{item.title}</div>
                          <div className="text-[10px] text-[#7A8FA6] mt-0.5">{item.meta}</div>
                          {item.desc && (<div className="text-[11px] text-[#3D5068] mt-2 leading-relaxed bg-[#F0F2F7] px-2.5 py-2 rounded-[6px] border-l-2 border-[#C8D0DE]">{item.desc}</div>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Send Update */}
              <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
                <div className="px-4 py-3 border-b border-[#DDE3EE] flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#0E1C2F]">Send Update to Citizen</span>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">SMS + Email triggered on submit</span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Remark / Update message to citizen</label>
                    <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={3} placeholder="Type the update you want to share with the citizen..." className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[8px] focus:outline-none focus:border-blue-400 resize-none leading-relaxed" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Update status to</label>
                      <select value={statusSel} onChange={e => setStatusSel(e.target.value)} className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[7px] focus:outline-none focus:border-blue-400 bg-white">
                        <option value="in_progress">In Progress</option><option value="under_review">Site visit done</option><option value="in_progress">Pending material</option><option value="under_review">Under Review</option><option value="resolved">Resolved</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Notify citizen via</label>
                      <select value={notifChannel} onChange={e => setNotifChannel(e.target.value)} className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[7px] focus:outline-none focus:border-blue-400 bg-white">
                        <option value="sms_email">SMS + Email</option><option value="sms">SMS only</option><option value="email">Email only</option><option value="whatsapp">WhatsApp</option><option value="none">No notification</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Attach file (optional)</label>
                      <input type="file" className="w-full px-2 py-1.5 text-[11px] text-[#7A8FA6] border border-[#DDE3EE] rounded-[7px] file:mr-2 file:text-[11px] file:font-semibold file:text-blue-600 file:bg-transparent file:border-0" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={handleSendUpdate} className="px-4 py-2 rounded-[7px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-[0_2px_8px_rgba(26,86,196,0.2)] transition-all">📤 Send Update & Notify Citizen</button>
                    <span className="text-[10px] text-[#7A8FA6]">Will be logged in communication history</span>
                  </div>
                </div>
              </div>

              {/* Communication History */}
              <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
                <div className="px-4 py-3 border-b border-[#DDE3EE]"><span className="text-[12px] font-bold text-[#0E1C2F]">Communication History</span></div>
                <div className="p-4 space-y-0 divide-y divide-[#DDE3EE]">
                  <div className="flex gap-3 py-3 first:pt-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-blue-100 text-blue-800">📤</div>
                    <div className="flex-1">
                      <div className="text-[12px] font-semibold text-[#0E1C2F]">Case acknowledged by officer</div>
                      <div className="text-[11px] text-[#3D5068] bg-[#F0F2F7] px-2.5 py-2 rounded-[7px] border border-[#DDE3EE] mt-1.5 italic leading-relaxed">&ldquo;We have received your complaint regarding {complaint.category?.toLowerCase() || 'your issue'} in {complaint.ward}. Your case has been acknowledged and assigned. Token: {complaint.token}.&rdquo;</div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">✉ SMS Sent</span>
                        <span className="text-[10px] text-[#7A8FA6]">System · {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {complaint.status !== 'open' && (
                    <div className="flex gap-3 py-3 last:pb-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-green-100 text-green-800">✋</div>
                      <div className="flex-1">
                        <div className="text-[12px] font-semibold text-[#0E1C2F]">Field visit scheduled — citizen informed</div>
                        <div className="text-[11px] text-[#3D5068] bg-[#F0F2F7] px-2.5 py-2 rounded-[7px] border border-[#DDE3EE] mt-1.5 italic leading-relaxed">&ldquo;Your grievance {complaint.token} is being actively worked on. {complaint.assignedTo ? `Our officer ${complaint.assignedTo.name} has scheduled action at your location.` : 'Our team is working on your case.'} You will receive an update by end of day.&rdquo;</div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">✉ SMS Sent</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800">📧 Email Sent</span>
                          <span className="text-[10px] text-[#7A8FA6]">{complaint.assignedTo?.name || 'Officer'} · {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Assignment */}
              <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
                <div className="px-4 py-3 border-b border-[#DDE3EE]"><span className="text-[12px] font-bold text-[#0E1C2F]">Assignment</span></div>
                <div className="p-4 space-y-3">
                  {complaint.assignedTo ? (
                    <><div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold" style={{ backgroundColor: complaint.assignedTo.color + '20', color: complaint.assignedTo.color }}>{complaint.assignedTo.initials}</div>
                      <div><div className="text-[13px] font-semibold text-[#0E1C2F]">{complaint.assignedTo.name}</div><div className="text-[11px] text-[#7A8FA6]">{complaint.assignedTo.role} · {complaint.assignedTo.department}</div></div>
                    </div><div className="h-px bg-[#DDE3EE]" /></>
                  ) : <div className="text-[12px] text-red-500 italic">Unassigned</div>}
                  <button onClick={onOpenReassign} className="w-full px-3 py-2 rounded-[7px] text-[11px] font-semibold text-[#3D5068] border border-[#DDE3EE] hover:bg-orange-50 hover:border-orange-300 transition-all">↗ Reassign to different officer</button>
                  <button onClick={onOpenReassign} className="w-full px-3 py-2 rounded-[7px] text-[11px] font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-all">↗ Reassign to different dept</button>
                </div>
              </div>
              {/* SLA */}
              <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
                <div className="px-4 py-3 border-b border-[#DDE3EE]"><span className="text-[12px] font-bold text-[#0E1C2F]">SLA tracking</span></div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-[12px]"><span className="text-[#7A8FA6]">Filed</span><span className="font-semibold">{Math.max(1, Math.round((Date.now() - new Date(complaint.createdAt).getTime()) / 86400000))} day(s) ago</span></div>
                  <div className="flex justify-between text-[12px]"><span className="text-[#7A8FA6]">SLA target</span><span className="font-semibold">{slaTotal} working days</span></div>
                  <div className="flex justify-between text-[12px]"><span className="text-[#7A8FA6]">Remaining</span><span className={cn('font-bold', complaint.slaStatus === 'breach' ? 'text-red-600' : complaint.slaStatus === 'warn' ? 'text-amber-600' : 'text-green-600')}>{complaint.slaDaysLeft} days</span></div>
                  <div className="h-[7px] bg-gray-100 rounded overflow-hidden mt-1"><div className="h-full rounded transition-all" style={{ width: `${slaPct}%`, background: slaPct > 80 ? 'linear-gradient(90deg, #16A34A, #DC2626)' : slaPct > 50 ? 'linear-gradient(90deg, #16A34A, #D97706)' : '#16A34A' }} /></div>
                  <div className="text-[10px] text-[#7A8FA6] text-center">{slaPct}% of SLA elapsed</div>
                </div>
              </div>
              {/* Grouping */}
              <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
                <div className="px-4 py-3 border-b border-[#DDE3EE]"><span className="text-[12px] font-bold text-[#0E1C2F]">Grouping</span></div>
                <div className="p-4 space-y-3">
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-[8px] px-3 py-2.5 flex gap-2.5 items-start">
                    <span className="text-base flex-shrink-0">🤖</span>
                    <div className="text-[11px] text-[#3D5068] leading-relaxed"><strong className="text-[#0E1C2F]">{similarCount} similar complaint{similarCount !== 1 ? 's' : ''}</strong> detected in same area.<br /><span className="text-orange-600 font-semibold cursor-pointer" onClick={onOpenGroup}>Review & group →</span></div>
                  </div>
                  <button onClick={onOpenGroup} className="w-full px-3 py-2 rounded-[7px] text-[11px] font-semibold bg-violet-500 text-white hover:bg-violet-600 transition-all">🔗 Group with similar complaints</button>
                </div>
              </div>
              {/* Evidence */}
              <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
                <div className="px-4 py-3 border-b border-[#DDE3EE]"><span className="text-[12px] font-bold text-[#0E1C2F]">Evidence (2)</span></div>
                <div className="p-4"><div className="flex gap-2"><div className="w-14 h-14 rounded-[8px] bg-[#dde8f5] flex items-center justify-center text-[26px] cursor-pointer border border-[#DDE3EE] hover:scale-105 transition-transform">🏚</div><div className="w-14 h-14 rounded-[8px] bg-[#dde8f5] flex items-center justify-center text-[26px] cursor-pointer border border-[#DDE3EE] hover:scale-105 transition-transform">💧</div></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL 2 — REASSIGN (modal-md)
   ═══════════════════════════════════════════════════════════════════════════ */
export function ReassignDialog({
  complaint, officers, departments, onClose, onConfirm,
}: {
  complaint: Complaint;
  officers: Officer[];
  departments: { id: string; name: string; full: string }[];
  onClose: () => void;
  onConfirm: (id: string, officer: Officer) => void;
}) {
  const [selectedDept, setSelectedDept] = useState(complaint.department);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [reason, setReason] = useState('');
  const filteredOfficers = officers.filter(o => o.department === selectedDept || selectedDept === '');

  function handleSubmit() {
    if (!selectedOfficerId) { toast.error('Please select an officer.'); return; }
    const officer = officers.find(o => o.id === selectedOfficerId);
    if (!officer) return;
    onConfirm(complaint.id, officer);
    toast.success(`↗ ${complaint.token} reassigned to ${officer.name} — ${officer.department}.`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-[fadeIn_0.15s_ease]">
      <div className="bg-white rounded-[14px] w-full max-w-[600px] max-h-[90vh] shadow-[0_4px_24px_rgba(14,28,47,0.15)] flex flex-col animate-[slideUp_0.2s_cubic-bezier(0.2,0,0,1)]">
        <div className="px-5 py-4 border-b border-[#DDE3EE] flex-shrink-0 relative">
          <h2 className="text-[15px] font-bold text-[#0E1C2F]">↗ Reassign Complaint</h2>
          <p className="text-[12px] text-[#7A8FA6] mt-0.5">{complaint.token} · {complaint.title}</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-[#7A8FA6] hover:text-[#0E1C2F]"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: 'thin' }}>
          <div className="text-[11px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-2 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[#DDE3EE]">Reassign to department</div>
          <DepartmentSelector departments={departments} selected={selectedDept} onSelect={(name) => { setSelectedDept(name); setSelectedOfficerId(''); }} excludeDept={complaint.department} className="mb-4" />
          <div className="text-[11px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-2 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[#DDE3EE]">Assign to officer</div>
          <OfficerSelector officers={filteredOfficers} selected={selectedOfficerId} onSelect={setSelectedOfficerId} className="mb-4" />
          <div>
            <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Reason for reassignment (shared with officer and audit log)</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} placeholder="e.g. Route change — pipeline issue falls under Zone 3 jurisdiction..." className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[7px] focus:outline-none focus:border-blue-400 resize-none" />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-[#DDE3EE] flex justify-end gap-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-[7px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-[7px] text-[12px] font-semibold bg-orange-500 text-white hover:bg-orange-600">↗ Confirm reassignment</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL 3 — GROUP SIMILAR COMPLAINTS (modal-lg)
   ═══════════════════════════════════════════════════════════════════════════ */
export function GroupDialog({
  complaint, allComplaints, onClose, onCreateGroup,
}: {
  complaint: Complaint;
  allComplaints: Complaint[];
  onClose: () => void;
  onCreateGroup: (primaryId: string, memberIds: string[], label: string) => void;
}) {
  const similarComplaints = useMemo(() => {
    return allComplaints
      .filter(c => c.id !== complaint.id && c.status !== 'resolved')
      .map(c => ({ ...c, score: computeSimilarity(complaint, c) }))
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [allComplaints, complaint]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    similarComplaints.filter(c => c.score >= 60).forEach(c => initial.add(c.id));
    return initial;
  });
  const [groupLabel, setGroupLabel] = useState(`${complaint.category} — ${complaint.ward} cluster`);
  const [groupReason, setGroupReason] = useState(`Same location (${complaint.ward}), same category (${complaint.category}), similar time period.`);

  function toggleItem(id: string) { setSelectedIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }
  function handleCreate() {
    if (selectedIds.size === 0) { toast.error('Please select at least one complaint to group.'); return; }
    onCreateGroup(complaint.id, Array.from(selectedIds), groupLabel);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-[fadeIn_0.15s_ease]">
      <div className="bg-white rounded-[14px] w-full max-w-[820px] max-h-[90vh] shadow-[0_4px_24px_rgba(14,28,47,0.15)] flex flex-col animate-[slideUp_0.2s_cubic-bezier(0.2,0,0,1)]">
        <div className="px-5 py-4 border-b border-[#DDE3EE] flex-shrink-0 relative">
          <h2 className="text-[15px] font-bold text-[#0E1C2F]">🔗 Group Similar Complaints</h2>
          <p className="text-[12px] text-[#7A8FA6] mt-0.5">Select complaints to merge into a single case. All linked complaints will be resolved together.</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-[#7A8FA6] hover:text-[#0E1C2F]"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: 'thin' }}>
          <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-[8px] px-3.5 py-3 flex gap-2.5 items-start mb-4">
            <span className="text-base flex-shrink-0">🤖</span>
            <div className="text-[11px] text-[#3D5068] leading-relaxed"><strong className="text-[#0E1C2F]">AI detected {similarComplaints.filter(c => c.score >= 60).length} similar complaint{similarComplaints.filter(c => c.score >= 60).length !== 1 ? 's' : ''}</strong> matching {complaint.token} by location, category, and date.</div>
          </div>
          <div className="text-[11px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-2 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[#DDE3EE]">Primary complaint (anchor)</div>
          <div className="flex items-start gap-2.5 px-3 py-2.5 bg-orange-50 border-2 border-orange-300 rounded-[8px] mb-4">
            <span className="text-base flex-shrink-0">📌</span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-blue-600 font-mono">{complaint.token}</div>
              <div className="text-[12px] font-medium text-[#0E1C2F]">{complaint.title}</div>
              <div className="text-[10px] text-[#7A8FA6] mt-0.5">{complaint.citizenName} · {complaint.priority.toUpperCase()}</div>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 flex-shrink-0">Primary</span>
          </div>
          {similarComplaints.length > 0 && (
            <>
              <div className="text-[11px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-2 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[#DDE3EE]">Select complaints to link</div>
              <div className="border border-[#DDE3EE] rounded-[10px] overflow-hidden mb-4">
                <table className="w-full border-collapse text-[12px]">
                  <thead><tr className="bg-[#F8FAFD]">
                    <th className="px-2.5 py-2 w-10"></th><th className="px-2.5 py-2 text-left text-[10px] font-bold text-[#7A8FA6] uppercase">Token</th><th className="px-2.5 py-2 text-left text-[10px] font-bold text-[#7A8FA6] uppercase">Issue</th><th className="px-2.5 py-2 text-left text-[10px] font-bold text-[#7A8FA6] uppercase">Citizen</th><th className="px-2.5 py-2 text-left text-[10px] font-bold text-[#7A8FA6] uppercase">Channel</th><th className="px-2.5 py-2 text-left text-[10px] font-bold text-[#7A8FA6] uppercase">AI Match</th>
                  </tr></thead>
                  <tbody>
                    {similarComplaints.map((c, i) => (
                      <tr key={c.id} className={cn('hover:bg-[#FAFBFF] transition-colors', i !== similarComplaints.length - 1 && 'border-b border-[#DDE3EE]')}>
                        <td className="px-2.5 py-2"><button onClick={() => toggleItem(c.id)} className={cn('w-4 h-4 rounded-[4px] border-2 flex items-center justify-center text-white text-[9px] transition-all', selectedIds.has(c.id) ? 'bg-blue-600 border-blue-600' : 'border-[#C8D0DE] bg-white hover:border-blue-400')}>{selectedIds.has(c.id) && '✓'}</button></td>
                        <td className="px-2.5 py-2"><span className="text-[11px] font-semibold text-blue-600 font-mono">{c.token}</span></td>
                        <td className="px-2.5 py-2"><div className="text-[11px] font-medium text-[#0E1C2F] truncate max-w-[160px]">{c.title}</div><div className="text-[10px] text-[#7A8FA6]">{c.ward}, {c.district}</div></td>
                        <td className="px-2.5 py-2 text-[11px]">{c.citizenName}</td>
                        <td className="px-2.5 py-2"><ChannelBadge channel={c.channel} /></td>
                        <td className="px-2.5 py-2"><div className="flex items-center gap-1.5"><span className={cn('text-[11px] font-bold', c.score >= 60 ? 'text-green-600' : c.score >= 40 ? 'text-amber-600' : 'text-[#7A8FA6]')}>{c.score}%</span><div className="w-16 h-1 bg-gray-200 rounded overflow-hidden"><div className="h-full rounded" style={{ width: `${c.score}%`, background: c.score >= 60 ? '#16A34A' : c.score >= 40 ? '#D97706' : '#C8D0DE' }} /></div></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <div className="text-[11px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-2 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[#DDE3EE]">Group settings</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div><label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Group label / title</label><input value={groupLabel} onChange={e => setGroupLabel(e.target.value)} className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[7px] focus:outline-none focus:border-blue-400" /></div>
            <div><label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Resolution behaviour</label><select className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[7px] focus:outline-none focus:border-blue-400 bg-white"><option>Resolve primary → auto-close all linked</option><option>Resolve each independently</option></select></div>
          </div>
          <div><label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Grouping reason (audit log)</label><textarea value={groupReason} onChange={e => setGroupReason(e.target.value)} rows={2} className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[7px] focus:outline-none focus:border-blue-400 resize-none" /></div>
        </div>
        <div className="px-5 py-3 border-t border-[#DDE3EE] flex justify-end gap-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-[7px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-gray-50">Cancel</button>
          <button onClick={handleCreate} className="px-4 py-2 rounded-[7px] text-[12px] font-semibold bg-violet-500 text-white hover:bg-violet-600">🔗 Create group ({selectedIds.size} complaint{selectedIds.size !== 1 ? 's' : ''})</button>
        </div>
      </div>
    </div>
  );
}
