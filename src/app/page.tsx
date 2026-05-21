'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores';
import { getDefaultPath } from '@/data';
import {
  Shield, Users, FileText, MapPin, BarChart2, Clock, ChevronRight, Phone, Building2, CheckCircle,
  Search, Zap, ArrowRight, Mail, Globe, Lock, Activity, Star, Smartphone, MessageCircle, Sparkles
} from 'lucide-react';

const services = [
  { icon: FileText, title: 'File Grievance', desc: 'Submit complaints online with documents, photos, and location details. Track every step.', badge: 'Citizen', badgeColor: '#F4811F' },
  { icon: Search, title: 'Track Status', desc: 'Real-time tracking with unique token. SLA timers, officer details, and resolution timeline.', badge: 'Citizen', badgeColor: '#F4811F' },
  { icon: Zap, title: 'AI Detection', desc: 'Automatic cluster detection identifies recurring issues and patterns across districts.', badge: 'System', badgeColor: '#7C3AED' },
  { icon: Clock, title: 'SLA Enforcement', desc: 'Strict resolution timelines with auto-escalation when deadlines are missed.', badge: 'System', badgeColor: '#7C3AED' },
  { icon: Activity, title: 'Escalation Matrix', desc: 'Multi-level escalation from clerk to CM Office ensures no grievance is ignored.', badge: 'Officer', badgeColor: '#1A56C4' },
  { icon: BarChart2, title: 'District Dashboard', desc: 'Performance analytics, resolution rates, and trend reports for every district.', badge: 'Officer', badgeColor: '#1A56C4' },
];

const departments = [
  'Revenue', 'Urban Development', 'Health & Family Welfare', 'Education', 'Home (Police)',
  'Roads & Buildings', 'Water Supply', 'Agriculture', 'Energy & Petrochemicals', 'Social Justice',
  'Panchayat & Rural', 'Forest & Environment', 'Labour & Employment', 'Transport', 'Women & Child',
  'Food & Civil Supplies', 'Industries & Mines', 'Information Technology',
];

const deptColors = ['#F4811F', '#1A56C4', '#16A34A', '#7C3AED', '#C9A84C', '#EC4899'];

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [trackToken, setTrackToken] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getDefaultPath(user.role));
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F7] scroll-smooth">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0F1A2E] rounded-xl flex items-center justify-center text-lg shadow-sm">🏛</div>
            <div>
              <h1 className="text-[14px] font-bold text-[#0E1C2F] leading-tight">Gujarat GMS</h1>
              <p className="text-[9px] text-[#7A8FA6] leading-tight">Grievance Management System</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-[12px] font-medium text-[#0E1C2F]">Home</a>
            <a href="#about" className="text-[12px] font-medium text-[#7A8FA6] hover:text-[#0E1C2F] transition-colors">About</a>
            <a href="#services" className="text-[12px] font-medium text-[#7A8FA6] hover:text-[#0E1C2F] transition-colors">Services</a>
            <a href="#track" className="text-[12px] font-medium text-[#7A8FA6] hover:text-[#0E1C2F] transition-colors">Track Complaint</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-[12px] font-semibold text-[#3D5068] hover:text-[#0E1C2F] px-3 py-1.5 rounded-lg hover:bg-[#F0F2F7] transition-colors">
              Officer Login
            </Link>
            <Link href="/citizen-register" className="hidden sm:inline-flex text-[12px] font-semibold text-[#F4811F] border border-[#F4811F] px-3 py-1.5 rounded-lg hover:bg-[#FFF5EE] transition-colors">
              Register
            </Link>
            <Link href="/citizen-login" className="text-[12px] font-semibold text-white bg-[#F4811F] hover:bg-[#E0721A] px-4 py-1.5 rounded-lg transition-colors">
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
              <div className="flex flex-wrap gap-3 mb-8">
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
              {/* Secondary Actions */}
              <div className="flex flex-wrap gap-3">
                <a href="/Swagat 3.0 Mobile - Merged (2).html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 rounded-lg px-5 py-2.5 text-[12px] font-semibold transition-colors border border-blue-400/30">
                  <Smartphone size={15} /> Mobile App
                </a>
                <a href="/CitizenVoice_WhatsApp_v1.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-200 rounded-lg px-5 py-2.5 text-[12px] font-semibold transition-colors border border-green-400/30">
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <Link href="/citizen-login" className="inline-flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 rounded-lg px-5 py-2.5 text-[12px] font-semibold transition-colors border border-purple-400/30">
                  <Sparkles size={15} /> AI Assistance
                </Link>
              </div>
              {/* Track Complaint Mini-Form */}
              <div id="track" className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-xl p-1.5 max-w-md border border-white/10">
                <Search size={16} className="text-blue-300 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter complaint token (e.g. GMS-2024-00123)"
                  value={trackToken}
                  onChange={e => setTrackToken(e.target.value)}
                  className="flex-1 bg-transparent text-[12px] text-white placeholder-blue-300/50 outline-none py-2 px-2"
                />
                <button
                  onClick={() => { if (trackToken.trim()) router.push(`/citizen-login`); }}
                  className="bg-[#F4811F] hover:bg-[#E0721A] text-white text-[12px] font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
                >
                  Track
                </button>
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

      {/* Services/Features Grid */}
      <section id="services" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-[22px] font-bold text-[#0E1C2F] mb-2">Services & Features</h2>
            <p className="text-[13px] text-[#7A8FA6]">Everything you need for transparent grievance resolution</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map(s => (
              <div key={s.title} className="bg-white rounded-[14px] p-6 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)] hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.badgeColor + '15' }}>
                    <s.icon size={20} style={{ color: s.badgeColor }} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: s.badgeColor, background: s.badgeColor + '12' }}>
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-[15px] font-bold text-[#0E1C2F] mb-2">{s.title}</h3>
                <p className="text-[12px] text-[#7A8FA6] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className="py-16 bg-white">
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
              <div key={item.step} className="bg-[#F8F9FB] rounded-[14px] p-6 hover:shadow-lg transition-shadow">
                <div className="text-[32px] font-bold mb-3" style={{ color: item.color, opacity: 0.3 }}>{item.step}</div>
                <h3 className="text-[15px] font-bold text-[#0E1C2F] mb-2">{item.title}</h3>
                <p className="text-[12px] text-[#7A8FA6] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-[20px] overflow-hidden grid md:grid-cols-5">
            <div className="md:col-span-3 bg-[#0F1A2E] p-10 flex flex-col justify-center">
              <h2 className="text-[24px] font-bold text-white mb-3">Ready to File Your Grievance?</h2>
              <p className="text-[13px] text-blue-200 mb-6 max-w-sm">
                Join thousands of citizens who have successfully resolved their complaints through our platform.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Link href="/citizen-login" className="inline-flex items-center gap-2 bg-[#F4811F] hover:bg-[#E0721A] text-white rounded-lg px-5 py-2.5 text-[13px] font-semibold transition-colors">
                  File a Grievance <ArrowRight size={14} />
                </Link>
                <Link href="/citizen-login" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-5 py-2.5 text-[13px] font-semibold transition-colors border border-white/20">
                  <Search size={14} /> Track Complaint
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-[11px] text-blue-300">
                <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-400" /> Free of cost</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-400" /> No paperwork</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-400" /> Track in real-time</span>
              </div>
            </div>
            <div className="md:col-span-2 bg-[#F4811F] p-10 flex flex-col justify-center gap-6">
              {[
                { value: '2.3 min', label: 'Average filing time' },
                { value: '97%', label: 'Citizen satisfaction' },
                { value: '24/7', label: 'Platform availability' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-[24px] font-bold text-white">{s.value}</div>
                  <div className="text-[11px] text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Department Coverage */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-[22px] font-bold text-[#0E1C2F] mb-2">18 Departments. One Platform.</h2>
            <p className="text-[13px] text-[#7A8FA6]">File grievances across any government department in Gujarat</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {departments.map((dept, i) => (
              <span key={dept} className="inline-flex items-center gap-2 bg-[#F8F9FB] border border-[#E5E7EB] rounded-full px-4 py-2 text-[12px] text-[#3D5068] font-medium hover:border-[#F4811F] hover:bg-[#FFF5EE] transition-colors cursor-default">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: deptColors[i % deptColors.length] }} />
                {dept}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-[22px] font-bold text-[#0E1C2F] mb-2">Trust & Transparency</h2>
            <p className="text-[13px] text-[#7A8FA6]">Built on the highest standards of governance and data security</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Shield, title: 'Government Backed', desc: 'Official platform of the Government of Gujarat with full administrative support and oversight.', color: '#1A56C4' },
              { icon: Globe, title: 'Full Transparency', desc: 'Every action is logged, every timeline visible. Citizens and officers operate on the same data.', color: '#16A34A' },
              { icon: Lock, title: 'Data Privacy', desc: 'Your personal data is encrypted and protected. Complaint details are shared only with assigned officers.', color: '#7C3AED' },
            ].map(c => (
              <div key={c.title} className="bg-white rounded-[14px] p-6 text-center shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
                <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: c.color + '15' }}>
                  <c.icon size={24} style={{ color: c.color }} />
                </div>
                <h3 className="text-[15px] font-bold text-[#0E1C2F] mb-2">{c.title}</h3>
                <p className="text-[12px] text-[#7A8FA6] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-[#7A8FA6]">
            {['NIC Certified', 'RTI Compliant', 'Swagat 3.0'].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5">
                <Star size={10} className="text-[#F4811F]" /> {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F1A2E] pt-12 pb-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm">🏛</div>
                <div>
                  <div className="text-[13px] font-bold text-white">Gujarat GMS</div>
                  <div className="text-[9px] text-blue-300/60">Grievance Management System</div>
                </div>
              </div>
              <p className="text-[11px] text-blue-300/60 leading-relaxed mb-3">
                Official grievance portal of the Government of Gujarat.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-blue-200">
                <Phone size={12} />
                <span>Helpline: 1800-233-5500</span>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
              <div className="space-y-2">
                {[
                  { label: 'Home', href: '#' },
                  { label: 'About', href: '#about' },
                  { label: 'Services', href: '#services' },
                  { label: 'Track Complaint', href: '#track' },
                ].map(l => (
                  <a key={l.label} href={l.href} className="block text-[11px] text-blue-300/70 hover:text-white transition-colors">{l.label}</a>
                ))}
              </div>
            </div>
            {/* For Citizens / Officers */}
            <div>
              <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-4">Portals</h4>
              <div className="space-y-2">
                <Link href="/citizen-login" className="block text-[11px] text-blue-300/70 hover:text-white transition-colors">Citizen Login</Link>
                <Link href="/citizen-register" className="block text-[11px] text-blue-300/70 hover:text-white transition-colors">Citizen Register</Link>
                <Link href="/login" className="block text-[11px] text-blue-300/70 hover:text-white transition-colors">Officer Login</Link>
                <Link href="/citizen-help" className="block text-[11px] text-blue-300/70 hover:text-white transition-colors">Help Center</Link>
              </div>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-4">Contact</h4>
              <div className="space-y-2 text-[11px] text-blue-300/70">
                <div className="flex items-start gap-2">
                  <Mail size={12} className="mt-0.5 shrink-0" />
                  <span>grievance@gujarat.gov.in</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone size={12} className="mt-0.5 shrink-0" />
                  <span>1800-233-5500 (Toll Free)</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={12} className="mt-0.5 shrink-0" />
                  <span>Gandhinagar, Gujarat 382010</span>
                </div>
              </div>
            </div>
          </div>
          {/* Reference Materials */}
          <div className="border-t border-white/10 pt-6 mb-6">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-4">Reference Materials</h4>
            <div className="flex flex-wrap gap-4">
              <a
                href="/Swagat 3.0 Mobile - Merged (2).html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white text-[11px] font-medium transition-colors border border-white/10"
              >
                Mobile App
              </a>
              <a
                href="/CitizenVoice_WhatsApp_v1.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white text-[11px] font-medium transition-colors border border-white/10"
              >
                WhatsApp
              </a>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[10px] text-blue-300/50">© 2024 Government of Gujarat. All Rights Reserved.</p>
            <span className="text-[10px] text-blue-300/40">v3.0.0</span>
            <div className="flex items-center gap-4 text-[10px] text-blue-300/50">
              <span className="hover:text-blue-200 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-blue-200 cursor-pointer transition-colors">Terms of Use</span>
              <span className="hover:text-blue-200 cursor-pointer transition-colors">Accessibility</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
