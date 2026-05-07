'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MOCK_COMPLAINTS } from '@/data';
import { StatusBadge, PriorityBadge, SLABadge } from '@/components/gms/StatusBadge';
import { useAuthStore } from '@/stores';

export default function MyWorkPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'resolved'>('pending');

  const myComplaints = MOCK_COMPLAINTS.filter(c =>
    c.assignedTo && (c.assignedTo.name === user?.name || c.assignedTo.id === 'o1')
  );

  const pending = myComplaints.filter(c => c.status === 'open' || c.status === 'acknowledged');
  const inProgress = myComplaints.filter(c => c.status === 'in_progress' || c.status === 'under_review' || c.status === 'escalated');
  const resolved = myComplaints.filter(c => c.status === 'resolved');

  const tabData = { pending, in_progress: inProgress, resolved };
  const tabCounts = { pending: pending.length, in_progress: inProgress.length, resolved: resolved.length };
  const displayed = tabData[activeTab];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">My Work Queue</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">
          Complaints assigned to you — {myComplaints.length} total
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { key: 'pending', label: 'Pending Action', color: '#DC2626', bg: '#FEF2F2' },
          { key: 'in_progress', label: 'In Progress', color: '#D97706', bg: '#FFFBEB' },
          { key: 'resolved', label: 'Resolved', color: '#16A34A', bg: '#F0FDF4' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-150',
              activeTab === t.key
                ? 'border-2 shadow-sm'
                : 'bg-white border-[#DDE3EE] hover:border-[#C8D0DE]'
            )}
            style={activeTab === t.key ? { background: t.bg, borderColor: t.color } : {}}
          >
            <span
              className="text-[22px] font-bold leading-none"
              style={{ color: t.color }}
            >
              {tabCounts[t.key as typeof activeTab]}
            </span>
            <span className="text-[12px] font-semibold text-[#3D5068]">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Work cards */}
      <div className="space-y-3">
        {displayed.length === 0 ? (
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] py-14 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-[15px] font-bold text-[#0E1C2F] mb-1">All caught up!</p>
            <p className="text-[12px] text-[#7A8FA6]">No complaints in this category right now.</p>
          </div>
        ) : (
          displayed.map(c => (
            <div
              key={c.id}
              className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)] hover:shadow-[0_4px_16px_rgba(14,28,47,0.08)] transition-shadow"
            >
              <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/portal/complaints/${c.id}`}
                      className="text-[12px] font-bold text-blue-600 hover:underline font-mono"
                    >
                      {c.token}
                    </Link>
                    <PriorityBadge priority={c.priority} />
                    <SLABadge slaStatus={c.slaStatus} slaDaysLeft={c.slaDaysLeft} />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#0E1C2F] mb-1">{c.title}</h3>
                  <p className="text-[11px] text-[#7A8FA6]">{c.ward}, {c.district} · {c.citizenName} · {c.channel}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>

              <div className="px-5 py-4">
                <p className="text-[13px] text-[#3D5068] leading-relaxed bg-[#F0F2F7] rounded-lg px-3 py-2.5 mb-4">
                  {c.description}
                </p>

                {/* Action area */}
                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-2">Add update / note</label>
                  <textarea
                    placeholder="Enter your action taken, notes, or update for the citizen..."
                    className="w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] resize-none min-h-[70px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
                      Save Update
                    </button>
                    <button className="px-3 py-1.5 bg-green-600 text-white text-[12px] font-semibold rounded-lg hover:bg-green-700 transition-colors">
                      Mark Resolved
                    </button>
                    <button className="px-3 py-1.5 bg-[#EA580C] text-white text-[12px] font-semibold rounded-lg hover:bg-[#C2430A] transition-colors">
                      Reassign
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-[#DDE3EE] text-[#3D5068] text-[12px] font-semibold rounded-lg hover:border-[#C8D0DE] transition-colors">
                      Contact Citizen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
