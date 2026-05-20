'use client';
import React, { useState } from 'react';
import {
  User, Mail, Phone, Building2, Briefcase, Globe,
  Shield, Camera, Edit3, Check, X, KeyRound,
  Clock, Star, TrendingUp, AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';
import { toast } from 'sonner';

const ROLE_META: Record<string, { label: string; color: string; bg: string; level: string }> = {
  nodal_officer:    { label: 'Nodal Officer',      color: '#1A56C4', bg: '#EFF6FF', level: 'Department Level' },
  clerk:            { label: 'Clerk / Task',        color: '#16A34A', bg: '#F0FDF4', level: 'Department Level' },
  admin:            { label: 'System Administrator',color: '#7C3AED', bg: '#F5F3FF', level: 'System Level' },
  cm:               { label: 'CM Intelligence View',color: '#C9A84C', bg: '#FFFBEB', level: 'State Level' },
  health_secretary: { label: 'Health Secretary',    color: '#004B87', bg: '#EFF6FF', level: 'Secretariat Level' },
  citizen:          { label: 'Citizen',             color: '#0891B2', bg: '#F0FDFA', level: 'Public' },
};

const DEPT_STATS: Record<string, { label: string; value: string; color: string }[]> = {
  nodal_officer: [
    { label: 'Assigned to me', value: '24', color: '#1A56C4' },
    { label: 'Resolved this month', value: '87', color: '#16A34A' },
    { label: 'SLA compliance', value: '78%', color: '#D97706' },
    { label: 'Avg resolution', value: '4.2d', color: '#7C3AED' },
  ],
  clerk: [
    { label: 'Tasks in queue', value: '12', color: '#16A34A' },
    { label: 'Resolved today', value: '8', color: '#1A56C4' },
    { label: 'SLA compliance', value: '82%', color: '#D97706' },
    { label: 'Pending review', value: '5', color: '#DC2626' },
  ],
  admin: [
    { label: 'Total users', value: '142', color: '#7C3AED' },
    { label: 'Active departments', value: '18', color: '#1A56C4' },
    { label: 'System uptime', value: '99.8%', color: '#16A34A' },
    { label: 'Audit events today', value: '348', color: '#D97706' },
  ],
  cm: [
    { label: 'State open', value: '18,492', color: '#C9A84C' },
    { label: 'Resolved this month', value: '24,187', color: '#16A34A' },
    { label: 'State SLA %', value: '78%', color: '#D97706' },
    { label: 'L3 escalations', value: '83', color: '#DC2626' },
  ],
  health_secretary: [
    { label: 'Dept open', value: '2,847', color: '#004B87' },
    { label: 'Resolved today', value: '341', color: '#16A34A' },
    { label: 'SLA adherence', value: '81%', color: '#D97706' },
    { label: 'L3 escalations', value: '15', color: '#DC2626' },
  ],
};

function Field({
  label, icon: Icon, value, editing, onChange, type = 'text',
}: {
  label: string; icon: React.ElementType; value: string;
  editing: boolean; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
        <Icon size={11} /> {label}
      </label>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 text-[12px] text-[#0E1C2F] border border-[#DDE3EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white"
        />
      ) : (
        <p className="text-[13px] font-medium text-[#0E1C2F] px-3 py-2 bg-[#F8FAFD] rounded-lg border border-[#EEF1F6]">
          {value || '—'}
        </p>
      )}
    </div>
  );
}

export function OfficerProfilePage() {
  const { user } = useAuthStore();
  const meta = ROLE_META[user?.role ?? 'nodal_officer'];
  const stats = DEPT_STATS[user?.role ?? 'nodal_officer'] ?? [];

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    designation: user?.designation ?? '',
    department: user?.department ?? '',
    district: user?.district ?? '',
    employeeId: `GJ-${(user?.department ?? 'GMS').slice(0, 4).toUpperCase().replace(/\s/g, '')}-0421`,
  });

  function handleSave() {
    setEditing(false);
    toast.success('Profile updated successfully.');
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F]">My Profile</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">View and manage your account information</p>
      </div>

      {/* Hero card */}
      <div
        className="rounded-[16px] p-6 mb-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #0F1A2E 0%, #1A3260 100%)` }}
      >
        {/* Decorative circle */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${meta.color}, transparent)` }} />

        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-[22px] font-bold text-white shadow-lg"
                style={{ backgroundColor: meta.color }}
              >
                {user?.initials ?? 'U'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-[#1A3260] hover:scale-110 transition-transform">
                <Camera size={11} style={{ color: meta.color }} />
              </button>
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-white leading-tight">{user?.name}</h2>
              <p className="text-[12px] text-blue-300 mt-0.5">{user?.designation}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: `${meta.color}30`, color: '#93C5FD', border: `1px solid ${meta.color}50` }}
                >
                  {meta.label}
                </span>
                <span className="text-[10px] text-blue-300/70">{meta.level}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all',
              editing
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
            )}
          >
            {editing ? <><Check size={14} /> Save Changes</> : <><Edit3 size={14} /> Edit Profile</>}
          </button>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <div className="text-[18px] font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] text-blue-300/70 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Personal info */}
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#DDE3EE] flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#0E1C2F]">Personal Information</span>
              {editing && (
                <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-[11px] text-[#7A8FA6] hover:text-red-500 transition-colors">
                  <X size={12} /> Cancel
                </button>
              )}
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name" icon={User} value={form.name} editing={editing} onChange={v => setForm(f => ({ ...f, name: v }))} />
              <Field label="Email Address" icon={Mail} value={form.email} editing={editing} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" />
              <Field label="Phone Number" icon={Phone} value={form.phone || '+91 98765 43210'} editing={editing} onChange={v => setForm(f => ({ ...f, phone: v }))} />
              <Field label="Employee ID" icon={KeyRound} value={form.employeeId} editing={false} onChange={() => {}} />
              <Field label="Designation" icon={Briefcase} value={form.designation} editing={editing} onChange={v => setForm(f => ({ ...f, designation: v }))} />
              <Field label="Department" icon={Building2} value={form.department} editing={editing} onChange={v => setForm(f => ({ ...f, department: v }))} />
              <Field label="District / Office" icon={Globe} value={form.district || 'Gandhinagar'} editing={editing} onChange={v => setForm(f => ({ ...f, district: v }))} />
            </div>
          </div>

          {/* Activity log */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
              <span className="text-[13px] font-bold text-[#0E1C2F]">Recent Activity</span>
            </div>
            <div className="divide-y divide-[#F0F2F7]">
              {[
                { icon: Check, color: '#16A34A', bg: '#F0FDF4', text: 'Resolved complaint GJ-2024-08821', time: '2 hours ago' },
                { icon: TrendingUp, color: '#1A56C4', bg: '#EFF6FF', text: 'Reviewed SLA report for April', time: '5 hours ago' },
                { icon: AlertTriangle, color: '#D97706', bg: '#FFFBEB', text: 'Escalated complaint GJ-2024-08719 to L2', time: 'Yesterday' },
                { icon: User, color: '#7C3AED', bg: '#F5F3FF', text: 'Updated team assignment for Clerk Sharma', time: '2 days ago' },
                { icon: Star, color: '#C9A84C', bg: '#FFFBEB', text: 'CSAT rating received — 4.5 ⭐', time: '3 days ago' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: a.bg }}>
                    <a.icon size={13} style={{ color: a.color }} />
                  </div>
                  <span className="text-[12px] text-[#0E1C2F] flex-1">{a.text}</span>
                  <span className="text-[10px] text-[#7A8FA6] flex-shrink-0 flex items-center gap-1">
                    <Clock size={10} /> {a.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Role & Permissions */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#DDE3EE] flex items-center gap-2">
              <Shield size={14} className="text-[#7A8FA6]" />
              <span className="text-[13px] font-bold text-[#0E1C2F]">Role & Permissions</span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#7A8FA6]">Role</span>
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: meta.bg, color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#7A8FA6]">Access Level</span>
                <span className="text-[11px] font-semibold text-[#0E1C2F]">{meta.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#7A8FA6]">Status</span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                </span>
              </div>
              <div className="pt-2 border-t border-[#F0F2F7]">
                <p className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-2">Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {(user?.permissions ?? []).slice(0, 6).map(p => (
                    <span key={p} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {p}
                    </span>
                  ))}
                  {(user?.permissions?.length ?? 0) > 6 && (
                    <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#F0F2F7] text-[#7A8FA6]">
                      +{(user?.permissions?.length ?? 0) - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account info */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
              <span className="text-[13px] font-bold text-[#0E1C2F]">Account Info</span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Member since', value: 'Jan 2024' },
                { label: 'Last login', value: 'Today, 09:41 AM' },
                { label: 'Login method', value: 'Email / Password' },
                { label: '2FA', value: 'Not enabled' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-[#7A8FA6]">{r.label}</span>
                  <span className="text-[11px] font-semibold text-[#0E1C2F]">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#DDE3EE]">
              <span className="text-[13px] font-bold text-[#0E1C2F]">Quick Actions</span>
            </div>
            <div className="p-3 space-y-1">
              {[
                { label: 'Change Password', icon: KeyRound, color: '#1A56C4' },
                { label: 'Notification Preferences', icon: User, color: '#16A34A' },
                { label: 'Download Activity Log', icon: TrendingUp, color: '#7C3AED' },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={() => toast.info(`${a.label} — go to Settings.`)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-[#F8FAFD] transition-colors text-left"
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}18` }}>
                    <a.icon size={12} style={{ color: a.color }} />
                  </div>
                  <span className="text-[12px] font-medium text-[#0E1C2F]">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
