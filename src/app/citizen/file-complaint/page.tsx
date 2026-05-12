'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: string;
  department: string;
  description: string;
}

interface FormData {
  category: string;
  description: string;
  location: string;
  phone: string;
}

export default function FileComplaint() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<FormData>({
    category: '',
    description: '',
    location: '',
    phone: user?.name || '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }

  function handleCategorySelect(categoryId: string) {
    setForm({ ...form, category: categoryId });
    setStep(2);
  }

  function handleSubmit() {
    setError('');

    // Validation
    if (!form.description.trim() || form.description.length < 10) {
      setError('Complaint description must be at least 10 characters');
      return;
    }
    if (!form.location.trim()) {
      setError('Location is required');
      return;
    }
    if (!form.phone.trim() || !/^\+?91?[6-9]\d{9}$/.test(form.phone.replace(/\s+/g, ''))) {
      setError('Valid phone number is required');
      return;
    }

    setStep(4); // Show confirmation
    submitComplaint();
  }

  async function submitComplaint() {
    try {
      setLoading(true);
      const categoryObj = categories.find(c => c.id === form.category);

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${categoryObj?.name} - ${form.location}`,
          description: form.description,
          category: categoryObj?.name,
          department: categoryObj?.department,
          location: form.location,
          citizenName: user?.name,
          citizenPhone: form.phone,
          citizenEmail: user?.email,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(data.token);
        setTimeout(() => router.push('/citizen/complaints'), 3000);
      } else {
        setError('Failed to file complaint. Please try again.');
        setStep(2);
      }
    } catch (err) {
      setError('Error filing complaint. Please try again.');
      console.error(err);
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${
                  step >= i ? 'bg-blue-600 text-white' : 'bg-[#E5E7EB] text-[#7A8FA6]'
                }`}
              >
                {step > i ? <CheckCircle size={16} /> : i}
              </div>
              {i < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors ${
                    step > i ? 'bg-blue-600' : 'bg-[#E5E7EB]'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#7A8FA6] text-center">
          Step {step} of {step === 4 ? '3 - Submitted!' : '3'}
        </p>
      </div>

      {/* Step 1: Category Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-[16px] font-bold text-[#0E1C2F] mb-2">Select Category</h2>
            <p className="text-[12px] text-[#7A8FA6]">What is your complaint about?</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="text-left p-3 border-2 border-[#DDE3EE] rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <p className="text-[24px] mb-1">{cat.icon}</p>
                <p className="text-[12px] font-semibold text-[#0E1C2F]">{cat.name}</p>
                <p className="text-[10px] text-[#7A8FA6] mt-1">{cat.department}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Complaint Details */}
      {step === 2 && (
        <div className="space-y-4">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700 mb-4"
          >
            <ChevronLeft size={14} />
            Back
          </button>

          <div>
            <h2 className="text-[16px] font-bold text-[#0E1C2F] mb-2">Complaint Details</h2>
            <p className="text-[12px] text-[#7A8FA6]">Describe your issue</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-[12px] text-red-600">{error}</p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-[#3D5068] mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the issue in detail (min 10 characters)..."
              rows={5}
              className="w-full p-3 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-[#7A8FA6]"
            />
            <p className="text-[10px] text-[#7A8FA6] mt-1">{form.description.length} characters</p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold text-[#3D5068] mb-2">Location / Address</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="Ward, Street, Landmark, District..."
              className="w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-[#7A8FA6]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-bold text-[#3D5068] mb-2">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[12px] text-[#0E1C2F] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-[#7A8FA6]"
            />
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-[11px] text-blue-700">
              📩 You will receive SMS updates on this number regarding your complaint status.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-2.5 bg-white border border-[#DDE3EE] text-[#3D5068] rounded-lg font-semibold text-[12px] hover:bg-[#F8FAFD] transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-[12px] hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#0E1C2F]">Complaint Filed Successfully!</h2>
            <p className="text-[12px] text-[#7A8FA6] mt-2">Your complaint has been registered.</p>
          </div>

          {success && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-[10px] font-bold uppercase text-[#7A8FA6] mb-2">Your Token</p>
              <p className="text-[18px] font-bold text-blue-600 font-mono">{success}</p>
              <p className="text-[10px] text-[#7A8FA6] mt-3">Save this token to track your complaint status</p>
            </div>
          )}

          <p className="text-[12px] text-[#7A8FA6]">Redirecting to your complaints...</p>
        </div>
      )}
    </div>
  );
}
