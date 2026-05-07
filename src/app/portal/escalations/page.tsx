'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useComplaints, useUpdateComplaint } from '@/hooks/useComplaints';
import { useOfficers } from '@/hooks/useOfficers';
import { PriorityBadge, ChannelBadge, SLABadge, StatusBadge } from '@/components/gms/StatusBadge';
import type { Complaint, Officer } from '@/types';

/* ── Take Action Dialog ── */
function TakeActionDialog({ complaint, onClose }: { complaint: Complaint; onClose: () => void }) {
  const [action, setAction] = useState('');
  const [note, setNote] = useState('');

  function handleSubmit() {
    if (!action) { toast.error('Please select an action.'); return; }
    const labels: Record<string, string> = {
      resolve: `✅ ${complaint.token} resolved.`,
      deescalate: `↩️ ${complaint.token} de-escalated to In Progress.`,
      forward: `📨 ${complaint.token} forwarded to department head.`,
    };
    toast.success(labels[action] ?? 'Action recorded.');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-[16px] w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DDE3EE]">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h2 className="text-[15px] font-bold text-[#0E1C2F]">Take Action</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#7A8FA6]"><X size={14} /></button>
        </div>
        <div className="p-5">
          <div className="bg-red-50 border border-red-200 rounded-[10px] px-3 py-2.5 mb-4">
            <p className="text-[11px] font-mono text-blue-600 font-bold">{complaint.token}</p>
            <p className="text-[12px] font-semibold text-[#0E1C2F] mt-0.5">{complaint.title}</p>
            <div className="flex gap-2 mt-1.5">
              <PriorityBadge priority={complaint.priority} />
              <SLABadge slaStatus={complaint.slaStatus} slaDaysLeft={complaint.slaDaysLeft} />
            </div>
          </div>
          <label className="block text-[11px] font-semibold text-[#3D5068] mb-2">Select Action *</label>
          <div className="space-y-2 mb-4">
            {[
              { value: 'resolve', label: '✅ Mark as Resolved', desc: 'Close the complaint and notify citizen' },
              { value: 'deescalate', label: '↩️ De-escalate to In Progress', desc: 'Return to normal workflow' },
              { value: 'forward', label: '📨 Forward to Department Head', desc: 'Escalate within department chain' },
            ].map(opt => (
              <label key={opt.value} className={cn('flex items-start gap-2.5 p-2.5 rounded-[10px] border cursor-pointer transition-all', action === opt.value ? 'border-blue-400 bg-blue-50' : 'border-[#DDE3EE] hover:border-blue-200')}>
                <input type="radio" name="action" value={opt.value} checked={action === opt.value} onChange={e => setAction(e.target.value)} className="mt-0.5 accent-blue-600" />
                <div>
                  <p className="text-[12px] font-semibold text-[#0E1C2F]">{opt.label}</p>
                  <p className="text-[10px] text-[#7A8FA6]">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Action Note <span className="text-[#7A8FA6] font-normal">(optional)</span></label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
            placeholder="Describe the action taken or reason…"
            className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-blue-400 resize-none" />
        </div>
        <div className="px-5 pb-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700">Confirm Action</button>
        </div>
      </div>
    </div>
  );
}

/* ── Reassign Dialog ── */
function ReassignDialog({ complaint, onClose }: { complaint: Complaint; onClose: () => void }) {
  const { data: officers = [] } = useOfficers();
  const updateComplaint = useUpdateComplaint();
  const [officer, setOfficer] = useState('');
  const [reason, setReason] = useState('');

  async function handleSubmit() {
    if (!officer) { toast.error('Please select an officer.'); return; }
    const o = officers.find(o => o.id === officer)!;
    await updateComplaint.mutateAsync({ id: complaint.id, data: { assignedTo: o } });
    toast.success(`🔄 ${complaint.token} reassigned to ${o.name}.`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-[16px] w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DDE3EE]">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            <h2 className="text-[15px] font-bold text-[#0E1C2F]">Reassign Complaint</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#7A8FA6]"><X size={14} /></button>
        </div>
        <div className="p-5">
          <div className="bg-[#F8FAFD] border border-[#DDE3EE] rounded-[10px] px-3 py-2.5 mb-4">
            <p className="text-[11px] font-mono text-blue-600 font-bold">{complaint.token}</p>
            <p className="text-[12px] font-semibold text-[#0E1C2F] mt-0.5">{complaint.title}</p>
            <p className="text-[10px] text-[#7A8FA6] mt-0.5">
              Currently: {complaint.assignedTo ? <span className="text-[#3D5068] font-semibold">{complaint.assignedTo.name}</span> : 'Unassigned'}
            </p>
          </div>
          <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Assign To *</label>
          <div className="relative mb-3">
            <select value={officer} onChange={e => setOfficer(e.target.value)}
              className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-blue-400 appearance-none bg-white">
              <option value="">— Select officer —</option>
              {officers.map(o => (
                <option key={o.id} value={o.id}>
                  {o.name} · {o.department} · {o.workload === 'ok' ? 'Normal' : o.workload === 'high' ? 'High load' : 'Overloaded'}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] pointer-events-none" />
          </div>
          <label className="block text-[11px] font-semibold text-[#3D5068] mb-1.5">Reason <span className="text-[#7A8FA6] font-normal">(optional)</span></label>
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2}
            placeholder="e.g. Officer on leave / Subject expertise needed"
            className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-blue-400 resize-none" />
        </div>
        <div className="px-5 pb-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold bg-orange-500 text-white hover:bg-orange-600">Reassign</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function EscalationsPage() {
  const { data: complaints = [], isLoading } = useComplaints();
  const escalated = complaints.filter(c => c.status === 'escalated');
  const slaBreach = complaints.filter(c => c.slaStatus === 'breach' && c.status !== 'escalated');

  const [dialog, setDialog] = useState<{ type: 'action' | 'reassign'; complaint: Complaint } | null>(null);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-[13px] text-[#7A8FA6]">Loading escalations…</div>
  );

  return (
    <div>
      {/* Dialogs */}
      {dialog?.type === 'action' && <TakeActionDialog complaint={dialog.complaint} onClose={() => setDialog(null)} />}
      {dialog?.type === 'reassign' && <ReassignDialog complaint={dialog.complaint} onClose={() => setDialog(null)} />}

      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Escalations</h1>
          <p className="text-[12px] text-[#7A8FA6]">{escalated.length} escalated · {slaBreach.length} SLA breached</p>
        </div>
      </div>

      {/* Alert banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
        <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-red-800">Immediate Attention Required</p>
          <p className="text-[12px] text-red-700 mt-0.5">
            {escalated.length} complaints escalated, {slaBreach.length} with SLA breach. Unresolved escalations auto-escalate to L3 after 48h.
          </p>
        </div>
      </div>

      {/* Escalated complaints */}
      <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
        Escalated Complaints ({escalated.length})
      </h2>

      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)] mb-6">
        {escalated.length === 0 ? (
          <div className="py-10 text-center text-[#7A8FA6] text-[13px]">No escalated complaints.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead className="bg-[#F8FAFD]">
                <tr>
                  {['Token', 'Issue', 'Priority', 'SLA', 'Channel', 'Assigned To', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {escalated.map((c, i) => (
                  <tr key={c.id} className={cn('hover:bg-[#FAFBFF]', i !== escalated.length - 1 && 'border-b border-[#DDE3EE]')}>
                    <td className="px-4 py-3">
                      <Link href={`/portal/complaints/${c.id}`} className="text-[11px] font-bold text-blue-600 hover:underline font-mono">{c.token}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0E1C2F] max-w-[180px] truncate">{c.title}</div>
                      <div className="text-[10px] text-[#7A8FA6] mt-0.5">{c.district} · {c.citizenName}</div>
                    </td>
                    <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-4 py-3"><SLABadge slaStatus={c.slaStatus} slaDaysLeft={c.slaDaysLeft} /></td>
                    <td className="px-4 py-3"><ChannelBadge channel={c.channel} /></td>
                    <td className="px-4 py-3">
                      {c.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: c.assignedTo.color }}>
                            {c.assignedTo.initials}
                          </div>
                          <span className="text-[11px] text-[#3D5068]">{c.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-red-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setDialog({ type: 'action', complaint: c })}
                          className="px-2 py-1 bg-blue-600 text-white text-[10px] font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                          Take Action
                        </button>
                        <button
                          onClick={() => setDialog({ type: 'reassign', complaint: c })}
                          className="px-2 py-1 bg-white border border-[#DDE3EE] text-[#3D5068] text-[10px] font-semibold rounded-lg hover:border-orange-300 hover:text-orange-600 transition-colors"
                        >
                          Reassign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SLA Breached section */}
      <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
        SLA Breached — Not Escalated ({slaBreach.length})
      </h2>

      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        {slaBreach.length === 0 ? (
          <div className="py-10 text-center text-[#7A8FA6] text-[13px]">No SLA breached complaints.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead className="bg-[#FEF2F2]">
                <tr>
                  {['Token', 'Issue', 'Days Overdue', 'Priority', 'Assigned To', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-red-700 uppercase tracking-wide border-b border-red-100 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slaBreach.map((c, i) => (
                  <tr key={c.id} className={cn('hover:bg-red-50/40', i !== slaBreach.length - 1 && 'border-b border-[#DDE3EE]')}>
                    <td className="px-4 py-3">
                      <Link href={`/portal/complaints/${c.id}`} className="text-[11px] font-bold text-red-600 hover:underline font-mono">{c.token}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0E1C2F] max-w-[180px] truncate">{c.title}</div>
                      <div className="text-[10px] text-[#7A8FA6]">{c.citizenName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-red-700 font-bold">{Math.abs(c.slaDaysLeft)}d overdue</span>
                    </td>
                    <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-4 py-3">
                      {c.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: c.assignedTo.color }}>
                            {c.assignedTo.initials}
                          </div>
                          <span className="text-[11px] text-[#3D5068]">{c.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-red-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          toast.warning(`🚨 ${c.token} escalated to L2 due to SLA breach.`);
                        }}
                        className="px-2 py-1 bg-red-600 text-white text-[10px] font-semibold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                      >
                        Escalate Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
