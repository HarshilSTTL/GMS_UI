'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores';
import { getDefaultPath } from '@/data';
import { Shield, Users, FileText, MapPin, BarChart2, Clock, ChevronRight, Phone, Building2, CheckCircle } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getDefaultPath(user.role));
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F7]">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0F1A2E] rounded-xl flex items-center justify-center text-lg shadow-sm">🏛</div>
            <div>
              <h1 className="text-[14px] font-bold text-[#0E1C2F] leading-tight">Gujarat GMS</h1>
              <p className="text-[9px] text-[#7A8FA6] leading-tight">Grievance Management System</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[12px] font-semibold text-[#3D5068] hover:text-[#0E1C2F] px-3 py-1.5 rounded-lg hover:bg-[#F0F2F7] transition-colors">
              Officer Login
            </Link>
            <Link href="/citizen-login" className="text-[12px] font-semibold text-white bg-[#0F1A2E] hover:bg-[#1A3260] px-4 py-1.5 rounded-lg transition-colors">
              Citizen Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0F1A2E 0%, #1A3260 50%, #0F1A2E 100%)' }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #F4811F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1A56C4 0%, transparent 50%)' }} />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] text-blue-200 font-medium">Swagat 3.0 — Now Live</span>
              </div>
              <h1 className="text-[32px] md:text-[40px] font-bold text-white leading-tight mb-4">
                Your Voice.<br />
                <span style={{ color: '#F4811F' }}>Government&apos;s Action.</span>
              </h1>
              <p className="text-[14px] text-blue-200 leading-relaxed mb-8 max-w-md">
                The Gujarat Grievance Management System empowers citizens to file, track, and resolve complaints with complete transparency. AI-powered, SLA-driven, and built for accountability.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/citizen-login" className="inline-flex items-center gap-2 bg-[#F4811F] hover:bg-[#E0721A] text-white rounded-lg px-6 py-3 text-[13px] font-semibold transition-colors shadow-lg shadow-orange-500/25">
                  <Phone size={16} /> Citizen Login
                </Link>
                <Link href="/citizen-register" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-6 py-3 text-[13px] font-semibold transition-colors border border-white/20">
                  Register as Citizen
                </Link>
                <Link href="/login" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-blue-200 rounded-lg px-6 py-3 text-[13px] font-semibold transition-colors border border-white/10">
                  <Building2 size={16} /> Officer Portal
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-[13px] font-bold text-white mb-4">Platform Highlights</h3>
                {[
                  { icon: Clock, text: 'SLA-driven resolution tracking', color: '#F4811F' },
                  { icon: Shield, text: 'Multi-level escalation matrix', color: '#1A56C4' },
                  { icon: BarChart2, text: 'AI-powered cluster detection', color: '#7C3AED' },
                  { icon: MapPin, text: 'District-level accountability', color: '#16A34A' },
                  { icon: Users, text: 'CM Office direct oversight', color: '#C9A84C' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: item.color + '20' }}>
                      <item.icon size={16} style={{ color: item.color }} />
                    </div>
                    <span className="text-[12px] text-blue-100 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '12,400+', label: 'Grievances Resolved', icon: FileText },
              { value: '33', label: 'Districts Covered', icon: MapPin },
              { value: '94.2%', label: 'Resolution Rate', icon: CheckCircle },
              { value: '< 48hrs', label: 'Avg Response Time', icon: Clock },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <s.icon size={14} className="text-[#F4811F]" />
                  <span className="text-[20px] font-bold text-[#0E1C2F]">{s.value}</span>
                </div>
                <span className="text-[11px] text-[#7A8FA6]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-[22px] font-bold text-[#0E1C2F] mb-2">How It Works</h2>
            <p className="text-[13px] text-[#7A8FA6]">Simple 3-step grievance resolution process</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'File Your Grievance', desc: 'Select a category, describe your issue with location details and supporting documents.', color: '#F4811F' },
              { step: '02', title: 'Track & Monitor', desc: 'Get a unique token number. Track real-time status, SLA progress, and officer assignment.', color: '#1A56C4' },
              { step: '03', title: 'Get Resolution', desc: 'Receive timely resolution with feedback. Escalate if needed. CM Office oversight for critical cases.', color: '#16A34A' },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-[14px] p-6 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)] hover:shadow-lg transition-shadow">
                <div className="text-[32px] font-bold mb-3" style={{ color: item.color, opacity: 0.3 }}>{item.step}</div>
                <h3 className="text-[15px] font-bold text-[#0E1C2F] mb-2">{item.title}</h3>
                <p className="text-[12px] text-[#7A8FA6] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F1A2E] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-sm">🏛</div>
            <span className="text-[12px] text-blue-200 font-medium">Gujarat Grievance Management System v3.0</span>
          </div>
          <p className="text-[11px] text-blue-300/60">Government of Gujarat · All Rights Reserved</p>
          <div className="flex items-center gap-4">
            <Link href="/citizen-login" className="text-[11px] text-blue-300 hover:text-white transition-colors">Citizen Login</Link>
            <Link href="/login" className="text-[11px] text-blue-300 hover:text-white transition-colors">Officer Login</Link>
            <Link href="/citizen-help" className="text-[11px] text-blue-300 hover:text-white transition-colors">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
