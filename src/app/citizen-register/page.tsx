'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, ShieldCheck, ArrowLeft, ArrowRight, User, MapPin, Mail, FileText, RefreshCw, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';
import { getDefaultPath } from '@/data';

type Step = 'phone' | 'otp' | 'details';

const DISTRICTS = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
  'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhumi Dwarka',
  'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
  'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan',
  'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi',
  'Vadodara', 'Valsad',
];

export default function CitizenRegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, isAuthenticated, user, clearError } = useAuthStore();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [serverOtp, setServerOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [verifyError, setVerifyError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Details form
  const [form, setForm] = useState({
    firstName: '', lastName: '', fatherName: '',
    email: '', aadhaar: '',
    district: '', taluka: '', city: '', state: 'Gujarat',
    pincode: '', address: '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getDefaultPath(user.role));
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  // OTP helpers
  async function sendOTP() {
    if (phone.length !== 10) return;
    setSending(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setServerOtp(data.otp);
        setStep('otp');
        setTimer(30);
      }
    } catch {
      setVerifyError('Failed to send OTP.');
    }
    setSending(false);
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setVerifyError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }

  function verifyOtp() {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) return;
    if (otpStr === serverOtp || otpStr === '999999') {
      setStep('details');
      setVerifyError('');
    } else {
      setVerifyError('Invalid OTP. Please try again.');
    }
  }

  function updateForm(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    if (!form.firstName || !form.lastName) {
      setVerifyError('First name and last name are required.');
      return;
    }
    const ok = await register({ ...form, phone });
    if (ok) {
      router.replace(getDefaultPath('citizen'));
    }
  }

  const STEPS = [
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'otp', label: 'Verify', icon: ShieldCheck },
    { id: 'details', label: 'Details', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F7] flex items-center justify-center p-4">
      <div className="w-full max-w-[520px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-[#0F1A2E] rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-[#0F1A2E]/25">
            🏛
          </div>
          <h1 className="text-[22px] font-bold text-[#0E1C2F] tracking-tight">Citizen Registration</h1>
          <p className="text-[13px] text-[#7A8FA6] mt-1">Swagat — Gujarat Grievance Management System</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-6">
          {STEPS.map((s, i) => {
            const stepOrder = ['phone', 'otp', 'details'];
            const currentIdx = stepOrder.indexOf(step);
            const thisIdx = i;
            const isActive = thisIdx === currentIdx;
            const isDone = thisIdx < currentIdx;
            return (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors',
                    isDone && 'bg-green-500 text-white',
                    isActive && 'bg-[#0F1A2E] text-white',
                    !isDone && !isActive && 'bg-[#E5E7EB] text-[#7A8FA6]'
                  )}>
                    {isDone ? <CheckCircle size={14} /> : (i + 1)}
                  </div>
                  <span className={cn(
                    'text-[11px] font-medium',
                    isActive ? 'text-[#0E1C2F]' : 'text-[#7A8FA6]'
                  )}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    'w-12 h-0.5 mx-2 rounded',
                    isDone ? 'bg-green-400' : 'bg-[#E5E7EB]'
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(14,28,47,0.10)] p-8">
          <Link href="/" className="inline-flex items-center gap-1 text-[11px] text-[#7A8FA6] hover:text-[#0E1C2F] mb-5 transition-colors">
            <ArrowLeft size={12} /> Back to Home
          </Link>

          {/* Step 1: Phone */}
          {step === 'phone' && (
            <>
              <h2 className="text-[16px] font-bold text-[#0E1C2F] mb-1">Enter Mobile Number</h2>
              <p className="text-[12px] text-[#7A8FA6] mb-6">We&apos;ll send a 6-digit OTP to verify your number</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Mobile Number *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#7A8FA6] font-medium">+91</div>
                    <Phone size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                    <input
                      type="tel" value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210" maxLength={10}
                      className='w-full pl-11 pr-9 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#0E1C2F] outline-none placeholder:text-[#7A8FA6] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10'
                    />
                  </div>
                </div>
                <button
                  onClick={sendOTP}
                  disabled={phone.length !== 10 || sending}
                  className={cn(
                    'w-full py-2.5 rounded-lg text-[13px] font-semibold text-white',
                    'bg-[#0F1A2E] hover:bg-[#1A3260] transition-colors',
                    'shadow-sm shadow-[#0F1A2E]/25 mt-2',
                    'disabled:opacity-60 disabled:cursor-not-allowed',
                    'flex items-center justify-center gap-2'
                  )}
                >
                  {sending ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : <>Send OTP <ArrowRight size={14} /></>}
                </button>
              </div>
            </>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <>
              <h2 className="text-[16px] font-bold text-[#0E1C2F] mb-1">Verify OTP</h2>
              <p className="text-[12px] text-[#7A8FA6] mb-1">
                OTP sent to <span className="font-semibold text-[#0E1C2F]">+91 {phone}</span>
              </p>
              <p className="text-[11px] text-[#F4811F] font-medium mb-6">Demo: OTP is {serverOtp} (or use 999999)</p>
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input key={i} ref={el => { inputRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className='w-11 h-12 text-center text-[18px] font-bold border border-[#DDE3EE] rounded-lg outline-none text-[#0E1C2F] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10'
                    />
                  ))}
                </div>
                {verifyError && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5"><p className="text-[12px] text-red-600">{verifyError}</p></div>}
                <button onClick={verifyOtp} disabled={otp.join('').length !== 6}
                  className='w-full py-2.5 rounded-lg text-[13px] font-semibold text-white bg-[#0F1A2E] hover:bg-[#1A3260] transition-colors shadow-sm shadow-[#0F1A2E]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                  <ShieldCheck size={14} /> Verify OTP
                </button>
                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-[11px] text-[#7A8FA6]">Resend OTP in <span className="font-semibold text-[#0E1C2F]">{timer}s</span></p>
                  ) : (
                    <button onClick={() => { setOtp(['', '', '', '', '', '']); setVerifyError(''); sendOTP(); }} className="inline-flex items-center gap-1 text-[11px] text-[#F4811F] font-semibold hover:underline">
                      <RefreshCw size={11} /> Resend OTP
                    </button>
                  )}
                </div>
                <button onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); }} className="w-full text-[11px] text-[#7A8FA6] hover:text-[#0E1C2F]">
                  Change phone number
                </button>
              </div>
            </>
          )}

          {/* Step 3: Details */}
          {step === 'details' && (
            <>
              <h2 className="text-[16px] font-bold text-[#0E1C2F] mb-1">Your Details</h2>
              <p className="text-[12px] text-[#7A8FA6] mb-5">Fill in your information (fields marked * are required)</p>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">First Name *</label>
                    <input type="text" required value={form.firstName} onChange={e => updateForm('firstName', e.target.value)}
                      placeholder="Rajesh"
                      className='w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#0E1C2F] outline-none placeholder:text-[#7A8FA6] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10'
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Last Name *</label>
                    <input type="text" required value={form.lastName} onChange={e => updateForm('lastName', e.target.value)}
                      placeholder="Patel"
                      className='w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#0E1C2F] outline-none placeholder:text-[#7A8FA6] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10'
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Father&apos;s Name</label>
                  <input type="text" value={form.fatherName} onChange={e => updateForm('fatherName', e.target.value)}
                    placeholder="Father's full name"
                    className='w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#0E1C2F] outline-none placeholder:text-[#7A8FA6] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10'
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                    <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)}
                      placeholder="your@email.com"
                      className='w-full pl-9 pr-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#0E1C2F] outline-none placeholder:text-[#7A8FA6] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10'
                    />
                  </div>
                </div>

                {/* Aadhaar */}
                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Aadhaar Card Number</label>
                  <div className="relative">
                    <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                    <input type="text" value={form.aadhaar} onChange={e => updateForm('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))}
                      placeholder="XXXX XXXX XXXX"
                      className='w-full pl-9 pr-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#0E1C2F] outline-none placeholder:text-[#7A8FA6] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10'
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">State</label>
                    <input type="text" value={form.state} onChange={e => updateForm('state', e.target.value)} disabled
                      className='w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#7A8FA6] bg-[#F0F2F7] outline-none'
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">District</label>
                    <select value={form.district} onChange={e => updateForm('district', e.target.value)}
                      className='w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#0E1C2F] outline-none focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10 bg-white'
                    >
                      <option value="">Select District</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Taluka</label>
                    <input type="text" value={form.taluka} onChange={e => updateForm('taluka', e.target.value)}
                      placeholder="Taluka name"
                      className='w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#0E1C2F] outline-none placeholder:text-[#7A8FA6] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10'
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">City / Village</label>
                    <input type="text" value={form.city} onChange={e => updateForm('city', e.target.value)}
                      placeholder="City or village"
                      className='w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#0E1C2F] outline-none placeholder:text-[#7A8FA6] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10'
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Pincode</label>
                    <input type="text" value={form.pincode} onChange={e => updateForm('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="380001"
                      className='w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#0E1C2F] outline-none placeholder:text-[#7A8FA6] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10'
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Phone (verified)</label>
                    <input type="text" value={`+91 ${phone}`} disabled
                      className='w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#16A34A] bg-[#F0FDF4] outline-none'
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Address</label>
                  <textarea value={form.address} onChange={e => updateForm('address', e.target.value)} rows={2}
                    placeholder="Full address"
                    className='w-full px-3 py-2.5 border border-[#DDE3EE] rounded-lg text-[13px] text-[#0E1C2F] outline-none placeholder:text-[#7A8FA6] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10 resize-none'
                  />
                </div>

                {verifyError && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5"><p className="text-[12px] text-red-600">{verifyError}</p></div>}
                {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5"><p className="text-[12px] text-red-600">{error}</p></div>}

                <button type="submit" disabled={isLoading}
                  className={cn(
                    'w-full py-2.5 rounded-lg text-[13px] font-semibold text-white',
                    'bg-[#0F1A2E] hover:bg-[#1A3260] transition-colors',
                    'shadow-sm shadow-[#0F1A2E]/25 mt-2',
                    'disabled:opacity-60 disabled:cursor-not-allowed',
                    'flex items-center justify-center gap-2'
                  )}
                >
                  {isLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Registering...</>
                  ) : (
                    <><CheckCircle size={14} /> Complete Registration</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Links */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link href="/citizen-login" className="text-[12px] text-[#7A8FA6] hover:text-[#0E1C2F] font-medium transition-colors">
            Already registered? Login
          </Link>
          <span className="text-[#DDE3EE]">|</span>
          <Link href="/login" className="text-[12px] text-[#7A8FA6] hover:text-[#0E1C2F] font-medium transition-colors">
            Officer Login
          </Link>
        </div>

        <p className="text-center text-[11px] text-[#7A8FA6] mt-6">
          Gujarat Government · Grievance Management System v3.0
        </p>
      </div>
    </div>
  );
}
