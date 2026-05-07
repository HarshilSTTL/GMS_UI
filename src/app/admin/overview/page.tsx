'use client';
import React from 'react';
import { Shield } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useComplaints } from '@/hooks/useComplaints';

export default function AdminOverviewPage() {
  const { data: users = [] } = useUsers();
  const { data: complaints = [] } = useComplaints();

  const totalComplaints = complaints.length;
  const openComplaints = complaints.filter(c => c.status !== 'resolved').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Registered Users', value: users.length, color: '#7C3AED' },
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

      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="px-5 py-4 border-b border-[#DDE3EE]">
          <h2 className="text-[13px] font-bold text-[#0E1C2F]">System Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['User', 'Role', 'Department', 'District', 'Email', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={i !== users.length - 1 ? 'border-b border-[#DDE3EE]' : ''}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-bold text-blue-700">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-[#0E1C2F]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-medium capitalize text-[#3D5068]">{u.role.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-[#3D5068]">{u.dept}</td>
                  <td className="px-4 py-3 text-[#3D5068]">{u.district}</td>
                  <td className="px-4 py-3 text-[#7A8FA6]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-700' : u.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
