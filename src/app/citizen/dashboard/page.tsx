'use client';
import React, { useEffect, useState } from 'react';
import { FileText, Eye, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuthStore } from '@/stores';

interface Dashboard {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  inProgressComplaints: number;
}

export default function CitizenDashboard() {
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState<Dashboard>({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    inProgressComplaints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const res = await fetch(`/api/grievances/citizen/${user?.id}`);
      if (res.ok) {
        const result = await res.json();
        const complaints = result.data;
        const stats = {
          totalComplaints: complaints.length,
          pendingComplaints: complaints.filter((c: any) => ['open', 'pending', 'acknowledged'].includes(c.status)).length,
          resolvedComplaints: complaints.filter((c: any) => c.status === 'resolved').length,
          inProgressComplaints: complaints.filter((c: any) => ['in_progress', 'under_review'].includes(c.status)).length,
        };
        setDashboard(stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const stats = [
    {
      label: 'Total Complaints',
      value: dashboard.totalComplaints,
      icon: FileText,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      accentColor: 'bg-blue-500',
    },
    {
      label: 'Pending',
      value: dashboard.pendingComplaints,
      icon: AlertCircle,
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
      accentColor: 'bg-amber-500',
    },
    {
      label: 'In Progress',
      value: dashboard.inProgressComplaints,
      icon: Clock,
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      accentColor: 'bg-indigo-500',
    },
    {
      label: 'Resolved',
      value: dashboard.resolvedComplaints,
      icon: CheckCircle,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      accentColor: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-bold text-[#0E1C2F] mb-1">Dashboard</h1>
        <p className="text-[12px] text-[#7A8FA6]">Welcome back, {user?.name}. Here's your complaint overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#DDE3EE] shadow-sm p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${stat.color} p-2.5 rounded-lg`}>
                  <Icon size={18} className={stat.iconColor} />
                </div>
                <div className={`${stat.accentColor} w-1 h-6 rounded-full`}></div>
              </div>
              <p className="text-[11px] font-bold uppercase text-[#7A8FA6] letter-spacing-1">{stat.label}</p>
              <p className="text-[28px] font-bold text-[#0E1C2F] mt-1">{loading ? '-' : stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/citizen/file-complaint"
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <FileText size={28} className="mb-3" />
          <h3 className="text-[14px] font-bold mb-1">File New Complaint</h3>
          <p className="text-[12px] text-blue-100">Report a new grievance</p>
        </a>
        <a
          href="/citizen/track"
          className="bg-white border border-[#DDE3EE] rounded-xl p-6 hover:border-blue-400 hover:shadow-sm transition-all"
        >
          <Eye size={28} className="mb-3 text-blue-600" />
          <h3 className="text-[14px] font-bold text-[#0E1C2F] mb-1">Track Complaint</h3>
          <p className="text-[12px] text-[#7A8FA6]">Check status by token</p>
        </a>
      </div>
    </div>
  );
}
