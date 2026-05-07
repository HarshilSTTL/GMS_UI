'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';
import { getDefaultPath } from '@/data';
import { DEMO_ACCOUNTS } from '@/data/mock-users';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, user, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getDefaultPath(user.role));
    }
  }, [isAuthenticated, user, router]);

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
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-blue-600/25">
            🏛
          </div>
          <h1 className="text-[22px] font-bold text-[#0E1C2F] tracking-tight">Gujarat GMS</h1>
          <p className="text-[13px] text-[#7A8FA6] mt-1">Grievance Management System</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(14,28,47,0.10)] p-8">
          <h2 className="text-[16px] font-bold text-[#0E1C2F] mb-1">Sign in to your account</h2>
          <p className="text-[12px] text-[#7A8FA6] mb-6">Enter your government credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearError(); }}
                  required
                  placeholder="officer@gujarat.gov.in"
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
                'w-full py-2.5 rounded-lg text-[13px] font-semibold text-white',
                'bg-blue-600 hover:bg-blue-700 transition-colors duration-150',
                'shadow-sm shadow-blue-600/25 mt-2',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2'
              )}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-6">
          <p className="text-center text-[11px] text-[#7A8FA6] mb-3 font-medium">Quick demo access</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(acc => (
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
        </div>

        <p className="text-center text-[11px] text-[#7A8FA6] mt-6">
          Gujarat Government · Grievance Management System v3.0
        </p>
      </div>
    </div>
  );
}
