'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, ShieldCheck, ArrowLeft, RefreshCw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';
import { getDefaultPath } from '@/data';
import { storeOTP } from '@/data/mock-users';

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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  async function sendOTP() {
    if (phone.length !== 10) return;
    setSending(true);
    clearError();
    setVerifyError('');
    try {
      const res = await fetch('/api/citizen/otp', {
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
    if (!ok) {
      setVerifyError('Invalid OTP. Please try again.');
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setVerifyError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleResend() {
    setOtp(['', '', '', '', '', '']);
    setVerifyError('');
    sendOTP();
  }

  return (
    <div className="min-h-screen bg-[#F0F2F7] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#0F1A2E] rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-[#0F1A2E]/25">
            🏛
          </div>
          <h1 className="text-[22px] font-bold text-[#0E1C2F] tracking-tight">Swagat Citizen Portal</h1>
          <p className="text-[13px] text-[#7A8FA6] mt-1">Gujarat Grievance Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(14,28,47,0.10)] p-8">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-1 text-[11px] text-[#7A8FA6] hover:text-[#0E1C2F] mb-5 transition-colors">
            <ArrowLeft size={12} /> Back to Home
          </Link>

          {step === 'phone' ? (
            <>
              <h2 className="text-[16px] font-bold text-[#0E1C2F] mb-1">Login with Phone</h2>
              <p className="text-[12px] text-[#7A8FA6] mb-6">We&apos;ll send a 6-digit OTP to verify your number</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#7A8FA6] font-medium">+91</div>
                    <Phone size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); clearError(); }}
                      placeholder="98765 43210"
                      maxLength={10}
                      className={cn(
                        'w-full pl-11 pr-9 py-2.5 border rounded-lg text-[13px] text-[#0E1C2F] outline-none',
                        'placeholder:text-[#7A8FA6] transition-colors duration-150',
                        'border-[#DDE3EE] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10',
                        error && 'border-red-300'
                      )}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                    <p className="text-[12px] text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={sendOTP}
                  disabled={phone.length !== 10 || sending}
                  className={cn(
                    'w-full py-2.5 rounded-lg text-[13px] font-semibold text-white',
                    'bg-[#0F1A2E] hover:bg-[#1A3260] transition-colors duration-150',
                    'shadow-sm shadow-[#0F1A2E]/25 mt-2',
                    'disabled:opacity-60 disabled:cursor-not-allowed',
                    'flex items-center justify-center gap-2'
                  )}
                >
                  {sending ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending OTP...</>
                  ) : (
                    <>Send OTP <ArrowRight size={14} /></>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-[16px] font-bold text-[#0E1C2F] mb-1">Verify OTP</h2>
              <p className="text-[12px] text-[#7A8FA6] mb-1">
                OTP sent to <span className="font-semibold text-[#0E1C2F]">+91 {phone}</span>
              </p>
              <p className="text-[11px] text-[#F4811F] font-medium mb-6">
                Demo: OTP is {serverOtp} (or use 999999)
              </p>

              <div className="space-y-4">
                {/* OTP Inputs */}
                <div className="flex justify-center gap-2">
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
                        'w-11 h-12 text-center text-[18px] font-bold border rounded-lg outline-none transition-colors',
                        'border-[#DDE3EE] focus:border-[#F4811F] focus:ring-2 focus:ring-[#F4811F]/10',
                        'text-[#0E1C2F]'
                      )}
                    />
                  ))}
                </div>

                {verifyError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                    <p className="text-[12px] text-red-600">{verifyError}</p>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                    <p className="text-[12px] text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleOtpSubmit}
                  disabled={otp.join('').length !== 6 || isLoading}
                  className={cn(
                    'w-full py-2.5 rounded-lg text-[13px] font-semibold text-white',
                    'bg-[#0F1A2E] hover:bg-[#1A3260] transition-colors duration-150',
                    'shadow-sm shadow-[#0F1A2E]/25 mt-2',
                    'disabled:opacity-60 disabled:cursor-not-allowed',
                    'flex items-center justify-center gap-2'
                  )}
                >
                  {isLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
                  ) : (
                    <><ShieldCheck size={14} /> Verify & Login</>
                  )}
                </button>

                {/* Resend */}
                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-[11px] text-[#7A8FA6]">
                      Resend OTP in <span className="font-semibold text-[#0E1C2F]">{timer}s</span>
                    </p>
                  ) : (
                    <button onClick={handleResend} className="inline-flex items-center gap-1 text-[11px] text-[#F4811F] font-semibold hover:underline">
                      <RefreshCw size={11} /> Resend OTP
                    </button>
                  )}
                </div>

                <button onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setVerifyError(''); }} className="w-full text-[11px] text-[#7A8FA6] hover:text-[#0E1C2F] transition-colors">
                  Change phone number
                </button>
              </div>
            </>
          )}
        </div>

        {/* Links */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link href="/citizen-register" className="text-[12px] text-[#7A8FA6] hover:text-[#0E1C2F] font-medium transition-colors">
            New User? Register here
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
