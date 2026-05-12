'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertCircle, CheckCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  code: string;
  icon: string;
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
}

const STEPS = ['Select Category', 'Complaint Details', 'Confirm & Submit'];

export default function FileComplaint() {
  const router = useRouter();
  const { user } = useAuthStore();
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
  });

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
    if (validateStep2()) setStep(3);
  }

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${form.categoryName} — ${form.location}`,
          description: form.description,
          category: form.categoryName,
          department: form.department,
          location: form.location,
          citizenName: user?.name ?? 'Citizen',
          citizenPhone: form.phone,
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
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setSubmitted(true);
      } else {
        setError('Failed to submit complaint. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-[#0E1C2F]">Complaint Filed Successfully!</h2>
          <p className="text-[12px] text-[#7A8FA6] mt-2">Your complaint has been registered with the Gujarat Government.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
          <p className="text-[10px] font-bold uppercase text-[#7A8FA6] tracking-widest mb-2">Your Complaint Token</p>
          <p className="text-[22px] font-bold text-blue-600 font-mono tracking-wider">{token}</p>
          <p className="text-[11px] text-[#7A8FA6] mt-3">Save this token to track your complaint status at any time.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/citizen/track')}
            className="flex-1 py-2.5 bg-white border border-[#DDE3EE] text-[#3D5068] rounded-lg text-[12px] font-semibold hover:bg-[#F8FAFD] transition-colors"
          >
            Track Now
          </button>
          <button
            onClick={() => router.push('/citizen/complaints')}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-[12px] font-semibold hover:bg-blue-700 transition-colors"
          >
            My Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-bold text-[#0E1C2F]">File New Complaint</h1>
        <p className="text-[12px] text-[#7A8FA6] mt-1">Report a grievance to the Gujarat Government</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((label, i) => {
          const idx = i + 1;
          const done = step > idx;
          const active = step === idx;
          return (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors',
                  done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-[#E5E7EB] text-[#7A8FA6]'
                )}>
                  {done ? <Check size={13} /> : idx}
                </div>
                <span className={cn(
                  'text-[11px] font-semibold hidden sm:block',
                  active ? 'text-blue-600' : done ? 'text-green-600' : 'text-[#7A8FA6]'
                )}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px mx-2', step > idx ? 'bg-green-400' : 'bg-[#E5E7EB]')} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
          <p className="text-[12px] text-red-600">{error}</p>
        </div>
      )}

      {/* ── STEP 1: Category ── */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#DDE3EE] p-4">
            <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-4">Select Complaint Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat)}
                  className={cn(
                    'text-left p-3 border-2 rounded-xl transition-all group',
                    form.categoryId === cat.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-[#DDE3EE] hover:border-blue-300 hover:bg-blue-50/50'
                  )}
                >
                  <span className="text-[22px] mb-2 block">{cat.icon || '📋'}</span>
                  <p className="text-[12px] font-semibold text-[#0E1C2F] leading-tight">{cat.name}</p>
                  <p className="text-[10px] text-[#7A8FA6] mt-0.5">{cat.department}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Details ── */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-[#DDE3EE] p-4 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setStep(1); setError(''); }}
              className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <div>
              <h2 className="text-[14px] font-bold text-[#0E1C2F]">Complaint Details</h2>
              <p className="text-[11px] text-[#7A8FA6]">Category: <span className="font-semibold text-blue-600">{form.categoryName}</span></p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">
              Complaint Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => { setForm({ ...form, description: e.target.value }); setError(''); }}
              placeholder="Explain the issue in detail. Include dates, frequency, impact..."
              rows={5}
              className="w-full p-3 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-[#7A8FA6] resize-none"
            />
            <div className="flex justify-between mt-1">
              <p className="text-[10px] text-[#7A8FA6]">Min. 10 characters</p>
              <p className={cn('text-[10px]', form.description.length < 10 ? 'text-red-400' : 'text-green-600')}>
                {form.description.length} chars
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">
              Location / Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.location}
              onChange={e => { setForm({ ...form, location: e.target.value }); setError(''); }}
              placeholder="Ward, Street, Landmark, District..."
              className="w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-[#7A8FA6]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => { setForm({ ...form, phone: e.target.value }); setError(''); }}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-[#7A8FA6]"
            />
          </div>

          {/* SMS Notice */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-[11px] text-blue-700">
              📩 SMS updates will be sent to this number when your complaint status changes.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setStep(1); setError(''); }}
              className="flex-1 px-4 py-2.5 bg-white border border-[#DDE3EE] text-[#3D5068] rounded-lg text-[12px] font-semibold hover:bg-[#F8FAFD] transition-colors"
            >
              Back
            </button>
            <button
              onClick={goToConfirm}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-[12px] font-semibold hover:bg-blue-700 transition-colors"
            >
              Review & Submit
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Confirm ── */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-[#DDE3EE] p-4 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setStep(2); setError(''); }}
              className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <h2 className="text-[14px] font-bold text-[#0E1C2F]">Review & Confirm</h2>
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
                <span className="text-[12px] font-semibold text-[#0E1C2F] text-right max-w-[60%]">{row.value}</span>
              </div>
            ))}
            <div className="py-2">
              <p className="text-[11px] font-bold text-[#7A8FA6] mb-1">Description</p>
              <p className="text-[12px] text-[#0E1C2F] leading-relaxed">{form.description}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setStep(2); setError(''); }}
              className="flex-1 px-4 py-2.5 bg-white border border-[#DDE3EE] text-[#3D5068] rounded-lg text-[12px] font-semibold hover:bg-[#F8FAFD] transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg text-[12px] font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
              ) : 'Submit Complaint'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
