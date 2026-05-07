'use client';
import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_COMPLAINTS } from '@/data';
import { PriorityBadge, ChannelBadge, SLABadge } from '@/components/gms/StatusBadge';

export default function EscalationsPage() {
  const escalated = MOCK_COMPLAINTS.filter(c => c.status === 'escalated');
  const slaBreach = MOCK_COMPLAINTS.filter(c => c.slaStatus === 'breach' && c.status !== 'escalated');

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Escalations</h1>
          <p className="text-[12px] text-[#7A8FA6]">
            {escalated.length} escalated · {slaBreach.length} SLA breached
          </p>
        </div>
      </div>

      {/* Alert banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
        <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-red-800">Immediate Attention Required</p>
          <p className="text-[12px] text-red-700 mt-0.5">
            {escalated.length} complaints have been escalated and require your prompt action. SLA breached complaints will be auto-escalated to L3 if not addressed.
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
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Token</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Issue</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Priority</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">SLA</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Channel</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {escalated.map((c, i) => (
                  <tr key={c.id} className={cn(
                    'hover:bg-[#FAFBFF] cursor-pointer',
                    i !== escalated.length - 1 && 'border-b border-[#DDE3EE]'
                  )}>
                    <td className="px-4 py-3">
                      <Link href={`/portal/complaints/${c.id}`} className="text-[11px] font-bold text-blue-600 hover:underline font-mono">
                        {c.token}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0E1C2F] max-w-[200px] truncate">{c.title}</div>
                      <div className="text-[10px] text-[#7A8FA6] mt-0.5">{c.district} · {c.citizenName}</div>
                    </td>
                    <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-4 py-3"><SLABadge slaStatus={c.slaStatus} slaDaysLeft={c.slaDaysLeft} /></td>
                    <td className="px-4 py-3"><ChannelBadge channel={c.channel} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button className="px-2 py-1 bg-blue-600 text-white text-[10px] font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                          Take Action
                        </button>
                        <button className="px-2 py-1 bg-white border border-[#DDE3EE] text-[#3D5068] text-[10px] font-semibold rounded-lg hover:border-[#C8D0DE] transition-colors">
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

      {/* SLA breached section */}
      <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
        SLA Breached ({slaBreach.length})
      </h2>

      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        {slaBreach.length === 0 ? (
          <div className="py-10 text-center text-[#7A8FA6] text-[13px]">No SLA breached complaints.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead className="bg-[#FEF2F2]">
                <tr>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-red-700 uppercase tracking-wide border-b border-red-100">Token</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-red-700 uppercase tracking-wide border-b border-red-100">Issue</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-red-700 uppercase tracking-wide border-b border-red-100">Days Overdue</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-red-700 uppercase tracking-wide border-b border-red-100">Priority</th>
                </tr>
              </thead>
              <tbody>
                {slaBreach.map((c, i) => (
                  <tr key={c.id} className={cn('hover:bg-red-50/40 cursor-pointer', i !== slaBreach.length - 1 && 'border-b border-[#DDE3EE]')}>
                    <td className="px-4 py-3">
                      <Link href={`/portal/complaints/${c.id}`} className="text-[11px] font-bold text-red-600 hover:underline font-mono">
                        {c.token}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0E1C2F] max-w-[200px] truncate">{c.title}</div>
                      <div className="text-[10px] text-[#7A8FA6]">{c.citizenName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-red-700 font-bold text-[12px]">{Math.abs(c.slaDaysLeft)} days overdue</span>
                    </td>
                    <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
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
