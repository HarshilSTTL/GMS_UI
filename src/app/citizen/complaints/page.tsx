'use client';
import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores';
import Link from 'next/link';

interface Complaint {
  id: string;
  token: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  slaDaysLeft: number;
  slaDaysUsed?: number;
  slaDaysTotal?: number;
  createdAt: string;
  updatedAt: string;
  lastUpdate?: string;
  assignedTo?: { name: string; initials: string; color: string };
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  open: { label: 'Open', icon: AlertCircle, color: '#D97706', bg: '#FFFBEB' },
  pending: { label: 'Pending', icon: AlertCircle, color: '#D97706', bg: '#FFFBEB' },
  in_progress: { label: 'In Progress', icon: Clock, color: '#1A56C4', bg: '#EBF2FF' },
  under_review: { label: 'Under Review', icon: Clock, color: '#1A56C4', bg: '#EBF2FF' },
  resolved: { label: 'Resolved', icon: CheckCircle, color: '#16A34A', bg: '#F0FDF4' },
  acknowledged: { label: 'Acknowledged', icon: Clock, color: '#0891B2', bg: '#ECFEFF' },
};

export default function CitizenComplaints() {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchComplaints();
  }, [user?.id]);

  async function fetchComplaints() {
    try {
      setLoading(true);
      const res = await fetch(`/api/complaints/citizen/${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredComplaints = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter);

  const filterOptions = [
    { label: 'All', value: 'all', count: complaints.length },
    { label: 'Open', value: 'open', count: complaints.filter(c => c.status === 'open').length },
    { label: 'In Progress', value: 'in_progress', count: complaints.filter(c => c.status === 'in_progress').length },
    { label: 'Resolved', value: 'resolved', count: complaints.filter(c => c.status === 'resolved').length },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-bold text-[#0E1C2F] mb-1">My Complaints</h1>
        <p className="text-[12px] text-[#7A8FA6]">View and manage your filed complaints</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
              filter === opt.value
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-[#DDE3EE] text-[#3D5068] hover:border-blue-300'
            }`}
          >
            {opt.label} {opt.count > 0 && <span className="ml-1">({opt.count})</span>}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-[12px] text-[#7A8FA6]">Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#DDE3EE] p-8 text-center">
          <AlertCircle size={32} className="mx-auto text-[#7A8FA6] mb-3 opacity-50" />
          <p className="text-[12px] text-[#7A8FA6]">No complaints found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComplaints.map(complaint => {
            const statusConfig = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.open;
            const StatusIcon = statusConfig.icon;
            const slaPercent = complaint.slaDaysTotal
              ? ((complaint.slaDaysUsed || 0) / complaint.slaDaysTotal) * 100
              : 0;

            return (
              <Link
                key={complaint.id}
                href={`/citizen/complaints/${complaint.id}`}
                className="block bg-white rounded-xl border border-[#DDE3EE] p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[12px] font-bold text-[#1A56C4]">{complaint.token}</p>
                    <p className="text-[13px] font-semibold text-[#0E1C2F] mt-1">{complaint.title}</p>
                  </div>
                  <div
                    className="px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 flex-shrink-0"
                    style={{ color: statusConfig.color, background: statusConfig.bg }}
                  >
                    <StatusIcon size={12} />
                    {statusConfig.label}
                  </div>
                </div>

                <p className="text-[11px] text-[#3D5068] mb-2">{complaint.category}</p>

                {/* SLA Progress */}
                {complaint.slaDaysTotal && (
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-[#7A8FA6]">SLA Status</span>
                      <span className={complaint.slaDaysLeft > 0 ? 'text-green-600' : 'text-red-600'}>
                        {complaint.slaDaysLeft > 0 ? `${complaint.slaDaysLeft}d left` : 'Breached'}
                      </span>
                    </div>
                    <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${slaPercent > 80 ? 'bg-red-500' : slaPercent > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(slaPercent, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-[#7A8FA6] border-t border-[#E5E7EB] pt-2">
                  <span>Filed on {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  <ChevronRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
