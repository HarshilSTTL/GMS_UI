'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, MapPin, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores';
import { addLocalGrievance } from '@/lib/local-store';

const CATEGORIES = [
  { icon: '💧', label: 'Water Supply', dept: 'GWSSB' },
  { icon: '🛣️', label: 'Roads & Infrastructure', dept: 'Roads & Buildings' },
  { icon: '⚡', label: 'Electricity & Lighting', dept: 'DGVCL' },
  { icon: '🗑️', label: 'Sanitation', dept: 'AMC' },
  { icon: '🏛️', label: 'Documents & Certificates', dept: 'Revenue Department' },
  { icon: '🏥', label: 'Health', dept: 'Health & Family Welfare' },
  { icon: '📚', label: 'Education', dept: 'Education Department' },
  { icon: '🚰', label: 'Sewage & Drainage', dept: 'AMC' },
  { icon: '🏚️', label: 'Encroachment', dept: 'AMC' },
  { icon: '🏗️', label: 'Property Tax', dept: 'Revenue Department' },
  { icon: '🚌', label: 'Public Transport', dept: 'AMC' },
  { icon: '➕', label: 'Other', dept: 'General' },
];

const PRIORITIES = [
  { value: 'critical', label: 'Critical', desc: 'Life-threatening or emergency', color: '#DC2626' },
  { value: 'high', label: 'High', desc: 'Urgent — affects daily life', color: '#D97706' },
  { value: 'medium', label: 'Medium', desc: 'Important but not urgent', color: '#1A56C4' },
  { value: 'low', label: 'Low', desc: 'Minor issue or suggestion', color: '#16A34A' },
];

export default function SubmitGrievance() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState<{ token: string; id: string } | null>(null);
  const [form, setForm] = useState({
    category: '', title: '', description: '', location: '', ward: '', district: '',
    priority: 'medium', channel: 'web', department: '',
  });
  const [submitting, setSubmitting] = useState(false);

  function updateForm(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const token = `GJ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const id = `local-${Date.now()}`;

      const grievance = {
        id,
        token,
        title: form.title,
        description: form.description,
        category: form.category,
        department: form.department,
        status: 'pending',
        priority: form.priority,
        channel: form.channel,
        slaStatus: 'ok',
        slaDaysLeft: 7,
        citizenId: user?.id || '',
        citizenName: user?.name || 'Citizen',
        citizenPhone: '',
        citizenEmail: user?.email || '',
        location: form.location,
        ward: form.ward || '',
        district: form.district,
        assignedTo: null,
        groupId: null,
        isGroupPrimary: false,
        createdAt: now,
        updatedAt: now,
        submittedDate: now,
        resolvedAt: null,
        officer: 'Unassigned',
        officerDept: form.department,
        timeline: [{
          id: `tl-${id}-1`,
          type: 'created',
          title: 'Grievance Filed',
          actor: user?.name || 'Citizen',
          actorRole: 'citizen',
          timestamp: now,
          description: `Filed via web. Token: ${token}`,
        }],
        feedback: null,
        rating: null,
      };

      // Save locally first — guaranteed to work on Vercel
      addLocalGrievance(grievance);

      // Also try to persist on server (best-effort)
      fetch('/api/citizen/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grievance),
      }).catch(() => {});

      setSubmitted({ token, id });
    } catch {
      toast.error('Failed to submit grievance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Success screen
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-[14px] p-8 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)] text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-[18px] font-bold text-[#0E1C2F] mb-1">Grievance Submitted!</h2>
          <p className="text-[12px] text-[#7A8FA6] mb-5">Your grievance has been filed successfully.</p>

          <div className="bg-[#F0F7FF] border border-blue-100 rounded-[12px] p-4 mb-6">
            <p className="text-[10px] text-[#7A8FA6] font-semibold uppercase tracking-wide mb-1">Your Grievance Token</p>
            <p className="text-[22px] font-bold text-[#1A56C4] tracking-widest font-mono">{submitted.token}</p>
            <p className="text-[10px] text-[#7A8FA6] mt-1">Use this token to track your grievance status</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => router.push('/citizen/grievances')}
              className="w-full py-2.5 rounded-[10px] text-[13px] font-semibold bg-[#F4811F] text-white"
            >
              View My Grievances
            </button>
            <button
              onClick={() => router.push('/citizen/track')}
              className="w-full py-2.5 rounded-[10px] text-[13px] font-semibold border border-[#DDE3EE] text-[#3D5068]"
            >
              Track This Grievance
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/citizen')} className="w-8 h-8 rounded-lg bg-[#F0F2F7] flex items-center justify-center hover:bg-[#DDE3EE] transition-colors">
          <ArrowLeft size={16} className="text-[#3D5068]" />
        </button>
        <div>
          <h1 className="text-[16px] font-bold text-[#0E1C2F]">Submit Grievance</h1>
          <p className="text-[11px] text-[#7A8FA6]">File a new grievance in 3 easy steps</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-2">
        {[
          { n: 1, label: 'Category', icon: <FileText size={14} /> },
          { n: 2, label: 'Details', icon: <MapPin size={14} /> },
          { n: 3, label: 'Review & Submit', icon: <CheckCircle size={14} /> },
        ].map((s, idx) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${step >= s.n ? 'bg-[#F4811F] text-white' : 'bg-[#DDE3EE] text-[#7A8FA6]'}`}>
              {step > s.n ? <CheckCircle size={16} /> : s.icon}
            </div>
            <span className={`text-[11px] font-semibold hidden sm:inline ${step >= s.n ? 'text-[#0E1C2F]' : 'text-[#7A8FA6]'}`}>{s.label}</span>
            {idx < 2 && <div className={`flex-1 h-0.5 ${step > s.n ? 'bg-[#F4811F]' : 'bg-[#DDE3EE]'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-1">Select Category</h2>
          <p className="text-[11px] text-[#7A8FA6] mb-4">Choose the category that best describes your grievance</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat.label} onClick={() => { updateForm('category', cat.label); updateForm('department', cat.dept); }}
                className={`p-3 rounded-[12px] border-2 flex items-center gap-2.5 text-left transition-all ${form.category === cat.label ? 'border-[#F4811F] bg-orange-50' : 'border-[#DDE3EE] hover:border-orange-200'}`}>
                <span className="text-xl">{cat.icon}</span>
                <div>
                  <p className="text-[12px] font-semibold text-[#0E1C2F]">{cat.label}</p>
                  <p className="text-[9px] text-[#7A8FA6]">{cat.dept}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => { if (!form.category) return toast.error('Please select a category'); setStep(2); }} className="px-6 py-2.5 rounded-[10px] text-[12px] font-semibold bg-[#F4811F] text-white">Next</button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-1">Grievance Details</h2>
          <p className="text-[11px] text-[#7A8FA6] mb-4">Describe your issue in detail</p>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Title *</label>
              <input value={form.title} onChange={e => updateForm('title', e.target.value)} placeholder="Brief title for your grievance" className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F]" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Description *</label>
              <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} rows={4} placeholder="Explain the issue in detail..." className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F] resize-none" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Location / Address *</label>
              <input value={form.location} onChange={e => updateForm('location', e.target.value)} placeholder="Ward, Street, Landmark, District..." className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">District *</label>
                <input value={form.district} onChange={e => updateForm('district', e.target.value)} placeholder="e.g. Ahmedabad" className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Ward</label>
                <input value={form.ward} onChange={e => updateForm('ward', e.target.value)} placeholder="e.g. Ward 7" className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F]" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Priority *</label>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITIES.map(p => (
                  <button key={p.value} onClick={() => updateForm('priority', p.value)}
                    className={`p-2.5 rounded-[10px] border-2 text-left flex items-center gap-2 transition-all ${form.priority === p.value ? 'border-current' : 'border-[#DDE3EE]'}`}
                    style={form.priority === p.value ? { borderColor: p.color, background: p.color + '10' } : {}}>
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <div>
                      <p className="text-[11px] font-semibold" style={{ color: p.color }}>{p.label}</p>
                      <p className="text-[9px] text-[#7A8FA6]">{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068]">Back</button>
            <button onClick={() => { if (!form.title || !form.description || !form.location || !form.district) return toast.error('Please fill all required fields'); setStep(3); }} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold bg-[#F4811F] text-white">Next</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-1">Review & Submit</h2>
          <p className="text-[11px] text-[#7A8FA6] mb-4">Verify your grievance details before submitting</p>
          <div className="space-y-2 mb-4">
            {[
              { label: 'Category', value: form.category },
              { label: 'Title', value: form.title },
              { label: 'Description', value: form.description },
              { label: 'Location', value: form.location },
              { label: 'District', value: form.district },
              { label: 'Ward', value: form.ward || '—' },
              { label: 'Priority', value: form.priority.charAt(0).toUpperCase() + form.priority.slice(1) },
              { label: 'Department', value: form.department },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-1.5 border-b border-[#F0F2F7] last:border-0">
                <span className="text-[11px] text-[#7A8FA6]">{item.label}</span>
                <span className="text-[11px] font-semibold text-[#0E1C2F] text-right max-w-[60%]">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068]">Back</button>
            <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-bold bg-green-600 text-white disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : 'Submit Grievance'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
