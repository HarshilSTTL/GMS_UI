'use client';
import React from 'react';
import { Shield } from 'lucide-react';
import { MOCK_USERS } from '@/data';
import { MOCK_COMPLAINTS } from '@/data';

export default function AdminOverviewPage() {
  const totalUsers = MOCK_USERS.length;
  const totalComplaints = MOCK_COMPLAINTS.length;
  const openComplaints = MOCK_COMPLAINTS.filter(c => c.status !== 'resolved').length;
  const resolvedComplaints = MOCK_COMPLAINTS.filter(c => c.status === 'resolved').length;

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Shield size={20} className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Admin Console</h1>
          <p className="text-[12px] text-[#7A8FA6]">System administration — GMS v3.0</p>
        </div>
      </div>

      {/* System stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Registered Users', value: totalUsers, color: '#7C3AED' },
          { label: 'Total Complaints', value: totalComplaints, color: '#1A56C4' },
          { label: 'Open Complaints', value: openComplaints, color: '#DC2626' },
          { label: 'Resolved', value: resolvedComplaints, color: '#16A34A' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3.5 relative overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]" style={{ background: k.color }} />
            <div className="text-[10px] font-semibold text-[#7A8FA6] uppercase tracking-wide mb-1">{k.label}</div>
            <div className="text-[28px] font-bold text-[#0E1C2F]">{k.value}</div>
          </div>
        ))}
      </div>

      {/* User list */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="px-5 py-4 border-b border-[#DDE3EE]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">System Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-[#F8FAFD]">
              <tr>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">User</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Role</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Department</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">Email</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((u, i) => (
                <tr key={u.id} className={i !== MOCK_USERS.length - 1 ? 'border-b border-[#DDE3EE]' : ''}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: u.avatarColor }}>
                        {u.initials}
                      </div>
                      <span className="font-semibold text-[#0E1C2F]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-medium capitalize text-[#3D5068]">{u.role.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-[#3D5068]">{u.department}</td>
                  <td className="px-4 py-3 text-[#7A8FA6]">{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
