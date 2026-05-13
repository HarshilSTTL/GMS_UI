'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, AlertCircle, User, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';
import { getDefaultPath } from '@/data';
import { DEMO_ACCOUNTS } from '@/data/mock-users';

type LoginMode = 'officer' | 'citizen';

const OFFICER_DEMOS = DEMO_ACCOUNTS.filter(a => a.label !== 'Citizen Portal');
const CITIZEN_DEMO  = DEMO_ACCOUNTS.find(a => a.label === 'Citizen Portal');

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, user, clearError } = useAuthStore();
  const [mode, setMode] = useState<LoginMode>('officer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getDefaultPath(user.role));
    }
  }, [isAuthenticated, user, router]);

  // Redirect to citizen-login when citizen mode is selected
  useEffect(() => {
    if (mode === 'citizen') {
      router.push('/citizen-login');
    }
  }, [mode, router]);

  useEffect(() => {
    clearError();
    setEmail('');
    setPassword('');
    setShowPass(false);
  }, [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    const ok = await login({ email, password });
    if (ok && user) {
      router.replace(getDefaultPath(user.role));
    }
  }

  function fillDemo(acc: typeof DEMO_ACCOUNTS[0]) {
    clearError();
    setEmail(acc.email);
    setPassword(acc.password);
  }

  return (
    <div className="min-h-screen bg-[#F0F2F7] flex items-center justify-center p-4">
      <div className="w-full max-w-[460px]">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-blue-600/25">
            🏛
          </div>
          <h1 className="text-[22px] font-bold text-[#0E1C2F] tracking-tight">Gujarat GMS</h1>
          <p className="text-[13px] text-[#7A8FA6] mt-1">Grievance Management System</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 bg-white border border-[#DDE3EE] rounded-xl p-1 mb-4 shadow-sm">
          <button
            onClick={() => setMode('officer')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-all',
              mode === 'officer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#7A8FA6] hover:text-[#3D5068]'
            )}
          >
            <Building2 size={15} />
            Government Officer
          </button>
          <button
            onClick={() => setMode('citizen')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-all',
              mode === 'citizen'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-[#7A8FA6] hover:text-[#3D5068]'
            )}
          >
            <User size={15} />
            Citizen
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(14,28,47,0.10)] p-8">

          {mode === 'officer' ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 size={14} className="text-blue-600" />
                </div>
                <h2 className="text-[16px] font-bold text-[#0E1C2F]">Officer Sign In</h2>
              </div>
              <p className="text-[12px] text-[#7A8FA6] mb-6">Enter your government credentials to continue</p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center">
                  <User size={14} className="text-teal-600" />
                </div>
                <h2 className="text-[16px] font-bold text-[#0E1C2F]">Citizen Sign In</h2>
              </div>
              <p className="text-[12px] text-[#7A8FA6] mb-6">Access your grievance portal to file and track complaints</p>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">
                {mode === 'citizen' ? 'Email / Mobile Number' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearError(); }}
                  required
                  placeholder={mode === 'citizen' ? 'citizen@gmail.com' : 'officer@gujarat.gov.in'}
                  className={cn(
                    'w-full pl-9 pr-3 py-2.5 border rounded-lg text-[13px] text-[#0E1C2F] outline-none',
                    'placeholder:text-[#7A8FA6] transition-colors duration-150',
                    'border-[#DDE3EE] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10',
                    error && 'border-red-300'
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearError(); }}
                  required
                  placeholder="••••••••"
                  className={cn(
                    'w-full pl-9 pr-10 py-2.5 border rounded-lg text-[13px] text-[#0E1C2F] outline-none',
                    'placeholder:text-[#7A8FA6] transition-colors duration-150',
                    'border-[#DDE3EE] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10',
                    error && 'border-red-300'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] hover:text-[#3D5068] transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-[12px] text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-2.5 rounded-lg text-[13px] font-semibold text-white mt-2',
                'transition-colors duration-150 shadow-sm',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2',
                mode === 'citizen'
                  ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/25'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25'
              )}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : `Sign in as ${mode === 'citizen' ? 'Citizen' : 'Officer'}`}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-5">
          <p className="text-center text-[11px] text-[#7A8FA6] mb-3 font-medium">Quick demo access</p>

          {mode === 'officer' ? (
            <div className="grid grid-cols-2 gap-2">
              {OFFICER_DEMOS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 text-left hover:shadow-sm transition-shadow border border-[#DDE3EE] hover:border-blue-200"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: acc.color }}
                  >
                    {acc.label.charAt(0)}
                  </div>
                  <span className="text-[11px] font-semibold text-[#3D5068] leading-tight">{acc.label}</span>
                </button>
              ))}
            </div>
          ) : (
            CITIZEN_DEMO && (
              <button
                onClick={() => fillDemo(CITIZEN_DEMO)}
                className="w-full flex items-center gap-3 bg-white rounded-xl px-4 py-3 text-left hover:shadow-sm transition-shadow border border-[#DDE3EE] hover:border-teal-200"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                  style={{ backgroundColor: CITIZEN_DEMO.color }}
                >
                  C
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#3D5068]">{CITIZEN_DEMO.label}</p>
                  <p className="text-[10px] text-[#7A8FA6]">{CITIZEN_DEMO.email} · citizen123</p>
                </div>
              </button>
            )
          )}
        </div>

        <p className="text-center text-[11px] text-[#7A8FA6] mt-6">
          Gujarat Government · Grievance Management System v3.0
        </p>
      </div>
    </div>
  );
}
