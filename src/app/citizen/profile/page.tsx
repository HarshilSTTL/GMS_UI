'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string; fullName: string; mobile: string; email: string; dob: string; gender: string;
  aadhaar: string; district: string; taluka: string; ward: string; address: string;
  pincode: string; language: string; registeredAt: string; totalComplaints: number; resolvedComplaints: number;
}

export default function CitizenProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', mobile: '', dob: '', gender: '', ward: '', address: '', pincode: '', language: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/citizen/profile').then(r => r.json()).then(d => { setProfile(d); setForm({ fullName: d.fullName, email: d.email, mobile: d.mobile, dob: d.dob, gender: d.gender, ward: d.ward, address: d.address, pincode: d.pincode, language: d.language }); });
  }, []);

  function updateForm(field: string, value: string) { setForm(f => ({ ...f, [field]: value })); }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/citizen/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setProfile(updated);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (!profile) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-bold text-[#0E1C2F]">My Profile</h1>
          <p className="text-[11px] text-[#7A8FA6]">View and manage your account information</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-[#F4811F] text-white border-none">Edit Profile</button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-[14px] p-4 text-center shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <div className="text-[20px] font-bold text-[#0E1C2F]">{profile.totalComplaints}</div>
          <div className="text-[10px] text-[#7A8FA6]">Total Filed</div>
        </div>
        <div className="bg-white rounded-[14px] p-4 text-center shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <div className="text-[20px] font-bold text-green-600">{profile.resolvedComplaints}</div>
          <div className="text-[10px] text-[#7A8FA6]">Resolved</div>
        </div>
        <div className="bg-white rounded-[14px] p-4 text-center shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <div className="text-[20px] font-bold text-[#0891B2]">{new Date(profile.registeredAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div>
          <div className="text-[10px] text-[#7A8FA6]">Member Since</div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#F0F2F7]">
          <div className="w-14 h-14 rounded-2xl bg-[#F4811F] flex items-center justify-center text-white text-[20px] font-bold">{profile.fullName.charAt(0)}</div>
          <div>
            {editing ? (
              <input value={form.fullName} onChange={e => updateForm('fullName', e.target.value)} className="text-[16px] font-bold text-[#0E1C2F] bg-transparent border-b-2 border-[#F4811F] outline-none pb-0.5" />
            ) : (
              <h2 className="text-[16px] font-bold text-[#0E1C2F]">{profile.fullName}</h2>
            )}
            <p className="text-[11px] text-[#7A8FA6]">Citizen &middot; {profile.district}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Phone, label: 'Mobile', value: form.mobile, field: 'mobile' },
            { icon: Mail, label: 'Email', value: form.email, field: 'email' },
            { icon: Calendar, label: 'Date of Birth', value: form.dob, field: 'dob' },
            { icon: User, label: 'Gender', value: form.gender, field: 'gender' },
            { icon: MapPin, label: 'Ward', value: form.ward, field: 'ward' },
            { icon: MapPin, label: 'Address', value: form.address, field: 'address' },
            { icon: MapPin, label: 'Pincode', value: form.pincode, field: 'pincode' },
            { icon: Shield, label: 'Aadhaar', value: profile.aadhaar, field: '' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F0F2F7]">
              <item.icon size={14} className="text-[#7A8FA6] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] text-[#7A8FA6]">{item.label}</p>
                {editing && item.field ? (
                  <input value={item.value} onChange={e => updateForm(item.field, e.target.value)} className="text-[11px] font-semibold text-[#0E1C2F] bg-transparent border-b border-[#DDE3EE] outline-none w-full focus:border-[#F4811F]" />
                ) : (
                  <p className="text-[11px] font-semibold text-[#0E1C2F]">{item.value || '—'}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="flex gap-2 mt-5 pt-4 border-t border-[#F0F2F7]">
            <button onClick={() => { setEditing(false); setForm({ fullName: profile.fullName, email: profile.email, mobile: profile.mobile, dob: profile.dob, gender: profile.gender, ward: profile.ward, address: profile.address, pincode: profile.pincode, language: profile.language }); }} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold bg-[#F4811F] text-white border-none disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
