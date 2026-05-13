'use client';
import React, { useState } from 'react';
import { Search, FileText, Phone, Globe, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

const MY_COMPLAINTS = [
  { id: 'GVM-2025-05341', category: 'Water Supply', status: 'in_progress', date: '2025-05-05', sla_days: 5, days_open: 2, officer: 'Ravi Varma', dept: 'GWSSB', lastUpdate: 'Field visit scheduled for tomorrow 10 AM.' },
  { id: 'GVM-2025-04812', category: 'Road Damage', status: 'resolved', date: '2025-04-20', sla_days: 5, days_open: 8, officer: 'Pooja Desai', dept: 'Roads & B', lastUpdate: 'Pothole repaired. Please verify and close.' },
  { id: 'GVM-2025-03201', category: 'Street Light', status: 'pending', date: '2025-05-01', sla_days: 3, days_open: 6, officer: 'Unassigned', dept: 'AMC', lastUpdate: 'Complaint registered. Assignment pending.' },
];

const CHANNELS = [
  { icon: '📱', label: 'Mobile App', desc: 'Download GMS app' },
  { icon: '💬', label: 'WhatsApp', desc: '+91 90990 12345', href: '/citizen-voice' },
  { icon: '📞', label: 'Helpline', desc: '1800-180-6127' },
  { icon: '🌐', label: 'Web Portal', desc: 'This portal' },
];

const CATEGORIES = [
  { icon: '💧', label: 'Water Supply', dept: 'GWSSB' },
  { icon: '🛣️', label: 'Roads', dept: 'Roads & B' },
  { icon: '⚡', label: 'Electricity', dept: 'DGVCL' },
  { icon: '🗑️', label: 'Sanitation', dept: 'AMC' },
  { icon: '🏛️', label: 'Revenue', dept: 'Revenue Dept' },
  { icon: '🏥', label: 'Health', dept: 'CDHO' },
  { icon: '📚', label: 'Education', dept: 'Education Dept' },
  { icon: '➕', label: 'Other', dept: 'General' },
];

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FFFBEB', icon: <Clock size={12} /> },
  in_progress: { label: 'In Progress', color: '#1A56C4', bg: '#EBF2FF', icon: <AlertCircle size={12} /> },
  resolved: { label: 'Resolved', color: '#16A34A', bg: '#F0FDF4', icon: <CheckCircle size={12} /> },
};

type Tab = 'home' | 'my_complaints' | 'new' | 'track';

export default function SwagatPage() {
  const [tab, setTab] = useState<Tab>('home');
  const [trackId, setTrackId] = useState('');
  const [tracked, setTracked] = useState<typeof MY_COMPLAINTS[0] | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ category: '', description: '', address: '', name: '', phone: '' });

  function handleTrack() {
    const found = MY_COMPLAINTS.find(c => c.id.toLowerCase() === trackId.toLowerCase());
    if (found) setTracked(found);
    else toast.error('Complaint not found. Please check the token number.');
  }

  function handleSubmit() {
    if (!form.description || !form.address || !form.name || !form.phone) return toast.error('Please fill all required fields');
    toast.success('Complaint filed! Token: GVM-2025-' + Math.floor(10000 + Math.random() * 90000));
    setStep(1);
    setForm({ category: '', description: '', address: '', name: '', phone: '' });
    setTab('my_complaints');
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E1C2F] to-[#1A56C4] text-white px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-[18px] font-bold">Swagat 3.0</h1>
            <p className="text-[11px] text-blue-200">Gujarat Government · Citizen Portal</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Globe size={20} className="text-white" />
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="bg-white border-b border-[#DDE3EE] flex flex-shrink-0">
        {([['home', '🏠 Home'], ['my_complaints', '📋 My Cases'], ['new', '➕ File New'], ['track', '🔍 Track']] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-[11px] font-semibold transition-all border-b-2 ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-[#7A8FA6]'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* HOME TAB */}
        {tab === 'home' && (
          <div>
            {/* Welcome banner */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[14px] p-4 mb-4">
              <p className="text-[14px] font-bold text-[#0E1C2F] mb-1">Welcome, Rajesh Patel</p>
              <p className="text-[12px] text-[#3D5068]">You have <span className="font-bold text-blue-600">1 active</span> complaint and <span className="font-bold text-green-600">1 resolved</span> case.</p>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => setTab('new')} className="bg-blue-600 text-white rounded-[14px] p-4 flex items-center gap-3 hover:bg-blue-700 transition-all">
                <Plus size={20} />
                <div className="text-left">
                  <p className="text-[13px] font-bold">File Complaint</p>
                  <p className="text-[10px] opacity-80">New grievance</p>
                </div>
              </button>
              <button onClick={() => setTab('track')} className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 flex items-center gap-3 hover:border-blue-300 transition-all">
                <Search size={20} className="text-blue-600" />
                <div className="text-left">
                  <p className="text-[13px] font-bold text-[#0E1C2F]">Track Status</p>
                  <p className="text-[10px] text-[#7A8FA6]">Enter token ID</p>
                </div>
              </button>
            </div>

            {/* Categories */}
            <p className="text-[12px] font-bold text-[#0E1C2F] mb-2">File by Category</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {CATEGORIES.map(cat => (
                <button key={cat.label} onClick={() => { setForm(f => ({ ...f, category: cat.label })); setTab('new'); }}
                  className="bg-white border border-[#DDE3EE] rounded-[12px] p-2.5 flex flex-col items-center gap-1 hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[9px] font-semibold text-[#3D5068] text-center leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Channels */}
            <p className="text-[12px] font-bold text-[#0E1C2F] mb-2">Other Ways to Reach Us</p>
            <div className="grid grid-cols-2 gap-2">
              {CHANNELS.map(ch => (
                <div key={ch.label} className="bg-white border border-[#DDE3EE] rounded-[12px] p-3 flex items-center gap-2.5">
                  <span className="text-xl">{ch.icon}</span>
                  <div>
                    <p className="text-[11px] font-semibold text-[#0E1C2F]">{ch.label}</p>
                    <p className="text-[10px] text-[#7A8FA6]">{ch.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MY COMPLAINTS TAB */}
        {tab === 'my_complaints' && (
          <div className="space-y-3">
            <p className="text-[13px] font-bold text-[#0E1C2F]">{MY_COMPLAINTS.length} complaints</p>
            {MY_COMPLAINTS.map(c => {
              const sc = STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG];
              const slaUsed = Math.min((c.days_open / c.sla_days) * 100, 100);
              const slaColor = slaUsed >= 100 ? '#DC2626' : slaUsed >= 80 ? '#D97706' : '#16A34A';
              return (
                <div key={c.id} className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[12px] font-bold text-[#0E1C2F]">{c.category}</p>
                      <p className="text-[10px] font-mono text-[#7A8FA6]">{c.id}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                      {sc.icon} {sc.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3D5068] mb-2">{c.lastUpdate}</p>
                  {c.status !== 'resolved' && (
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-[#7A8FA6]">SLA Progress</span>
                        <span className="font-bold" style={{ color: slaColor }}>{c.days_open}/{c.sla_days} days</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${slaUsed}%`, background: slaColor }} />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#DDE3EE]">
                    <span className="text-[10px] text-[#7A8FA6]">
                      {c.officer === 'Unassigned' ? '⏳ Awaiting assignment' : `👤 ${c.officer} · ${c.dept}`}
                    </span>
                    <span className="text-[10px] text-[#7A8FA6]">{c.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* NEW COMPLAINT TAB */}
        {tab === 'new' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3].map(s => (
                <React.Fragment key={s}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                  {s < 3 && <div className={`flex-1 h-1 rounded-full ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[11px] text-[#7A8FA6] mb-4">
              {step === 1 ? 'Step 1 of 3 · Select Category' : step === 2 ? 'Step 2 of 3 · Complaint Details' : 'Step 3 of 3 · Your Information'}
            </p>

            {step === 1 && (
              <div>
                <p className="text-[13px] font-bold text-[#0E1C2F] mb-3">Select complaint category</p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.label} onClick={() => { setForm(f => ({ ...f, category: cat.label })); setStep(2); }}
                      className={`p-3 rounded-[12px] border-2 flex items-center gap-2 transition-all ${form.category === cat.label ? 'border-blue-500 bg-blue-50' : 'border-[#DDE3EE] bg-white hover:border-blue-200'}`}>
                      <span className="text-xl">{cat.icon}</span>
                      <div className="text-left">
                        <p className="text-[12px] font-semibold text-[#0E1C2F]">{cat.label}</p>
                        <p className="text-[9px] text-[#7A8FA6]">{cat.dept}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Describe your complaint *</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={4} placeholder="Explain the issue in detail..."
                    className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-blue-400 resize-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Location / Address *</label>
                  <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="Ward, Street, Landmark, District..."
                    className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-blue-400" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068]">Back</button>
                  <button onClick={() => { if (!form.description || !form.address) return toast.error('Fill in all fields'); setStep(3); }}
                    className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold bg-blue-600 text-white">Next</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Your Full Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Rajesh Patel"
                    className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Mobile Number *</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210" type="tel"
                    className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-blue-400" />
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-[10px] p-3 text-[11px] text-blue-700">
                  📩 You will receive SMS updates on this number. Standard messaging rates may apply.
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068]">Back</button>
                  <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold bg-green-600 text-white">
                    Submit Complaint
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRACK TAB */}
        {tab === 'track' && (
          <div>
            <p className="text-[13px] font-bold text-[#0E1C2F] mb-3">Track Your Complaint</p>
            <div className="flex gap-2 mb-4">
              <input value={trackId} onChange={e => setTrackId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                placeholder="Enter token (e.g. GVM-2025-05341)"
                className="flex-1 px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] focus:outline-none focus:border-blue-400" />
              <button onClick={handleTrack} className="px-4 py-2 rounded-[10px] text-[12px] font-semibold bg-blue-600 text-white">Track</button>
            </div>

            {tracked && (
              <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[14px] font-bold text-[#0E1C2F]">{tracked.category}</p>
                    <p className="text-[10px] font-mono text-[#7A8FA6]">{tracked.id}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: STATUS_CONFIG[tracked.status as keyof typeof STATUS_CONFIG].bg, color: STATUS_CONFIG[tracked.status as keyof typeof STATUS_CONFIG].color }}>
                    {STATUS_CONFIG[tracked.status as keyof typeof STATUS_CONFIG].label}
                  </span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#7A8FA6]">Filed On</span>
                    <span className="font-semibold text-[#3D5068]">{tracked.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A8FA6]">Department</span>
                    <span className="font-semibold text-[#3D5068]">{tracked.dept}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A8FA6]">Assigned To</span>
                    <span className="font-semibold text-[#3D5068]">{tracked.officer}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#DDE3EE]">
                  <p className="text-[10px] text-[#7A8FA6] mb-1">Latest Update</p>
                  <p className="text-[12px] text-[#3D5068]">{tracked.lastUpdate}</p>
                </div>
              </div>
            )}

            <div className="mt-4 bg-gray-50 border border-[#DDE3EE] rounded-[12px] p-3">
              <p className="text-[11px] font-bold text-[#0E1C2F] mb-1">Don't have a token?</p>
              <p className="text-[10px] text-[#7A8FA6]">Your token was sent via SMS when your complaint was filed. Contact helpline 1800-180-6127 for assistance.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
