'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Shield, Users, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';
import { getDefaultPath } from '@/data';
import { DEMO_ACCOUNTS } from '@/data/mock-users';

const OFFICER_DEMOS = DEMO_ACCOUNTS.filter(a => a.label !== 'Citizen Portal');

const ROLE_META: Record<string, { icon: string; desc: string }> = {
  'Nodal Officer':    { icon: '👮', desc: 'Manage & assign grievances' },
  'Clerk / Task':     { icon: '📋', desc: 'Process & resolve tasks' },
  'Admin Console':    { icon: '⚙️', desc: 'System administration' },
  'CM Dashboard':     { icon: '🏛', desc: 'Intelligence overview' },
  'Health Secretary': { icon: '🏥', desc: 'Health dept command view' },
};

const FEATURES = [
  { icon: Shield, text: 'Secure role-based access' },
  { icon: Users, text: 'Multi-department coordination' },
  { icon: BarChart3, text: 'Real-time analytics & SLA tracking' },
  { icon: CheckCircle2, text: 'AI-powered grievance resolution' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, user, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) router.replace(getDefaultPath(user.role));
  }, [isAuthenticated, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    const ok = await login({ email, password });
    if (ok && user) router.replace(getDefaultPath(user.role));
  }

  function fillDemo(acc: typeof DEMO_ACCOUNTS[0]) {
    clearError();
    setEmail(acc.email);
    setPassword(acc.password);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0F1A2E 0%, #1A3260 60%, #0D2550 100%)' }}
      >
        {/* Background decorative circles */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #F4811F, transparent)' }} />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #F4811F, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #F4811F, #E0721A)' }}>
              🏛
            </div>
            <div>
              <div className="text-white text-[16px] font-bold tracking-tight leading-none">Gujarat GMS</div>
              <div className="text-blue-300 text-[11px] font-medium mt-0.5">Grievance Management System</div>
            </div>
          </div>

          <h1 className="text-[32px] font-bold text-white leading-tight mb-3">
            Empower Citizens.<br />
            <span style={{ color: '#F4811F' }}>Resolve Faster.</span>
          </h1>
          <p className="text-[14px] text-blue-200 leading-relaxed max-w-[340px]">
            A unified platform for government officers to manage grievances, track SLAs, and deliver transparent public service.
          </p>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 grid grid-cols-3 gap-4 my-8">
          {[
            { value: '2.4L+', label: 'Grievances Handled' },
            { value: '94%', label: 'Resolution Rate' },
            { value: '33', label: 'Districts Covered' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <div className="text-[22px] font-bold mb-0.5" style={{ color: '#F4811F' }}>{s.value}</div>
              <div className="text-[10px] text-blue-300 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-3">
          {FEATURES.map(f => (
            <div key={f.text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(244,129,31,0.15)' }}>
                <f.icon size={14} style={{ color: '#F4811F' }} />
              </div>
              <span className="text-[12px] text-blue-200">{f.text}</span>
            </div>
          ))}
          <div className="mt-6 pt-6 border-t border-white/10 text-[11px] text-blue-400">
            Government of Gujarat &middot; Digital Gujarat Initiative &middot; v3.0
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F4F6FA]">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #F4811F, #E0721A)' }}>🏛</div>
            <div>
              <div className="text-[15px] font-bold text-[#0E1C2F]">Gujarat GMS</div>
              <div className="text-[10px] text-[#7A8FA6]">Grievance Management System</div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">Officer Portal</span>
            </div>
            <h2 className="text-[26px] font-bold text-[#0E1C2F] leading-tight">Welcome back</h2>
            <p className="text-[13px] text-[#7A8FA6] mt-1">Sign in with your government credentials to continue</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(14,28,47,0.09)] p-6 mb-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); clearError(); }}
                    required
                    placeholder="officer@gujarat.gov.in"
                    className={cn(
                      'w-full pl-9 pr-3 py-2.5 border rounded-xl text-[13px] text-[#0E1C2F] outline-none',
                      'placeholder:text-[#B0BBD0] transition-all duration-150',
                      'border-[#E2E8F0] focus:border-[#1A56C4] focus:ring-3 focus:ring-[#1A56C4]/10',
                      error && 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3D5068] mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); clearError(); }}
                    required
                    placeholder="••••••••"
                    className={cn(
                      'w-full pl-9 pr-10 py-2.5 border rounded-xl text-[13px] text-[#0E1C2F] outline-none',
                      'placeholder:text-[#B0BBD0] transition-all duration-150',
                      'border-[#E2E8F0] focus:border-[#1A56C4] focus:ring-3 focus:ring-[#1A56C4]/10',
                      error && 'border-red-300 focus:border-red-400 focus:ring-red-100'
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

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                  <p className="text-[12px] text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-[13px] font-semibold text-white mt-1 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                style={{ background: isLoading ? '#1A3260' : 'linear-gradient(135deg, #1A56C4, #1A3260)', boxShadow: '0 4px 12px rgba(26,86,196,0.3)' }}
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                ) : (
                  <>Sign in <ArrowRight size={14} /></>
                )}
              </button>
            </form>
          </div>

          {/* Demo Accounts */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-[10px] font-semibold text-[#B0BBD0] uppercase tracking-wider">Quick Demo Access</span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {OFFICER_DEMOS.map(acc => {
                const meta = ROLE_META[acc.label] || { icon: '👤', desc: '' };
                return (
                  <button
                    key={acc.email}
                    onClick={() => fillDemo(acc)}
                    className="group flex items-center gap-3 bg-white rounded-xl px-3.5 py-3 text-left border border-[#E2E8F0] hover:border-transparent hover:shadow-lg transition-all duration-200 cursor-pointer"
                    style={{ '--hover-shadow': `0 4px 16px ${acc.color}25` } as React.CSSProperties}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${acc.color}30`; (e.currentTarget as HTMLElement).style.borderColor = `${acc.color}40`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-[16px] flex-shrink-0 shadow-sm"
                      style={{ background: `${acc.color}18`, border: `1px solid ${acc.color}30` }}
                    >
                      {meta.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#0E1C2F] leading-none mb-0.5" style={{ color: acc.color }}>{acc.label}</p>
                      <p className="text-[9.5px] text-[#7A8FA6] leading-tight truncate">{meta.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[11px]">
            <Link href="/citizen-login" className="text-[#7A8FA6] hover:text-[#0E1C2F] font-medium transition-colors">
              Citizen? Login here
            </Link>
            <span className="text-[#DDE3EE]">·</span>
            <span className="text-[#B0BBD0]">Gujarat Government</span>
          </div>
        </div>
      </div>
    </div>
  );
}
