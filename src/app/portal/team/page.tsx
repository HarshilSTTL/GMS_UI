'use client';
import React from 'react';
import { Users } from 'lucide-react';
import { MOCK_OFFICERS, MOCK_COMPLAINTS } from '@/data';

export default function TeamPage() {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Users size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">My Team</h1>
          <p className="text-[12px] text-[#7A8FA6]">{MOCK_OFFICERS.length} officers in your department</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_OFFICERS.map(o => {
          const assigned = MOCK_COMPLAINTS.filter(c => c.assignedTo?.id === o.id).length;
          const resolved = MOCK_COMPLAINTS.filter(c => c.assignedTo?.id === o.id && c.status === 'resolved').length;
          const loadColor = o.workload === 'ok' ? '#16A34A' : o.workload === 'high' ? '#D97706' : '#DC2626';
          const loadBg = o.workload === 'ok' ? '#F0FDF4' : o.workload === 'high' ? '#FFFBEB' : '#FEF2F2';
          const loadLabel = o.workload === 'ok' ? 'Normal' : o.workload === 'high' ? 'High Load' : 'Overloaded';
          const pct = o.workload === 'ok' ? 42 : o.workload === 'high' ? 78 : 96;

          return (
            <div key={o.id} className="bg-white border border-[#DDE3EE] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-bold text-white"
                  style={{ backgroundColor: o.color }}
                >
                  {o.initials}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0E1C2F]">{o.name}</p>
                  <p className="text-[11px] text-[#7A8FA6]">{o.role} · {o.department}</p>
                </div>
                <span
                  className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: loadColor, background: loadBg }}
                >
                  {loadLabel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#F0F2F7] rounded-lg px-3 py-2.5 text-center">
                  <p className="text-[20px] font-bold text-[#0E1C2F]">{assigned}</p>
                  <p className="text-[10px] text-[#7A8FA6]">Assigned</p>
                </div>
                <div className="bg-[#F0FDF4] rounded-lg px-3 py-2.5 text-center">
                  <p className="text-[20px] font-bold text-green-700">{resolved}</p>
                  <p className="text-[10px] text-[#7A8FA6]">Resolved</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#7A8FA6] mb-1">
                  <span>Workload</span>
                  <span style={{ color: loadColor }}>{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: loadColor }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
