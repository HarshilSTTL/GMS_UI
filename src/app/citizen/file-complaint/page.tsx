'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertCircle, CheckCircle, Check, ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';
import { GmsIcon } from '@/components/ui/GmsIcon';

interface Category {
  id: string;
  code: string;
  icon: string;
  iconName?: string;
  name: string;
  description: string;
  department: string;
  slaHours: number;
  priority: string;
  active: boolean;
}

interface FormData {
  categoryId: string;
  categoryName: string;
  department: string;
  description: string;
  location: string;
  phone: string;
  attachments?: string[]; // Cloudinary URLs
}

const DETAIL_STEPS = ['Category', 'Sub-type', 'Details', 'Review'];

export default function FileComplaint() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mode, setMode] = useState<'detail' | 'quick'>('detail');
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    categoryId: '',
    categoryName: '',
    department: '',
    description: '',
    location: '',
    phone: '',
    attachments: [],
  });
  const [quickForm, setQuickForm] = useState({
    categoryId: '',
    categoryName: '',
    department: '',
    description: '',
    location: '',
    phone: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data: Category[] = await res.json();
        setCategories(data.filter(c => c.active));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }

  function handleCategorySelect(cat: Category) {
    setForm({ ...form, categoryId: cat.id, categoryName: cat.name, department: cat.department });
    setError('');
    setStep(2);
  }

  function validateStep2(): boolean {
    if (!form.description.trim() || form.description.length < 10) {
      setError('Description must be at least 10 characters.');
      return false;
    }
    if (!form.location.trim()) {
      setError('Location / address is required.');
      return false;
    }
    const phone = form.phone.replace(/\s+/g, '');
    if (!phone || !/^\+?91?[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid Indian mobile number.');
      return false;
    }
    return true;
  }

  function goToConfirm() {
    setError('');
    if (validateStep2()) setStep(4);
  }

  async function submitGrievance(formData: FormData) {
    setError('');
    setLoading(true);
    try {
      let attachmentUrls: string[] = [];

      // Upload files to Cloudinary if any (only for detail submit)
      if (selectedFiles.length > 0) {
        setUploadingFiles(true);
        for (const file of selectedFiles) {
          const uploadForm = new FormData();
          uploadForm.append('file', file);
          uploadForm.append('grievanceId', 'pending');

          const uploadRes = await fetch('/api/documents/upload', {
            method: 'POST',
            body: uploadForm,
          });

          if (!uploadRes.ok) {
            const uploadErr = await uploadRes.json();
            throw new Error(`File upload failed: ${uploadErr.error}`);
          }

          const uploadResult = await uploadRes.json();
          if (uploadResult.success) {
            attachmentUrls.push(uploadResult.data.url);
          }
        }
        setUploadingFiles(false);
      }

      // Create grievance
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenId: user?.id,
          title: `${formData.categoryName} — ${formData.location}`,
          description: formData.description,
          category: formData.categoryName,
          department: formData.department,
          location: formData.location,
          citizenName: user?.name ?? 'Citizen',
          citizenPhone: formData.phone,
          citizenEmail: user?.email ?? null,
          status: 'open',
          priority: 'medium',
          channel: 'web',
          slaStatus: 'ok',
          slaDaysLeft: 5,
          ward: '',
          district: 'Ahmedabad',
          assignedTo: null,
          groupId: null,
          isGroupPrimary: false,
          attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setToken(result.data.token);
        setSubmitted(true);
      } else {
        setError('Failed to submit complaint. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickSubmit() {
    if (!quickForm.categoryId || !quickForm.description.trim() || !quickForm.location.trim() || !quickForm.phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    await submitGrievance(quickForm);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F4F2EE] py-6 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center space-y-6 py-8">
          <div className="w-20 h-20 bg-[#D4EDDA] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-[#22C55E]" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-[#0F1A2E]">Complaint Filed Successfully!</h2>
            <p className="text-[12px] text-[#7A8FA6] mt-2">Your complaint has been registered with the Gujarat Government.</p>
          </div>
          <div className="bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6] border border-[#FFB84D] rounded-[14px] p-6">
            <p className="text-[10px] font-bold uppercase text-[#7A8FA6] tracking-widest mb-2">Your Complaint Token</p>
            <p className="text-[22px] font-bold text-[#FF8C42] font-mono tracking-wider">{token}</p>
            <p className="text-[11px] text-[#7A8FA6] mt-3">Save this token to track your complaint status at any time.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/citizen/track')}
              className="flex-1 py-2.5 bg-white border border-[#E5E7EB] text-[#0F1A2E] rounded-[6px] text-[12px] font-semibold hover:bg-[#F4F2EE] transition-colors"
            >
              Track Now
            </button>
            <button
              onClick={() => router.push('/citizen/complaints')}
              className="flex-1 py-2.5 bg-[#FF8C42] text-white rounded-[6px] text-[12px] font-semibold hover:bg-[#E67E22] transition-colors"
            >
              My Complaints
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EE] py-6 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button & Page Title */}
        <div className="flex items-start gap-4">
          <button onClick={() => router.back()} className="text-[#FF8C42] hover:text-[#E67E22] mt-1">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-[20px] font-bold text-[#0F1A2E]">Submit Grievance</h1>
            <p className="text-[12px] text-[#FF8C42] mt-0.5">ફરિયાદ નોંધો — File a complaint</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-4 flex items-center gap-3">
          <span className="text-[12px] font-semibold text-[#0F1A2E]">Mode:</span>
          <button
            onClick={() => { setMode('detail'); setStep(1); setError(''); }}
            className={cn(
              'px-4 py-2 rounded-[20px] text-[12px] font-semibold transition-colors',
              mode === 'detail'
                ? 'bg-[#FF8C42] text-white'
                : 'bg-[#F4F2EE] text-[#7A8FA6] hover:bg-[#E5E7EB]'
            )}
          >
            Step-by-step
          </button>
          <button
            onClick={() => { setMode('quick'); setError(''); }}
            className={cn(
              'px-4 py-2 rounded-[20px] text-[12px] font-semibold transition-colors',
              mode === 'quick'
                ? 'bg-[#FF8C42] text-white'
                : 'bg-[#F4F2EE] text-[#7A8FA6] hover:bg-[#E5E7EB]'
            )}
          >
            Quick Submit
          </button>
        </div>

        {/* Step Indicator (Detail Mode Only) */}
        {mode === 'detail' && (
          <div className="flex items-center gap-0 justify-between">
            {DETAIL_STEPS.map((label, i) => {
              const idx = i + 1;
              const done = step > idx;
              const active = step === idx;
              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors',
                      done ? 'bg-[#22C55E] text-white' : active ? 'bg-[#FF8C42] text-white' : 'bg-[#E5E7EB] text-[#7A8FA6]'
                    )}>
                      {done ? <Check size={14} /> : idx}
                    </div>
                    <span className={cn(
                      'text-[11px] font-semibold text-center',
                      active ? 'text-[#FF8C42]' : done ? 'text-[#22C55E]' : 'text-[#7A8FA6]'
                    )}>{label}</span>
                  </div>
                  {i < DETAIL_STEPS.length - 1 && (
                    <div className={cn('h-px flex-1 mx-2', step > idx ? 'bg-[#22C55E]' : 'bg-[#E5E7EB]')} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-[#FFE5E5] border border-[#FF8A80] rounded-lg px-3 py-2.5">
            <AlertCircle size={14} className="text-[#FF8A80] flex-shrink-0" />
            <p className="text-[12px] text-[#D32F2F]">{error}</p>
          </div>
        )}

        {/* ── DETAIL MODE ── */}
        {mode === 'detail' && (
          <>
            {/* Step 1: Category */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-4 shadow-sm">
                  <h2 className="text-[15px] font-bold text-[#0F1A2E] mb-4">Select Complaint Category</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat)}
                        className={cn(
                          'text-left p-3 border-2 rounded-[10px] transition-all group',
                          form.categoryId === cat.id
                            ? 'border-[#FF8C42] bg-[#FFF8F0]'
                            : 'border-[#E5E7EB] hover:border-[#FF8C42] hover:bg-[#FFF8F0]/40'
                        )}
                      >
                        <div className="mb-2 flex items-center justify-center w-9 h-9 rounded-xl bg-[#F4F2EE]">
                          {cat.iconName
                            ? <GmsIcon name={cat.iconName} size={20} className="text-[#FF8C42]" />
                            : <ClipboardList size={20} className="text-[#FF8C42]" />}
                        </div>
                        <p className="text-[12px] font-semibold text-[#0F1A2E] leading-tight">{cat.name}</p>
                        <p className="text-[10px] text-[#7A8FA6] mt-0.5">{cat.department}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-4 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setStep(1); setError(''); }}
                    className="flex items-center gap-1 text-[12px] text-[#FF8C42] hover:text-[#E67E22]"
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#0F1A2E]">Complaint Details</h2>
                    <p className="text-[11px] text-[#7A8FA6]">Category: <span className="font-semibold text-[#FF8C42]">{form.categoryName}</span></p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold text-[#0F1A2E] mb-1.5">
                    Complaint Description <span className="text-[#FF8A80]">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => { setForm({ ...form, description: e.target.value }); setError(''); }}
                    placeholder="Explain the issue in detail. Include dates, frequency, impact..."
                    rows={5}
                    className="w-full p-3 border border-[#E5E7EB] rounded-lg text-[12px] text-[#0F1A2E] outline-none focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/10 placeholder:text-[#7A8FA6] resize-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[11px] font-bold text-[#0F1A2E] mb-1.5">
                    Location / Address <span className="text-[#FF8A80]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => { setForm({ ...form, location: e.target.value }); setError(''); }}
                    placeholder="Ward, Street, Landmark, District..."
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-[12px] text-[#0F1A2E] outline-none focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/10 placeholder:text-[#7A8FA6]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-bold text-[#0F1A2E] mb-1.5">
                    Mobile Number <span className="text-[#FF8A80]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => { setForm({ ...form, phone: e.target.value }); setError(''); }}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-[12px] text-[#0F1A2E] outline-none focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/10 placeholder:text-[#7A8FA6]"
                  />
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-[11px] font-bold text-[#0F1A2E] mb-1.5">
                    Attach Documents <span className="text-[#7A8FA6] font-normal">(Optional - Photos, PDFs, etc.)</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-dashed border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#FF8C42] hover:bg-[#FFF8F0]/50 transition-colors">
                      <span className="text-[16px]">📎</span>
                      <span className="text-[12px] text-[#7A8FA6]">Click to select files or drag and drop</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={e => setSelectedFiles([...selectedFiles, ...(e.target.files ? Array.from(e.target.files) : [])])}
                        className="hidden"
                      />
                    </label>

                    {selectedFiles.length > 0 && (
                      <div className="bg-[#F0F7FF] border border-[#B3E5FC] rounded-lg p-3 space-y-2">
                        <p className="text-[11px] font-bold text-[#0277BD]">Selected Files ({selectedFiles.length}):</p>
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-[#B3E5FC]">
                            <p className="text-[11px] text-[#0F1A2E] truncate">{file.name}</p>
                            <button
                              onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                              className="text-[11px] text-[#FF8A80] hover:text-red-700 font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setStep(1); setError(''); }}
                    className="flex-1 px-4 py-2.5 bg-white border border-[#E5E7EB] text-[#0F1A2E] rounded-[6px] text-[12px] font-semibold hover:bg-[#F4F2EE] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={goToConfirm}
                    className="flex-1 px-4 py-2.5 bg-[#FF8C42] text-white rounded-[6px] text-[12px] font-semibold hover:bg-[#E67E22] transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-4 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setStep(2); setError(''); }}
                    className="flex items-center gap-1 text-[12px] text-[#FF8C42] hover:text-[#E67E22]"
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                  <h2 className="text-[15px] font-bold text-[#0F1A2E]">Review & Confirm</h2>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Citizen Name', value: user?.name },
                    { label: 'Category', value: form.categoryName },
                    { label: 'Department', value: form.department },
                    { label: 'Location', value: form.location },
                    { label: 'Mobile Number', value: form.phone },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-2 border-b border-[#F0F2F7]">
                      <span className="text-[11px] font-bold text-[#7A8FA6]">{row.label}</span>
                      <span className="text-[12px] font-semibold text-[#0F1A2E] text-right max-w-[60%]">{row.value}</span>
                    </div>
                  ))}
                  <div className="py-2">
                    <p className="text-[11px] font-bold text-[#7A8FA6] mb-1">Description</p>
                    <p className="text-[12px] text-[#0F1A2E] leading-relaxed">{form.description}</p>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="py-2">
                      <p className="text-[11px] font-bold text-[#7A8FA6] mb-2">Attachments ({selectedFiles.length})</p>
                      <div className="space-y-1">
                        {selectedFiles.map((file, idx) => (
                          <p key={idx} className="text-[11px] text-[#0F1A2E] flex items-center gap-2">
                            📎 {file.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setStep(2); setError(''); }}
                    className="flex-1 px-4 py-2.5 bg-white border border-[#E5E7EB] text-[#0F1A2E] rounded-[6px] text-[12px] font-semibold hover:bg-[#F4F2EE] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => submitGrievance(form)}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-[#22C55E] text-white rounded-[6px] text-[12px] font-semibold hover:bg-[#16A34A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                    ) : 'Submit Complaint'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── QUICK SUBMIT MODE ── */}
        {mode === 'quick' && (
          <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-4 space-y-4 shadow-sm">
            <h2 className="text-[15px] font-bold text-[#0F1A2E]">Quick Complaint Filing</h2>
            <p className="text-[12px] text-[#7A8FA6]">Submit a complaint with just the essential details</p>

            {/* Category Selection */}
            <div>
              <label className="block text-[11px] font-bold text-[#0F1A2E] mb-2">
                Select Complaint Category <span className="text-[#FF8A80]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setQuickForm({ ...quickForm, categoryId: cat.id, categoryName: cat.name, department: cat.department });
                      setError('');
                    }}
                    className={cn(
                      'text-left p-2 border-2 rounded-[10px] transition-all',
                      quickForm.categoryId === cat.id
                        ? 'border-[#FF8C42] bg-[#FFF8F0]'
                        : 'border-[#E5E7EB] hover:border-[#FF8C42] hover:bg-[#FFF8F0]/40'
                    )}
                  >
                    <div className="mb-1.5 flex items-center justify-center w-7 h-7 rounded-lg bg-[#F4F2EE]">
                      {cat.iconName
                        ? <GmsIcon name={cat.iconName} size={16} className="text-[#FF8C42]" />
                        : <ClipboardList size={16} className="text-[#FF8C42]" />}
                    </div>
                    <p className="text-[11px] font-semibold text-[#0F1A2E] leading-tight">{cat.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-[#0F1A2E] mb-1.5">
                Complaint Description <span className="text-[#FF8A80]">*</span>
              </label>
              <textarea
                value={quickForm.description}
                onChange={e => { setQuickForm({ ...quickForm, description: e.target.value }); setError(''); }}
                placeholder="Briefly describe your complaint..."
                rows={4}
                className="w-full p-3 border border-[#E5E7EB] rounded-lg text-[12px] text-[#0F1A2E] outline-none focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/10 placeholder:text-[#7A8FA6] resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[11px] font-bold text-[#0F1A2E] mb-1.5">
                Location / Address <span className="text-[#FF8A80]">*</span>
              </label>
              <input
                type="text"
                value={quickForm.location}
                onChange={e => { setQuickForm({ ...quickForm, location: e.target.value }); setError(''); }}
                placeholder="Ward, Street, Landmark, District..."
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-[12px] text-[#0F1A2E] outline-none focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/10 placeholder:text-[#7A8FA6]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-bold text-[#0F1A2E] mb-1.5">
                Mobile Number <span className="text-[#FF8A80]">*</span>
              </label>
              <input
                type="tel"
                value={quickForm.phone}
                onChange={e => { setQuickForm({ ...quickForm, phone: e.target.value }); setError(''); }}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-[12px] text-[#0F1A2E] outline-none focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/10 placeholder:text-[#7A8FA6]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleQuickSubmit}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-[#FF8C42] text-white rounded-[6px] text-[12px] font-semibold hover:bg-[#E67E22] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                ) : 'Submit Complaint'}
              </button>
            </div>

            <div className="bg-[#F0F7FF] border border-[#B3E5FC] rounded-lg p-3">
              <p className="text-[11px] text-[#0277BD]">
                ⚡ Quick submit skips detailed documentation. You can add more details after filing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
