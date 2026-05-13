'use client';
import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Complaint {
  id: string;
  token: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  slaDaysLeft: number;
  createdAt: string;
  lastUpdate: string;
  assignedTo?: { name: string; initials: string; color: string };
  citizenName: string;
  location: string;
  department: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  open: { label: 'Open', icon: AlertCircle, color: '#D97706', bg: '#FFFBEB' },
  pending: { label: 'Pending', icon: AlertCircle, color: '#D97706', bg: '#FFFBEB' },
  in_progress: { label: 'In Progress', icon: Clock, color: '#1A56C4', bg: '#EBF2FF' },
  under_review: { label: 'Under Review', icon: Clock, color: '#1A56C4', bg: '#EBF2FF' },
  resolved: { label: 'Resolved', icon: CheckCircle, color: '#16A34A', bg: '#F0FDF4' },
  acknowledged: { label: 'Acknowledged', icon: Clock, color: '#0891B2', bg: '#ECFEFF' },
};

export default function TrackComplaint() {
  const [token, setToken] = useState('');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!token.trim()) {
      setError('Please enter a token');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/complaints/track/${token.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setComplaint(data);
      } else {
        setError('Complaint not found. Please check the token and try again.');
        setComplaint(null);
      }
    } catch (err) {
      setError('Error fetching complaint. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const statusConfig = complaint ? STATUS_CONFIG[complaint.status] || STATUS_CONFIG.open : null;
  const StatusIcon = statusConfig?.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-bold text-[#0E1C2F] mb-1">Track Complaint</h1>
        <p className="text-[12px] text-[#7A8FA6]">Enter your token to check the status of your complaint</p>
      </div>

      {/* Search Box */}
      <div>
        <label className="block text-[11px] font-bold text-[#3D5068] mb-2">Complaint Token</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
            <input
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., GVM-2025-05341"
              className={cn(
                'w-full pl-9 pr-3 py-2.5 border rounded-lg text-[13px] text-[#0E1C2F] outline-none',
                'placeholder:text-[#7A8FA6] transition-colors duration-150',
                'border-[#DDE3EE] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
              )}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
          <p className="text-[12px] text-red-600">{error}</p>
        </div>
      )}

      {/* Complaint Details */}
      {complaint && statusConfig && (
        <div className="bg-white rounded-xl border border-[#DDE3EE] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <p className="text-[11px] opacity-90 mb-1">Token</p>
            <p className="text-[16px] font-bold">{complaint.token}</p>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Title & Status */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <p className="text-[13px] font-bold text-[#0E1C2F] flex-1">{complaint.title}</p>
                <div
                  className="px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 flex-shrink-0"
                  style={{ color: statusConfig.color, background: statusConfig.bg }}
                >
                  <StatusIcon size={12} />
                  {statusConfig.label}
                </div>
              </div>
              <p className="text-[11px] text-[#7A8FA6]">{complaint.category}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-[#E5E7EB] pt-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#7A8FA6]">Department</p>
                <p className="text-[12px] text-[#0E1C2F] mt-1">{complaint.department}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-[#7A8FA6]">Location</p>
                <p className="text-[12px] text-[#0E1C2F] mt-1">{complaint.location}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-[#7A8FA6]">Filed On</p>
                <p className="text-[12px] text-[#0E1C2F] mt-1">{new Date(complaint.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-[#7A8FA6]">Assigned To</p>
                <p className="text-[12px] text-[#0E1C2F] mt-1">{complaint.assignedTo?.name || 'Unassigned'}</p>
              </div>
            </div>

            {/* SLA Status */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-[10px] font-bold uppercase text-[#7A8FA6] mb-2">SLA Status</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[14px] font-bold text-blue-600">{complaint.slaDaysLeft > 0 ? `${complaint.slaDaysLeft} days` : 'Breached'}</p>
                  <p className="text-[10px] text-[#7A8FA6]">{complaint.slaDaysLeft > 0 ? 'remaining' : 'SLA time exceeded'}</p>
                </div>
              </div>
            </div>

            {/* Last Update */}
            <div className="bg-[#F8FAFD] border border-[#E5E7EB] rounded-lg p-3">
              <p className="text-[10px] font-bold uppercase text-[#7A8FA6] mb-1">Last Update</p>
              <p className="text-[12px] text-[#0E1C2F]">{complaint.lastUpdate}</p>
            </div>
          </div>
        </div>
      )}

      {/* Help Box */}
      {!complaint && !error && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h3 className="text-[12px] font-bold text-[#0E1C2F] mb-2">💡 How to find your token</h3>
          <p className="text-[11px] text-[#3D5068] leading-relaxed">
            Your complaint token was sent to you via SMS when your complaint was filed. It starts with 'GVM-' followed by the year and a 5-digit number.
          </p>
        </div>
      )}
    </div>
  );
}
