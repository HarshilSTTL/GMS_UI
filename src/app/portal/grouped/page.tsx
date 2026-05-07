'use client';
import React from 'react';
import Link from 'next/link';
import { Link2 } from 'lucide-react';
import { MOCK_COMPLAINTS } from '@/data';
import { PriorityBadge, SLABadge } from '@/components/gms/StatusBadge';

export default function GroupedCasesPage() {
  const groupedComplaints = MOCK_COMPLAINTS.filter(c => c.groupId);
  const primaryCases = groupedComplaints.filter(c => c.isGroupPrimary);

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <Link2 size={20} className="text-orange-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Grouped Cases</h1>
          <p className="text-[12px] text-[#7A8FA6]">{primaryCases.length} complaint groups · {groupedComplaints.length} total cases</p>
        </div>
      </div>

      {/* AI suggestion */}
      <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-xl px-4 py-3.5 mb-5 flex gap-3">
        <span className="text-[16px] flex-shrink-0 mt-0.5">🤖</span>
        <div>
          <p className="text-[12px] font-semibold text-[#0E1C2F]">AI Grouping Suggestion</p>
          <p className="text-[11px] text-[#3D5068] mt-0.5 leading-relaxed">
            <strong>3 new complaints</strong> about water supply disruption in Satellite area detected. They appear similar to <strong>GVM-2025-05341</strong>. Consider grouping them for efficient resolution.
          </p>
          <button className="mt-2 text-[11px] font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors">
            Review suggestion →
          </button>
        </div>
      </div>

      {/* Group list */}
      <div className="space-y-3">
        {primaryCases.length === 0 ? (
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] py-14 text-center">
            <div className="text-4xl mb-3">🔗</div>
            <p className="text-[15px] font-bold text-[#0E1C2F] mb-1">No grouped cases</p>
            <p className="text-[12px] text-[#7A8FA6]">Group similar complaints for efficient batch resolution.</p>
          </div>
        ) : (
          primaryCases.map(primary => {
            const members = groupedComplaints.filter(c => c.groupId === primary.groupId && !c.isGroupPrimary);
            return (
              <div key={primary.id} className="bg-white border-2 border-orange-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
                <div className="px-4 py-3 bg-orange-50/60 border-b border-orange-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                      Primary
                    </span>
                    <Link href={`/portal/complaints/${primary.id}`} className="text-[12px] font-bold text-blue-600 hover:underline font-mono">
                      {primary.token}
                    </Link>
                    <PriorityBadge priority={primary.priority} />
                  </div>
                  <span className="text-[11px] text-[#7A8FA6]">{members.length + 1} cases in group</span>
                </div>
                <div className="p-4">
                  <p className="text-[14px] font-semibold text-[#0E1C2F] mb-1">{primary.title}</p>
                  <p className="text-[11px] text-[#7A8FA6] mb-3">{primary.ward}, {primary.district}</p>
                  <div className="flex gap-3 flex-wrap">
                    <SLABadge slaStatus={primary.slaStatus} slaDaysLeft={primary.slaDaysLeft} />
                    <span className="text-[11px] text-[#7A8FA6]">Group ID: {primary.groupId}</span>
                  </div>
                </div>
                {members.length > 0 && (
                  <div className="border-t border-[#DDE3EE] px-4 py-3">
                    <p className="text-[11px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-2">Linked complaints</p>
                    {members.map(m => (
                      <div key={m.id} className="flex items-center gap-2 py-1.5 border-b border-[#F0F2F7] last:border-0">
                        <Link href={`/portal/complaints/${m.id}`} className="text-[11px] font-bold text-blue-600 hover:underline font-mono">{m.token}</Link>
                        <span className="text-[11px] text-[#3D5068] flex-1 truncate">{m.title}</span>
                      </div>
                    ))}
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
