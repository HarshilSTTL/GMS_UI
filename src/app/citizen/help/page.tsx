'use client';
import { useState, useEffect } from 'react';
import { HelpCircle, Phone, MessageSquare, Bot, Mail, ChevronDown, ChevronUp, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
  id: string; question: string; answer: string; category: string;
}

const ESCALATION_LEVELS = [
  { level: 'Level 1', name: 'Medical Officer / Clerk', time: '0–48 hrs', desc: 'First point of contact for all grievances' },
  { level: 'Level 2', name: 'Nodal Officer / THO', time: 'After SLA breach', desc: 'Supervisory oversight and routing' },
  { level: 'Level 3', name: 'Chief District Health Officer', time: '+24 hrs', desc: 'District-level administrative control' },
  { level: 'Level 4', name: 'Director Health Services', time: '+24 hrs', desc: 'State-level authority' },
  { level: 'Level 5', name: 'Principal Secretary HFWD', time: 'Apex', desc: 'Final escalation authority' },
];

const TIMELINE_STEPS = [
  { label: 'OPEN / Filed', desc: 'Citizen submits via portal, mobile, WhatsApp, helpline. Token issued, SMS sent.', color: '#D97706' },
  { label: 'AUTO_ROUTED', desc: 'AI maps SOP code to right administrative unit. Officer notified.', color: '#7C3AED' },
  { label: 'IN_PROGRESS', desc: 'Assigned officer investigates: site visit, records check, staff inquiry.', color: '#1A56C4' },
  { label: 'ACTION_TAKEN', desc: 'Resolution implemented. Evidence uploaded by officer.', color: '#0891B2' },
  { label: 'RESOLVED', desc: 'Citizen notified. Pending citizen feedback.', color: '#16A34A' },
  { label: 'FEEDBACK', desc: 'Citizen rates 1-5 stars. Satisfied → CLOSED. Not satisfied → can REOPEN.', color: '#F4811F' },
  { label: 'CLOSED', desc: 'Case archived. Data feeds AI cluster engine.', color: '#6B7280' },
];

const CONTACT_CHANNELS = [
  { icon: Phone, label: 'CM Helpline', value: '1100', desc: 'Toll-free 24/7', color: '#F4811F' },
  { icon: MessageSquare, label: 'WhatsApp', value: '+91 70 4070 1100', desc: 'Reply HI to start', color: '#25D366' },
  { icon: Bot, label: 'AI Chatbot', value: 'Chat now', desc: 'Instant, multi-lingual', color: '#7C3AED' },
  { icon: Mail, label: 'Email', value: 'help@swagat.gj.in', desc: 'Reply within 4 hrs', color: '#0891B2' },
];

const USER_GUIDES = [
  { title: 'Registration Guide', icon: 'User', type: 'PDF' },
  { title: 'Grievance Submission Guide', icon: 'ClipboardList', type: 'PDF' },
  { title: 'Status Meaning Guide', icon: 'MapPin', type: 'PDF' },
  { title: 'FAQ Document', icon: 'Info', type: 'PDF' },
  { title: 'Privacy Policy', icon: 'Shield', type: 'PDF' },
  { title: 'SOP Code Reference', icon: 'FileText', type: 'PDF' },
];

export default function HelpPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/citizen/faq').then(r => r.json()).then(d => { setFaqs(d); setLoading(false); });
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[16px] font-bold text-[#0E1C2F]">Need Assistance?</h1>
        <p className="text-[11px] text-[#7A8FA6]">Find help, guides, and contact information</p>
      </div>

      {/* Contact Channels */}
      <div className="rounded-[14px] p-5" style={{ background: 'linear-gradient(135deg, #0F1A2E, #1A3260)' }}>
        <h2 className="text-[14px] font-bold text-white mb-3">Contact Us</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CONTACT_CHANNELS.map(ch => (
            <div key={ch.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
              <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: ch.color + '30' }}>
                <ch.icon size={18} style={{ color: ch.color }} />
              </div>
              <p className="text-[11px] font-bold text-white">{ch.label}</p>
              <p className="text-[10px] text-white/60">{ch.value}</p>
              <p className="text-[9px] text-white/40 mt-0.5">{ch.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Tutorials placeholder */}
      <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
        <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-3">Video Tutorials</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: 'Registration', time: '2:14', icon: 'User' },
            { title: 'Login', time: '1:45', icon: 'Key' },
            { title: 'Submit Grievance', time: '3:22', icon: 'Edit' },
            { title: 'Track Grievance', time: '2:08', icon: 'MapPin' },
          ].map(v => (
            <div key={v.title} className="bg-[#F0F2F7] rounded-xl p-3 text-center cursor-pointer hover:bg-[#DDE3EE] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#0E1C2F] flex items-center justify-center mx-auto mb-2">
                <span className="text-white/60 text-[11px]">▶</span>
              </div>
              <p className="text-[11px] font-semibold text-[#0E1C2F]">{v.title}</p>
              <p className="text-[9px] text-[#7A8FA6]">{v.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* FAQ */}
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-3">Frequently Asked Questions</h2>
          {loading ? (
            <div className="flex items-center justify-center h-32"><div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /></div>
          ) : (
            <div className="space-y-2">
              {faqs.map(f => (
                <div key={f.id} className="border border-[#F0F2F7] rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)} className="w-full flex items-center justify-between p-3 text-left bg-white hover:bg-[#F8F9FB] transition-colors">
                    <span className="text-[12px] font-semibold text-[#0E1C2F] flex-1 pr-2">{f.question}</span>
                    {openFaq === f.id ? <ChevronUp size={14} className="text-[#7A8FA6] flex-shrink-0" /> : <ChevronDown size={14} className="text-[#7A8FA6] flex-shrink-0" />}
                  </button>
                  {openFaq === f.id && (
                    <div className="px-3 pb-3 pt-0">
                      <p className="text-[11px] text-[#3D5068] leading-relaxed">{f.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Guides */}
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-3">User Guides & Documents</h2>
          <div className="space-y-1.5">
            {USER_GUIDES.map(g => (
              <div key={g.title} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F0F2F7] transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-[#F0F2F7] flex items-center justify-center">
                  <span className="text-[12px]">{g.icon === 'User' ? '👤' : g.icon === 'ClipboardList' ? '📋' : g.icon === 'MapPin' ? '📍' : g.icon === 'Info' ? '❓' : g.icon === 'Shield' ? '🔒' : '📄'}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-semibold text-[#0E1C2F]">{g.title}</p>
                  <span className="text-[9px] font-bold text-[#7A8FA6] uppercase">{g.type}</span>
                </div>
                <ArrowRight size={14} className="text-[#7A8FA6]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Lifecycle */}
      <div className="rounded-[14px] p-5" style={{ background: 'linear-gradient(135deg, #EDE9FE, #FFF3E8)' }}>
        <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-4">Grievance Lifecycle</h2>
        <div className="space-y-0">
          {TIMELINE_STEPS.map((step, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold" style={{ background: step.color }}>
                  {idx + 1}
                </div>
                {idx < TIMELINE_STEPS.length - 1 && <div className="w-0.5 h-6 bg-gray-300" />}
              </div>
              <div className="pb-4">
                <p className="text-[12px] font-bold text-[#0E1C2F]">{step.label}</p>
                <p className="text-[10px] text-[#7A8FA6] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Levels */}
      <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
        <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-4">Escalation Levels</h2>
        <div className="space-y-2">
          {ESCALATION_LEVELS.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#F0F2F7] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F4811F] text-white text-[11px] font-bold flex items-center justify-center">{idx + 1}</div>
                <div>
                  <p className="text-[12px] font-bold text-[#0E1C2F]">{item.name}</p>
                  <p className="text-[9px] text-[#7A8FA6]">{item.level} &middot; {item.desc}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-[#7A8FA6]">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-[14px] p-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #FFF3E8, #FED7AA)' }}>
        <div>
          <p className="text-[14px] font-bold text-[#0E1C2F]">Still need help?</p>
          <p className="text-[11px] text-[#3D5068] mt-0.5">File a new grievance or track an existing one</p>
        </div>
        <div className="flex gap-2">
          <Link href="/citizen/submit" className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-[#F4811F] text-white">Submit Grievance</Link>
          <Link href="/citizen/track" className="px-4 py-2 rounded-lg text-[12px] font-semibold border border-[#F4811F] text-[#F4811F] bg-white">Track Status</Link>
        </div>
      </div>
    </div>
  );
}
