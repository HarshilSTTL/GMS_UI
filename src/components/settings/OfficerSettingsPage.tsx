'use client';
import React, { useState } from 'react';
import {
  User, Bell, Shield, Palette, Monitor, Clock,
  Mail, Phone, Building2, Briefcase, KeyRound,
  Eye, EyeOff, Check, Camera, Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';
import { toast } from 'sonner';

/* ─── Tab type ─── */
type TabId = 'profile' | 'notifications' | 'security' | 'appearance';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

/* ─── PROFILE TAB ─── */
function ProfileTab() {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '+91 98765 43210',
    designation: user?.designation ?? '',
    department: user?.department ?? '',
    district: 'Gandhinagar',
    employeeId: 'GJ-GWSSB-0421',
  });

  function handleSave() {
    setEditing(false);
    toast.success('Profile updated successfully.');
  }

  return (
    <div className="space-y-6">
      {/* Avatar section */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[22px] font-bold text-white"
            style={{ backgroundColor: user?.avatarColor ?? '#1A56C4' }}
          >
            {user?.initials ?? 'U'}
          </div>
          <button className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors">
            <Camera size={11} />
          </button>
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-[#0E1C2F]">{user?.name}</h3>
          <p className="text-[12px] text-[#7A8FA6]">{user?.designation} · {user?.department}</p>
          <p className="text-[11px] text-[#7A8FA6] mt-0.5">Employee ID: GJ-GWSSB-0421</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#DDE3EE] flex items-center justify-between">
          <span className="text-[13px] font-bold text-[#0E1C2F]">Personal Information</span>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="text-[11px] font-semibold text-[#7A8FA6] hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                Save
              </button>
            </div>
          )}
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name" icon={User} value={form.name} editing={editing} onChange={v => setForm(f => ({ ...f, name: v }))} />
          <Field label="Email Address" icon={Mail} value={form.email} editing={editing} onChange={v => setForm(f => ({ ...f, email: v }))} />
          <Field label="Phone Number" icon={Phone} value={form.phone} editing={editing} onChange={v => setForm(f => ({ ...f, phone: v }))} />
          <Field label="Designation" icon={Briefcase} value={form.designation} editing={editing} onChange={v => setForm(f => ({ ...f, designation: v }))} />
          <Field label="Department" icon={Building2} value={form.department} editing={editing} onChange={v => setForm(f => ({ ...f, department: v }))} />
          <Field label="District" icon={Globe} value={form.district} editing={editing} onChange={v => setForm(f => ({ ...f, district: v }))} />
        </div>
      </div>

      {/* Role info card */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#DDE3EE]">
          <span className="text-[13px] font-bold text-[#0E1C2F]">Role & Permissions</span>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#7A8FA6]">Role</span>
            <span className="text-[12px] font-semibold text-[#0E1C2F] capitalize">{user?.role?.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#7A8FA6]">Access Level</span>
            <span className="text-[12px] font-semibold text-[#0E1C2F]">Department Level</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#7A8FA6]">Permissions</span>
            <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
              {user?.permissions?.map(p => (
                <span key={p} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, value, editing, onChange }: {
  label: string; icon: React.ElementType; value: string; editing: boolean; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
        <Icon size={11} /> {label}
      </label>
      {editing ? (
        <input
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

/* ─── NOTIFICATIONS TAB ─── */
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    emailNew: true, emailAssigned: true, emailEscalated: true, emailResolved: true,
    smsAck: true, smsUpdates: false, smsResolved: true,
    pushNew: true, pushAssigned: true, pushEscalated: true,
    dailyDigest: true, weeklyReport: true, criticalAlert: true,
  });

  function toggle(key: keyof typeof prefs) {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    toast.success('Notification preference updated.');
  }

  return (
    <div className="space-y-5">
      {/* Email */}
      <Section title="Email Notifications" icon={Mail}>
        <ToggleRow label="New complaint received" desc="When a new complaint is lodged in your department" checked={prefs.emailNew} onToggle={() => toggle('emailNew')} />
        <ToggleRow label="Complaint assigned to you" desc="When a complaint is assigned to you or your team" checked={prefs.emailAssigned} onToggle={() => toggle('emailAssigned')} />
        <ToggleRow label="SLA escalation alert" desc="When a complaint nears or breaches SLA" checked={prefs.emailEscalated} onToggle={() => toggle('emailEscalated')} />
        <ToggleRow label="Complaint resolved" desc="When a complaint you handled is marked resolved" checked={prefs.emailResolved} onToggle={() => toggle('emailResolved')} />
      </Section>

      {/* SMS */}
      <Section title="SMS Notifications" icon={Phone}>
        <ToggleRow label="Acknowledgment sent" desc="SMS when you acknowledge a citizen complaint" checked={prefs.smsAck} onToggle={() => toggle('smsAck')} />
        <ToggleRow label="Status updates" desc="SMS for every status change on your assigned complaints" checked={prefs.smsUpdates} onToggle={() => toggle('smsUpdates')} />
        <ToggleRow label="Resolution confirmation" desc="SMS when a complaint is resolved" checked={prefs.smsResolved} onToggle={() => toggle('smsResolved')} />
      </Section>

      {/* Push */}
      <Section title="Push Notifications" icon={Bell}>
        <ToggleRow label="New complaint" desc="Instant push for new complaints" checked={prefs.pushNew} onToggle={() => toggle('pushNew')} />
        <ToggleRow label="Assignment updates" desc="Push when complaints are assigned/reassigned" checked={prefs.pushAssigned} onToggle={() => toggle('pushAssigned')} />
        <ToggleRow label="Escalation alerts" desc="Critical push for escalations" checked={prefs.pushEscalated} onToggle={() => toggle('pushEscalated')} />
      </Section>

      {/* Digest */}
      <Section title="Scheduled Reports" icon={Clock}>
        <ToggleRow label="Daily digest" desc="Summary of all complaints at end of day" checked={prefs.dailyDigest} onToggle={() => toggle('dailyDigest')} />
        <ToggleRow label="Weekly SLA report" desc="Weekly SLA performance report every Monday" checked={prefs.weeklyReport} onToggle={() => toggle('weeklyReport')} />
        <ToggleRow label="Critical alerts" desc="Immediate alert for critical-priority complaints" checked={prefs.criticalAlert} onToggle={() => toggle('criticalAlert')} />
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#DDE3EE] flex items-center gap-2">
        <Icon size={14} className="text-[#7A8FA6]" />
        <span className="text-[13px] font-bold text-[#0E1C2F]">{title}</span>
      </div>
      <div className="divide-y divide-[#EEF1F6]">
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onToggle }: { label: string; desc: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="px-5 py-3.5 flex items-center justify-between gap-4">
      <div>
        <p className="text-[12px] font-medium text-[#0E1C2F]">{label}</p>
        <p className="text-[11px] text-[#7A8FA6] mt-0.5">{desc}</p>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          'relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0',
          checked ? 'bg-blue-600' : 'bg-[#D1D5DB]'
        )}
      >
        <div className={cn(
          'absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200',
          checked ? 'translate-x-[21px]' : 'translate-x-[3px]'
        )} />
      </button>
    </div>
  );
}

/* ─── SECURITY TAB ─── */
function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [sessions] = useState([
    { device: 'Chrome · Windows 11', location: 'Gandhinagar, Gujarat', time: 'Active now', current: true },
    { device: 'Safari · iPhone 15', location: 'Gandhinagar, Gujarat', time: '2 hours ago', current: false },
    { device: 'Firefox · Windows 11', location: 'Ahmedabad, Gujarat', time: 'Yesterday', current: false },
  ]);

  return (
    <div className="space-y-5">
      {/* Change password */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#DDE3EE] flex items-center gap-2">
          <KeyRound size={14} className="text-[#7A8FA6]" />
          <span className="text-[13px] font-bold text-[#0E1C2F]">Change Password</span>
        </div>
        <div className="p-5 space-y-4 max-w-md">
          <div>
            <label className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-1.5 block">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="Enter current password"
                className="w-full px-3 py-2 text-[12px] text-[#0E1C2F] border border-[#DDE3EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A8FA6] hover:text-[#0E1C2F]"
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-1.5 block">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Enter new password"
                className="w-full px-3 py-2 text-[12px] text-[#0E1C2F] border border-[#DDE3EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A8FA6] hover:text-[#0E1C2F]"
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-semibold text-[#7A8FA6] uppercase tracking-wide">Password requirements</p>
            <CheckRule label="Minimum 8 characters" met />
            <CheckRule label="One uppercase letter" met />
            <CheckRule label="One number" met />
            <CheckRule label="One special character" met={false} />
          </div>
          <button
            onClick={() => toast.success('Password changed successfully.')}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Active sessions */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#DDE3EE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor size={14} className="text-[#7A8FA6]" />
            <span className="text-[13px] font-bold text-[#0E1C2F]">Active Sessions</span>
          </div>
          <button
            onClick={() => toast.success('All other sessions have been terminated.')}
            className="text-[11px] font-semibold text-red-600 hover:underline"
          >
            Revoke all others
          </button>
        </div>
        <div className="divide-y divide-[#EEF1F6]">
          {sessions.map((s, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#0E1C2F] flex items-center gap-2">
                  {s.device}
                  {s.current && (
                    <span className="text-[9px] font-bold px-1.5 py-px rounded-full bg-green-100 text-green-700">Current</span>
                  )}
                </p>
                <p className="text-[11px] text-[#7A8FA6] mt-0.5">{s.location} · {s.time}</p>
              </div>
              {!s.current && (
                <button
                  onClick={() => toast.success('Session revoked.')}
                  className="text-[11px] font-semibold text-[#7A8FA6] hover:text-red-600 transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two-factor */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#DDE3EE] flex items-center gap-2">
          <Shield size={14} className="text-[#7A8FA6]" />
          <span className="text-[13px] font-bold text-[#0E1C2F]">Two-Factor Authentication</span>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[12px] font-medium text-[#0E1C2F]">TOTP Authenticator</p>
            <p className="text-[11px] text-[#7A8FA6] mt-0.5">Use Google Authenticator or similar app</p>
          </div>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            Not enabled
          </span>
        </div>
      </div>
    </div>
  );
}

function CheckRule({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        'w-3.5 h-3.5 rounded-full flex items-center justify-center',
        met ? 'bg-green-100' : 'bg-gray-100'
      )}>
        {met ? <Check size={9} className="text-green-600" /> : <div className="w-1 h-1 rounded-full bg-gray-300" />}
      </div>
      <span className={cn('text-[11px]', met ? 'text-green-700' : 'text-[#7A8FA6]')}>{label}</span>
    </div>
  );
}

/* ─── APPEARANCE TAB ─── */
function AppearanceTab() {
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarDefault, setSidebarDefault] = useState(false);

  return (
    <div className="space-y-5">
      {/* Theme */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#DDE3EE] flex items-center gap-2">
          <Palette size={14} className="text-[#7A8FA6]" />
          <span className="text-[13px] font-bold text-[#0E1C2F]">Theme</span>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light', bg: 'bg-white', border: 'border-blue-500 ring-2 ring-blue-500/20', active: true },
              { id: 'dark', label: 'Dark', bg: 'bg-[#0E1C2F]', border: 'border-[#DDE3EE]', active: false },
              { id: 'system', label: 'System', bg: 'bg-gradient-to-r from-white to-[#0E1C2F]', border: 'border-[#DDE3EE]', active: false },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => toast.info(`${t.label} theme selected.`)}
                className={cn(
                  'p-3 rounded-xl border-2 transition-all text-center',
                  t.bg, t.active ? t.border : 'hover:border-blue-300'
                )}
              >
                <div className="w-full h-10 rounded-lg bg-gray-100 mb-2 flex items-center justify-center">
                  <div className={cn('w-3 h-3 rounded-full', t.id === 'light' ? 'bg-gray-300' : t.id === 'dark' ? 'bg-gray-600' : 'bg-gray-400')} />
                </div>
                <span className="text-[11px] font-semibold text-[#0E1C2F]">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Density */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#DDE3EE] flex items-center gap-2">
          <Monitor size={14} className="text-[#7A8FA6]" />
          <span className="text-[13px] font-bold text-[#0E1C2F]">Display Preferences</span>
        </div>
        <div className="divide-y divide-[#EEF1F6]">
          <ToggleRow label="Compact mode" desc="Reduce padding and spacing for more content" checked={compactMode} onToggle={() => { setCompactMode(!compactMode); toast.success('Display density updated.'); }} />
          <ToggleRow label="Collapse sidebar by default" desc="Start with sidebar collapsed on desktop" checked={sidebarDefault} onToggle={() => { setSidebarDefault(!sidebarDefault); toast.success('Sidebar preference saved.'); }} />
          <ToggleRow label="Show avatars in tables" desc="Display user avatars in complaint tables" checked={true} onToggle={() => toast.success('Preference updated.')} />
          <ToggleRow label="Animations" desc="Enable smooth transitions and animations" checked={true} onToggle={() => toast.success('Preference updated.')} />
        </div>
      </div>

      {/* Language */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#DDE3EE] flex items-center gap-2">
          <Globe size={14} className="text-[#7A8FA6]" />
          <span className="text-[13px] font-bold text-[#0E1C2F]">Language & Region</span>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-1.5 block">Language</label>
            <select className="w-full max-w-xs px-3 py-2 text-[12px] text-[#0E1C2F] border border-[#DDE3EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white">
              <option>English</option>
              <option>Hindi</option>
              <option>Gujarati</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-1.5 block">Date Format</label>
            <select className="w-full max-w-xs px-3 py-2 text-[12px] text-[#0E1C2F] border border-[#DDE3EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white">
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide mb-1.5 block">Timezone</label>
            <select className="w-full max-w-xs px-3 py-2 text-[12px] text-[#0E1C2F] border border-[#DDE3EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white">
              <option>Asia/Kolkata (IST, +5:30)</option>
              <option>UTC</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export function OfficerSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-[#0E1C2F] leading-tight">Settings</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-0.5">Manage your profile, notifications, and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Tab sidebar */}
        <div className="lg:w-[200px] flex-shrink-0">
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.08)] overflow-hidden lg:sticky lg:top-4">
            <nav className="p-2 space-y-0.5">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[12px] transition-all duration-150',
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-[#3D5068] hover:bg-[#F8FAFD]'
                    )}
                  >
                    <Icon size={15} className={isActive ? 'text-blue-600' : 'text-[#7A8FA6]'} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
        </div>
      </div>
    </div>
  );
}
