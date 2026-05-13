'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, MapPin, FileText, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores';
import { GmsIcon } from '@/components/ui/GmsIcon';

const CATEGORIES = [
  { iconName: 'Droplet', label: 'Water Supply', dept: 'GWSSB' },
  { iconName: 'Route', label: 'Roads & Infrastructure', dept: 'Roads & Buildings' },
  { iconName: 'Zap', label: 'Electricity & Lighting', dept: 'DGVCL' },
  { iconName: 'Trash2', label: 'Sanitation', dept: 'AMC' },
  { iconName: 'Landmark', label: 'Documents & Certificates', dept: 'Revenue Department' },
  { iconName: 'Hospital', label: 'Health', dept: 'Health & Family Welfare' },
  { iconName: 'GraduationCap', label: 'Education', dept: 'Education Department' },
  { iconName: 'Waves', label: 'Sewage & Drainage', dept: 'AMC' },
  { iconName: 'Building2', label: 'Encroachment', dept: 'AMC' },
  { iconName: 'Building', label: 'Property Tax', dept: 'Revenue Department' },
  { iconName: 'Bus', label: 'Public Transport', dept: 'AMC' },
  { iconName: 'Plus', label: 'Other', dept: 'General' },
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
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenId: user?.id || '',
          citizenName: user?.name || 'Citizen',
          citizenPhone: user?.phone || '',
          citizenEmail: user?.email || null,
          title: form.title,
          description: form.description,
          category: form.category,
          department: form.department,
          priority: form.priority,
          channel: form.channel,
          location: form.location,
          ward: form.ward,
          district: form.district,
        }),
      });
      const data = await res.json();
      toast.success(`Grievance filed! Token: ${data.data?.token}`);
      router.push('/citizen/grievances');
    } catch {
      toast.error('Failed to submit grievance');
    } finally {
      setSubmitting(false);
    }
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

      {/* Step 1: Category */}
      {step === 1 && (
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-1">Select Category</h2>
          <p className="text-[11px] text-[#7A8FA6] mb-4">Choose the category that best describes your grievance</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat.label} onClick={() => { updateForm('category', cat.label); updateForm('department', cat.dept); }}
                className={`p-3 rounded-[12px] border-2 flex items-center gap-2.5 text-left transition-all ${form.category === cat.label ? 'border-[#F4811F] bg-orange-50' : 'border-[#DDE3EE] hover:border-orange-200'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${form.category === cat.label ? 'bg-[#F4811F]/10' : 'bg-[#F0F2F7]'}`}>
                  <GmsIcon name={cat.iconName} size={16} className={form.category === cat.label ? 'text-[#F4811F]' : 'text-[#3D5068]'} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#0E1C2F]">{cat.label}</p>
                  <p className="text-[9px] text-[#7A8FA6]">{cat.dept}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => { if (!form.category) return toast.error('Please select a category'); setStep(2); }} className="px-6 py-2.5 rounded-[10px] text-[12px] font-semibold bg-[#F4811F] text-white border-none">Next</button>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
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
              <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} rows={4} placeholder="Explain the issue in detail. Include what happened, when, and who is affected..." className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F] resize-none" />
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
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white">Back</button>
            <button onClick={() => { if (!form.title || !form.description || !form.location || !form.district) return toast.error('Please fill all required fields'); setStep(3); }} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold bg-[#F4811F] text-white border-none">Next</button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-1">Review & Submit</h2>
          <p className="text-[11px] text-[#7A8FA6] mb-4">Please verify your grievance details before submitting</p>

          <div className="space-y-3 mb-4">
            {[
              { label: 'Category', value: form.category },
              { label: 'Title', value: form.title },
              { label: 'Description', value: form.description },
              { label: 'Location', value: form.location },
              { label: 'District', value: form.district },
              { label: 'Ward', value: form.ward || '—' },
              { label: 'Priority', value: form.priority.charAt(0).toUpperCase() + form.priority.slice(1) },
              { label: 'Department', value: form.department },
              { label: 'Channel', value: form.channel },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-1.5 border-b border-[#F0F2F7] last:border-0">
                <span className="text-[11px] text-[#7A8FA6]">{item.label}</span>
                <span className="text-[11px] font-semibold text-[#0E1C2F] text-right max-w-[60%]">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-[10px] p-3 text-[11px] text-blue-700 mb-4">
            📩 You will receive an SMS confirmation with your grievance token number. You can track the status using this token.
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white">Back</button>
            <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-bold bg-green-600 text-white border-none disabled:opacity-60">
              {submitting ? <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</span> : 'Submit Grievance'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
