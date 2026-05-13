'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, AlertCircle, Clock, CheckCircle, MapPin, Phone, Mail, User, Building2, CalendarDays } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import type { Complaint } from '@/types';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  open:         { label: 'Open',         color: '#D97706', bg: '#FFFBEB', icon: AlertCircle },
  pending:      { label: 'Pending',      color: '#D97706', bg: '#FFFBEB', icon: AlertCircle },
  in_progress:  { label: 'In Progress',  color: '#1A56C4', bg: '#EBF2FF', icon: Clock },
  under_review: { label: 'Under Review', color: '#1A56C4', bg: '#EBF2FF', icon: Clock },
  acknowledged: { label: 'Acknowledged', color: '#0891B2', bg: '#ECFEFF', icon: Clock },
  escalated:    { label: 'Escalated',    color: '#7C3AED', bg: '#F5F3FF', icon: AlertCircle },
  grouped:      { label: 'Grouped',      color: '#EA580C', bg: '#FFF7ED', icon: AlertCircle },
  resolved:     { label: 'Resolved',     color: '#16A34A', bg: '#F0FDF4', icon: CheckCircle },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#991B1B', bg: '#FEE2E2' },
  high:     { label: 'High',     color: '#92400E', bg: '#FEF3C7' },
  medium:   { label: 'Medium',   color: '#1E40AF', bg: '#DBEAFE' },
  low:      { label: 'Low',      color: '#475569', bg: '#F1F5F9' },
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#F0F2F7] last:border-0">
      <div className="w-7 h-7 rounded-lg bg-[#F0F2F7] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-[#7A8FA6]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase text-[#7A8FA6] tracking-wide">{label}</p>
        <p className="text-[12px] text-[#0E1C2F] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function ComplaintDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) fetchComplaint(id);
  }, [id]);

  async function fetchComplaint(complaintId: string) {
    try {
      setLoading(true);
      const res = await fetch(`/api/grievances/${complaintId}`);
      if (res.ok) {
        const json = await res.json();
        setComplaint(json.data ?? json);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !complaint) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <AlertCircle size={40} className="mx-auto text-[#7A8FA6] mb-4 opacity-40" />
        <p className="text-[14px] font-bold text-[#0E1C2F]">Complaint Not Found</p>
        <p className="text-[12px] text-[#7A8FA6] mt-1">This complaint doesn't exist or you don't have access.</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-[12px] font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[complaint.status] ?? STATUS_CONFIG.open;
  const priorityCfg = PRIORITY_CONFIG[complaint.priority] ?? PRIORITY_CONFIG.medium;
  const StatusIcon = statusCfg.icon;

  const slaPercent = complaint.slaDaysLeft > 0
    ? Math.max(0, Math.min(100, ((5 - complaint.slaDaysLeft) / 5) * 100))
    : 100;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[12px] text-blue-600 hover:text-blue-700 font-semibold"
      >
        <ChevronLeft size={15} /> Back to Complaints
      </button>

      {/* Hero Card */}
      <div className="bg-white rounded-xl border border-[#DDE3EE] overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#0E1C2F] to-[#1A3260] text-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] text-blue-300 font-mono mb-1">{complaint.token}</p>
              <h1 className="text-[15px] font-bold leading-snug">{complaint.title}</h1>
              <p className="text-[11px] text-blue-200 mt-1">{complaint.category} · {complaint.department}</p>
            </div>
            <div
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 flex-shrink-0"
              style={{ color: statusCfg.color, background: statusCfg.bg }}
            >
              <StatusIcon size={11} />
              {statusCfg.label}
            </div>
          </div>
        </div>

        {/* SLA Bar */}
        <div className="px-5 py-3 bg-[#F8FAFD] border-b border-[#DDE3EE]">
          <div className="flex justify-between text-[10px] mb-1.5">
            <span className="font-bold text-[#3D5068]">SLA Progress</span>
            <span className={complaint.slaDaysLeft > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {complaint.slaDaysLeft > 0 ? `${complaint.slaDaysLeft} days remaining` : 'SLA Breached'}
            </span>
          </div>
          <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                complaint.slaDaysLeft <= 0 ? 'bg-red-500' :
                slaPercent > 70 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${slaPercent}%` }}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="px-5 py-3 flex gap-2 border-b border-[#DDE3EE]">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ color: priorityCfg.color, background: priorityCfg.bg }}>
            {priorityCfg.label} Priority
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EBF2FF] text-blue-700">
            {complaint.channel?.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Description */}
        <div className="px-5 py-4 border-b border-[#DDE3EE]">
          <p className="text-[10px] font-bold uppercase text-[#7A8FA6] tracking-wide mb-2">Description</p>
          <p className="text-[12px] text-[#3D5068] leading-relaxed">{complaint.description}</p>
        </div>

        {/* Details */}
        <div className="px-5 py-2">
          <InfoRow icon={MapPin}       label="Location"      value={complaint.location} />
          <InfoRow icon={Building2}    label="Department"    value={complaint.department} />
          <InfoRow icon={User}         label="Citizen Name"  value={complaint.citizenName} />
          <InfoRow icon={Phone}        label="Phone"         value={complaint.citizenPhone} />
          <InfoRow icon={Mail}         label="Email"         value={complaint.citizenEmail} />
          <InfoRow icon={CalendarDays} label="Filed On"      value={new Date(complaint.createdAt).toLocaleString()} />
          <InfoRow icon={CalendarDays} label="Last Updated"  value={new Date(complaint.updatedAt).toLocaleString()} />
          {complaint.resolvedAt && (
            <InfoRow icon={CheckCircle} label="Resolved On" value={new Date(complaint.resolvedAt).toLocaleString()} />
          )}
        </div>
      </div>

      {/* Assigned Officer */}
      <div className="bg-white rounded-xl border border-[#DDE3EE] p-4">
        <p className="text-[11px] font-bold uppercase text-[#7A8FA6] tracking-wide mb-3">Assigned Officer</p>
        {complaint.assignedTo ? (
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
              style={{ backgroundColor: complaint.assignedTo.color }}
            >
              {complaint.assignedTo.initials}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#0E1C2F]">{complaint.assignedTo.name}</p>
              <p className="text-[11px] text-[#7A8FA6]">{complaint.assignedTo.role} · {complaint.assignedTo.department}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[12px] text-[#7A8FA6]">
            <div className="w-9 h-9 rounded-full bg-[#F0F2F7] flex items-center justify-center">
              <User size={14} className="text-[#7A8FA6]" />
            </div>
            <span>Not yet assigned</span>
          </div>
        )}
      </div>
    </div>
  );
}
