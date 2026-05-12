'use client';
import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';

type Tab = 'profile' | 'notifications' | 'security';

export default function CitizenSettings() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    district: 'Ahmedabad',
    ward: '',
  });

  const [notifForm, setNotifForm] = useState({
    smsUpdates: true,
    emailUpdates: true,
    statusChanged: true,
    complaintResolved: true,
    newAssignment: false,
  });

  const [secForm, setSecForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [secError, setSecError] = useState('');

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!profileForm.name.trim()) { setError('Name is required.'); return; }
    // In a real app, call PATCH /api/users/:id
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleNotifSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleSecuritySave(e: React.FormEvent) {
    e.preventDefault();
    setSecError('');
    if (!secForm.currentPassword) { setSecError('Enter your current password.'); return; }
    if (secForm.newPassword.length < 6) { setSecError('New password must be at least 6 characters.'); return; }
    if (secForm.newPassword !== secForm.confirmPassword) { setSecError('Passwords do not match.'); return; }
    setSaved(true);
    setSecForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaved(false), 3000);
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-bold text-[#0E1C2F]">Settings</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-1">Manage your account preferences</p>
      </div>

      {/* Success Banner */}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
          <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
          <p className="text-[12px] text-green-700 font-semibold">Settings saved successfully!</p>
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex gap-1 bg-[#F0F2F7] p-1 rounded-xl">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold transition-colors',
                tab === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-[#7A8FA6] hover:text-[#3D5068]'
              )}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Profile Tab ── */}
      {tab === 'profile' && (
        <div className="bg-white rounded-xl border border-[#DDE3EE] p-5 space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4 pb-4 border-b border-[#F0F2F7]">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-[16px] font-bold flex-shrink-0"
              style={{ backgroundColor: user?.avatarColor ?? '#1A56C4' }}
            >
              {user?.initials}
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#0E1C2F]">{user?.name}</p>
              <p className="text-[11px] text-[#7A8FA6]">{user?.email}</p>
              <span className="mt-1 inline-block px-2 py-0.5 bg-teal-100 text-teal-700 rounded-md text-[10px] font-bold">Citizen</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
              <p className="text-[12px] text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full pl-8 pr-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full pl-8 pr-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-8 pr-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-[#7A8FA6]"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">District</label>
                <select
                  value={profileForm.district}
                  onChange={e => setProfileForm({ ...profileForm, district: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white"
                >
                  {['Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Bhavnagar','Jamnagar','Junagadh'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ward */}
            <div>
              <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Ward / Area</label>
              <input
                type="text"
                value={profileForm.ward}
                onChange={e => setProfileForm({ ...profileForm, ward: e.target.value })}
                placeholder="e.g., Ward 7, Satellite"
                className="w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-[#7A8FA6]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-[12px] font-semibold hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Notifications Tab ── */}
      {tab === 'notifications' && (
        <div className="bg-white rounded-xl border border-[#DDE3EE] p-5">
          <form onSubmit={handleNotifSave} className="space-y-5">
            <div>
              <h3 className="text-[13px] font-bold text-[#0E1C2F] mb-1">Notification Channels</h3>
              <p className="text-[11px] text-[#7A8FA6]">Choose how you want to receive updates</p>
            </div>
            {[
              { key: 'smsUpdates', label: 'SMS Notifications', desc: 'Receive updates via text message' },
              { key: 'emailUpdates', label: 'Email Notifications', desc: 'Receive updates via email' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#F0F2F7]">
                <div>
                  <p className="text-[12px] font-semibold text-[#0E1C2F]">{item.label}</p>
                  <p className="text-[11px] text-[#7A8FA6]">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifForm(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors relative',
                    notifForm[item.key as keyof typeof notifForm] ? 'bg-blue-600' : 'bg-[#DDE3EE]'
                  )}
                >
                  <span className={cn(
                    'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
                    notifForm[item.key as keyof typeof notifForm] ? 'left-6' : 'left-1'
                  )} />
                </button>
              </div>
            ))}

            <div>
              <h3 className="text-[13px] font-bold text-[#0E1C2F] mb-1 mt-2">Alert Preferences</h3>
              <p className="text-[11px] text-[#7A8FA6]">Select which events trigger notifications</p>
            </div>
            {[
              { key: 'statusChanged', label: 'Status Changed', desc: 'When your complaint status updates' },
              { key: 'complaintResolved', label: 'Complaint Resolved', desc: 'When your complaint is marked resolved' },
              { key: 'newAssignment', label: 'Officer Assigned', desc: 'When an officer is assigned to your complaint' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#F0F2F7]">
                <div>
                  <p className="text-[12px] font-semibold text-[#0E1C2F]">{item.label}</p>
                  <p className="text-[11px] text-[#7A8FA6]">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifForm(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors relative',
                    notifForm[item.key as keyof typeof notifForm] ? 'bg-blue-600' : 'bg-[#DDE3EE]'
                  )}
                >
                  <span className={cn(
                    'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
                    notifForm[item.key as keyof typeof notifForm] ? 'left-6' : 'left-1'
                  )} />
                </button>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-[12px] font-semibold hover:bg-blue-700 transition-colors">
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Security Tab ── */}
      {tab === 'security' && (
        <div className="bg-white rounded-xl border border-[#DDE3EE] p-5 space-y-4">
          <div>
            <h3 className="text-[13px] font-bold text-[#0E1C2F] mb-1">Change Password</h3>
            <p className="text-[11px] text-[#7A8FA6]">Update your account password</p>
          </div>

          {secError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
              <p className="text-[12px] text-red-600">{secError}</p>
            </div>
          )}

          <form onSubmit={handleSecuritySave} className="space-y-4">
            {[
              { key: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
              { key: 'newPassword',     label: 'New Password',     placeholder: 'Min 6 characters' },
              { key: 'confirmPassword', label: 'Confirm Password', placeholder: 'Re-enter new password' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">{f.label}</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                  <input
                    type="password"
                    value={secForm[f.key as keyof typeof secForm]}
                    onChange={e => { setSecForm({ ...secForm, [f.key]: e.target.value }); setSecError(''); }}
                    placeholder={f.placeholder}
                    className="w-full pl-8 pr-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-[#7A8FA6]"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-[12px] font-semibold hover:bg-blue-700 transition-colors">
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
