'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, ShieldCheck, RefreshCw, ArrowRight, Star, FileText, Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';
import { getDefaultPath } from '@/data';
import { storeOTP } from '@/data/mock-users';

const SERVICES = [
  { icon: FileText, text: 'File a grievance in minutes' },
  { icon: Search,   text: 'Track your complaint live' },
  { icon: Bell,     text: 'Get real-time status updates' },
  { icon: Star,     text: 'Access 12+ government schemes' },
];

const TESTIMONIALS = [
  { name: 'Suresh M.', district: 'Ahmedabad', text: 'My water issue was resolved in 3 days!' },
  { name: 'Kavita P.', district: 'Surat', text: 'Very easy to file and track grievances.' },
];

export default function CitizenLoginPage() {
  const router = useRouter();
  const { loginWithPhone, isLoading, error, isAuthenticated, user, clearError } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [serverOtp, setServerOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [verifyError, setVerifyError] = useState('');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) router.replace(getDefaultPath(user.role));
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  useEffect(() => {
    const interval = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(interval);
  }, []);

  async function sendOTP() {
    if (phone.length !== 10) return;
    setSending(true);
    clearError();
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
        storeOTP(phone, data.otp);
        setStep('otp');
        setTimer(30);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch {
      setVerifyError('Failed to send OTP. Please try again.');
    }
    setSending(false);
  }

  async function handleOtpSubmit() {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) return;
    setVerifyError('');
    clearError();
    const ok = await loginWithPhone(phone, otpStr);
    if (!ok) setVerifyError('Invalid OTP. Please try again.');
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

  function handleResend() {
    setOtp(['', '', '', '', '', '']);
    setVerifyError('');
    sendOTP();
  }

  const t = TESTIMONIALS[testimonialIdx];

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0F1A2E 0%, #0D2550 50%, #1A3260 100%)' }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #F4811F 0%, transparent 70%)', transform: 'translate(200px, -200px)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #16A34A 0%, transparent 70%)', transform: 'translate(-200px, 200px)' }} />

        {/* Logo & Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #F4811F, #E0721A)' }}>
              🏛
            </div>
            <div>
              <div className="text-white text-[16px] font-bold tracking-tight">Swagat Citizen Portal</div>
              <div className="text-blue-300 text-[11px] font-medium mt-0.5">Gujarat Grievance Management System</div>
            </div>
          </div>

          <h1 className="text-[30px] font-bold text-white leading-tight mb-3">
            Your Voice,<br />
            <span style={{ color: '#F4811F' }}>Our Priority.</span>
          </h1>
          <p className="text-[14px] text-blue-200 leading-relaxed max-w-[340px]">
            File grievances, track status in real-time, and access government schemes — all from your phone.
          </p>
        </div>

        {/* Services */}
        <div className="relative z-10 space-y-3 my-6">
          {SERVICES.map(s => (
            <div key={s.text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(244,129,31,0.15)' }}>
                <s.icon size={14} style={{ color: '#F4811F' }} />
              </div>
              <span className="text-[12px] text-blue-200">{s.text}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
          {[
            { value: '12+', label: 'Govt Schemes' },
            { value: '48h', label: 'Avg Resolution' },
            { value: '33', label: 'Districts' },
            { value: '100%', label: 'Free to Use' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[18px] font-bold" style={{ color: '#F4811F' }}>{s.value}</div>
              <div className="text-[9px] text-blue-300 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial Rotator */}
        <div className="relative z-10 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="flex gap-1 mb-2">
            {[0,1,2,3,4].map(i => <Star key={i} size={10} fill="#F4811F" style={{ color: '#F4811F' }} />)}
          </div>
          <p className="text-[12px] text-blue-100 italic mb-2 transition-all">&ldquo;{t.text}&rdquo;</p>
          <p className="text-[10px] text-blue-300 font-semibold">— {t.name}, {t.district}</p>
          <div className="flex gap-1 mt-3">
            {TESTIMONIALS.map((_, i) => (
              <div key={i} className="h-1 rounded-full transition-all duration-500" style={{ width: i === testimonialIdx ? 20 : 6, background: i === testimonialIdx ? '#F4811F' : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-4 text-[10px] text-blue-400">
          Government of Gujarat &middot; Digital Gujarat Initiative
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F4F6FA]">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #F4811F, #E0721A)' }}>🏛</div>
            <div>
              <div className="text-[15px] font-bold text-[#0E1C2F]">Swagat Citizen Portal</div>
              <div className="text-[10px] text-[#7A8FA6]">Gujarat GMS</div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4" style={{ background: 'rgba(244,129,31,0.10)', border: '1px solid rgba(244,129,31,0.20)' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F4811F' }} />
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#F4811F' }}>Citizen Portal</span>
            </div>
            {step === 'phone' ? (
              <>
                <h2 className="text-[26px] font-bold text-[#0E1C2F] leading-tight">Login with<br />Phone Number</h2>
                <p className="text-[13px] text-[#7A8FA6] mt-2">We&apos;ll send a 6-digit OTP to verify your identity</p>
              </>
            ) : (
              <>
                <h2 className="text-[26px] font-bold text-[#0E1C2F] leading-tight">Verify OTP</h2>
                <p className="text-[13px] text-[#7A8FA6] mt-2">
                  Enter the code sent to <span className="font-semibold text-[#0E1C2F]">+91 {phone}</span>
                </p>
                {serverOtp && (
                  <p className="text-[11px] font-medium mt-1" style={{ color: '#F4811F' }}>
                    Demo: your OTP is <span className="font-bold tracking-widest">{serverOtp}</span>
                  </p>
                )}
              </>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(14,28,47,0.09)] p-6 mb-5">
            {step === 'phone' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5 uppercase tracking-wide">Mobile Number</label>
                  <div className="relative flex items-stretch">
                    <div className="flex items-center px-3 rounded-l-xl border border-r-0 border-[#E2E8F0] bg-[#F8FAFC] text-[13px] font-semibold text-[#3D5068]">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); clearError(); }}
                      placeholder="98765 43210"
                      maxLength={10}
                      className={cn(
                        'flex-1 pl-3 pr-10 py-2.5 border rounded-r-xl text-[13px] text-[#0E1C2F] outline-none',
                        'placeholder:text-[#B0BBD0] transition-all duration-150',
                        'border-[#E2E8F0] focus:border-[#F4811F] focus:ring-3 focus:ring-[#F4811F]/10',
                        error && 'border-red-300'
                      )}
                    />
                    <Phone size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0BBD0]" />
                  </div>
                  <p className="text-[10px] text-[#B0BBD0] mt-1.5">Use 9876543210 for demo access</p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                    <p className="text-[12px] text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={sendOTP}
                  disabled={phone.length !== 10 || sending}
                  className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #F4811F, #E0721A)', boxShadow: '0 4px 12px rgba(244,129,31,0.35)' }}
                >
                  {sending ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP...</>
                  ) : (
                    <>Send OTP <ArrowRight size={14} /></>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* OTP Inputs */}
                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-3 uppercase tracking-wide">Enter 6-digit OTP</label>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className={cn(
                          'w-full h-13 text-center text-[20px] font-bold border-2 rounded-xl outline-none transition-all duration-150',
                          'text-[#0E1C2F]',
                          digit
                            ? 'border-[#F4811F] bg-[#FFF8F3]'
                            : 'border-[#E2E8F0] focus:border-[#F4811F] focus:ring-3 focus:ring-[#F4811F]/10 bg-white'
                        )}
                        style={{ aspectRatio: '1', height: 52 }}
                      />
                    ))}
                  </div>
                </div>

                {(verifyError || error) && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                    <p className="text-[12px] text-red-600">{verifyError || error}</p>
                  </div>
                )}

                <button
                  onClick={handleOtpSubmit}
                  disabled={otp.join('').length !== 6 || isLoading}
                  className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #F4811F, #E0721A)', boxShadow: '0 4px 12px rgba(244,129,31,0.35)' }}
                >
                  {isLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</>
                  ) : (
                    <><ShieldCheck size={14} />Verify & Login</>
                  )}
                </button>

                <div className="flex items-center justify-between">
                  {timer > 0 ? (
                    <p className="text-[11px] text-[#7A8FA6]">
                      Resend in <span className="font-semibold text-[#0E1C2F]">{timer}s</span>
                    </p>
                  ) : (
                    <button onClick={handleResend} className="inline-flex items-center gap-1 text-[11px] font-semibold hover:underline transition-colors" style={{ color: '#F4811F' }}>
                      <RefreshCw size={11} />Resend OTP
                    </button>
                  )}
                  <button
                    onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setVerifyError(''); }}
                    className="text-[11px] text-[#7A8FA6] hover:text-[#0E1C2F] transition-colors"
                  >
                    Change number
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-4 text-[11px]">
            <Link href="/citizen-register" className="font-semibold transition-colors hover:underline" style={{ color: '#F4811F' }}>
              New user? Register here
            </Link>
            <span className="text-[#DDE3EE]">·</span>
            <Link href="/login" className="text-[#7A8FA6] hover:text-[#0E1C2F] font-medium transition-colors">
              Officer Login
            </Link>
          </div>

          <p className="text-center text-[10px] text-[#B0BBD0] mt-5">
            Gujarat Government &middot; Grievance Management System v3.0
          </p>
        </div>
      </div>
    </div>
  );
}
