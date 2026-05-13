'use client';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { toast } from 'sonner';
import {
  ArrowLeft, ArrowRight, CheckCircle, Mic, MicOff, MapPin, Navigation,
  ChevronDown, Send, Bot, X, MessageSquare, FileText, Eye, Printer,
  ClipboardList, Droplet, Route, Zap, Building2, Leaf, Hospital
} from 'lucide-react';

// ── Domain & sub-category data ──────────────────────────────────────────────
const DOMAINS = [
  {
    id: 'HEALTH', code: 'HFW', label: 'Health & Medical', labelGu: 'આરોગ્ય અને તબીબી',
    color: '#DC2626', bg: '#FEE2E2', icon: Hospital,
    subs: [
      { id: 'MCH', label: 'Maternity & Child Health', labelGu: 'માતૃ અને બાળ સ્વાસ્થ્ય', priority: 'high', sla: 3 },
      { id: 'IMM', label: 'Immunization Issues', labelGu: 'રસીકરણ સમસ્યા', priority: 'high', sla: 2 },
      { id: 'HSP', label: 'Hospital Cleanliness', labelGu: 'હોસ્પિટલ સ્વચ્છતા', priority: 'medium', sla: 5 },
      { id: 'PHC', label: 'PHC/Dispensary Issue', labelGu: 'PHC/દવાખાનાની સમસ્યા', priority: 'high', sla: 2 },
      { id: 'AMB', label: 'Ambulance Service', labelGu: 'એમ્બ્યુલન્સ સેવા', priority: 'critical', sla: 1 },
      { id: 'MED', label: 'Medicine Shortage', labelGu: 'દવાઓની અછત', priority: 'critical', sla: 1 },
    ],
  },
  {
    id: 'WATER', code: 'WSS', label: 'Water & Sanitation', labelGu: 'પાણી અને સ્વચ્છતા',
    color: '#0891B2', bg: '#E0F7FA', icon: Droplet,
    subs: [
      { id: 'DRK', label: 'Drinking Water Quality', labelGu: 'પીવાના પાણીની ગુણવત્તા', priority: 'critical', sla: 1 },
      { id: 'SUP', label: 'Water Supply Disruption', labelGu: 'પાણી પુરવઠો બંધ', priority: 'high', sla: 2 },
      { id: 'LEK', label: 'Pipeline Leakage', labelGu: 'પાઇપ લાઇન લીકેજ', priority: 'medium', sla: 5 },
      { id: 'SEW', label: 'Sewage Overflow', labelGu: 'ગટરનો ઓવરફ્લો', priority: 'high', sla: 2 },
      { id: 'BIL', label: 'Billing Dispute', labelGu: 'બિલ વિવાદ', priority: 'low', sla: 10 },
    ],
  },
  {
    id: 'ROADS', code: 'RBD', label: 'Roads & Transport', labelGu: 'રસ્તા અને પરિવહન',
    color: '#D97706', bg: '#FEF3C7', icon: Route,
    subs: [
      { id: 'POT', label: 'Potholes & Road Damage', labelGu: 'ખાડા અને રસ્તા નુકસાન', priority: 'high', sla: 7 },
      { id: 'LGT', label: 'Street Light Not Working', labelGu: 'સ્ટ્રીટ લાઇટ બંધ', priority: 'medium', sla: 5 },
      { id: 'SIG', label: 'Traffic Signal Issue', labelGu: 'ટ્રાફિક સિગ્નલ સમસ્યા', priority: 'high', sla: 3 },
      { id: 'BUS', label: 'Bus / GSRTC Complaint', labelGu: 'બસ / GSRTC ફરિયાદ', priority: 'medium', sla: 7 },
      { id: 'DIV', label: 'Divider / Footpath Issue', labelGu: 'ડિવાઇડર / ફૂટપાથ સમસ્યા', priority: 'low', sla: 14 },
    ],
  },
  {
    id: 'URBAN', code: 'AMC', label: 'Urban Services', labelGu: 'શહેરી સેવાઓ',
    color: '#7C3AED', bg: '#EDE9FE', icon: Building2,
    subs: [
      { id: 'GAR', label: 'Garbage Not Collected', labelGu: 'કચરો ન ઉઠાવ્યો', priority: 'high', sla: 2 },
      { id: 'SAN', label: 'Public Toilet Issue', labelGu: 'જાહેર શૌચાલય સમસ્યા', priority: 'high', sla: 3 },
      { id: 'ENC', label: 'Encroachment', labelGu: 'અતિક્રમણ', priority: 'medium', sla: 14 },
      { id: 'DRN', label: 'Drainage Blocked', labelGu: 'ડ્રેનેજ બ્લોક', priority: 'high', sla: 3 },
      { id: 'PRK', label: 'Park / Garden Issue', labelGu: 'પાર્ક / બગીચો સમસ્યા', priority: 'low', sla: 14 },
      { id: 'BLD', label: 'Illegal Construction', labelGu: 'ગેરકાયદે બાંધકામ', priority: 'medium', sla: 10 },
    ],
  },
  {
    id: 'AGRI', code: 'AGR', label: 'Agriculture', labelGu: 'કૃષિ',
    color: '#16A34A', bg: '#DCFCE7', icon: Leaf,
    subs: [
      { id: 'CRP', label: 'Crop Damage / Insurance', labelGu: 'પાક નુકસાન / વીમો', priority: 'high', sla: 7 },
      { id: 'SUB', label: 'Subsidy Not Received', labelGu: 'સબસિડી ન મળી', priority: 'medium', sla: 14 },
      { id: 'FRT', label: 'Fertilizer / Seed Issue', labelGu: 'ખાતર / બિયારણ સમસ્યા', priority: 'medium', sla: 7 },
      { id: 'IRR', label: 'Irrigation Problem', labelGu: 'સિંચાઈ સમસ્યા', priority: 'high', sla: 5 },
      { id: 'MND', label: 'MNREGA / Labour Issue', labelGu: 'MNREGA / મજૂર સમસ્યા', priority: 'medium', sla: 7 },
    ],
  },
];

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#DC2626', high: '#D97706', medium: '#1A56C4', low: '#16A34A',
};
const PRIORITY_BG: Record<string, string> = {
  critical: '#FEE2E2', high: '#FEF3C7', medium: '#EFF6FF', low: '#DCFCE7',
};

const GUJARAT_DISTRICTS = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
  'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
  'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
  'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
  'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
  'Tapi', 'Vadodara', 'Valsad',
];

const TALUKAS: Record<string, string[]> = {
  Ahmedabad: ['Ahmedabad City', 'Daskroi', 'Dholka', 'Detroj-Rampura', 'Mandal', 'Sanand', 'Viramgam', 'Bavla'],
  Gandhinagar: ['Gandhinagar', 'Dehgam', 'Kalol', 'Mansa'],
  Surat: ['Surat City', 'Olpad', 'Chorasi', 'Kamrej', 'Bardoli', 'Mandvi', 'Palsana', 'Mahuva'],
  Vadodara: ['Vadodara City', 'Dabhoi', 'Karjan', 'Padra', 'Savli', 'Waghodia', 'Sankheda', 'Shinor'],
  Rajkot: ['Rajkot City', 'Gondal', 'Jasdan', 'Jetpur', 'Kotda Sangani', 'Lodhika', 'Paddhari', 'Vinchhiya'],
  Bhavnagar: ['Bhavnagar City', 'Gariadhar', 'Ghogha', 'Jesar', 'Mahuva', 'Palitana', 'Sihor', 'Talaja'],
  Kutch: ['Bhuj', 'Anjar', 'Gandhidham', 'Mundra', 'Nakhatrana', 'Rapar', 'Abdasa', 'Lakhpat'],
  Mehsana: ['Mehsana', 'Kheralu', 'Sidhpur', 'Unjha', 'Vadnagar', 'Vijapur', 'Visanagar', 'Becharaji'],
  Anand: ['Anand', 'Anklav', 'Borsad', 'Khambhat', 'Petlad', 'Sojitra', 'Tarapur', 'Umreth'],
  Jamnagar: ['Jamnagar City', 'Dhrol', 'Jamjodhpur', 'Jodia', 'Jodiya', 'Kalavad', 'Lalpur', 'Okhamandal'],
};

function getWards(district: string, taluka: string): string[] {
  return ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8',
    'Panchayat Area', 'Town Area', 'Municipal Area', 'Rural Area'];
}

// ── AI Chatbot ───────────────────────────────────────────────────────────────
function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I\'m your GMS assistant. How can I help you file your grievance today?' }
  ]);
  const [input, setInput] = useState('');

  function send() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setTimeout(() => {
      setMessages(m => [...m, {
        role: 'bot',
        text: 'I understand your concern. Please fill in the form to submit your grievance. Our team will respond within the SLA period.'
      }]);
    }, 800);
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-50 transition-transform hover:scale-110"
        style={{ background: '#7C3AED' }}
      >
        {open ? <X size={22} className="text-white" /> : <Bot size={22} className="text-white" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-80 rounded-[16px] shadow-2xl z-50 overflow-hidden flex flex-col" style={{ height: 380, background: '#fff', border: '1px solid #E5E7EB' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#7C3AED' }}>
            <Bot size={18} className="text-white" />
            <span className="text-[13px] font-bold text-white">GMS Assistant</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-[12px] text-[11px] ${m.role === 'user' ? 'text-white' : 'text-[#0E1C2F] bg-[#F0F2F7]'}`}
                  style={m.role === 'user' ? { background: '#7C3AED' } : {}}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 p-3 border-t border-[#F0F2F7]">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-1.5 rounded-[8px] border border-[#DDE3EE] text-[11px] outline-none"
            />
            <button onClick={send} className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{ background: '#7C3AED' }}>
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function SubmitGrievance() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState<typeof DOMAINS[0] | null>(null);
  const [sub, setSub] = useState<typeof DOMAINS[0]['subs'][0] | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', district: '', taluka: '', ward: '', specificLocation: '',
  });
  const [listening, setListening] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ token: string; id: string } | null>(null);
  const recogRef = useRef<any>(null);

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (field === 'district') setForm(f => ({ ...f, district: value, taluka: '', ward: '' }));
    if (field === 'taluka') setForm(f => ({ ...f, taluka: value, ward: '' }));
  }

  // Voice mic
  const toggleVoice = useCallback(() => {
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      // Simulate for demo
      setListening(true);
      setTimeout(() => {
        setForm(f => ({ ...f, description: f.description + (f.description ? ' ' : '') + 'Water supply has been disrupted for the past 3 days in our area.' }));
        setListening(false);
      }, 2000);
      return;
    }
    const recog = new SpeechRecognitionAPI();
    recog.lang = 'gu-IN';
    recog.continuous = false;
    recog.interimResults = false;
    recog.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setForm(f => ({ ...f, description: f.description + (f.description ? ' ' : '') + text }));
    };
    recog.onend = () => setListening(false);
    recog.start();
    recogRef.current = recog;
    setListening(true);
  }, [listening]);

  // GPS detect
  function detectLocation() {
    setDetecting(true);
    if (!navigator.geolocation) {
      setForm(f => ({ ...f, district: 'Ahmedabad', taluka: 'Ahmedabad City', ward: 'Ward 3', specificLocation: 'Auto-detected location' }));
      setDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setForm(f => ({ ...f, district: 'Ahmedabad', taluka: 'Ahmedabad City', ward: 'Ward 3', specificLocation: 'GPS detected location' }));
        setDetecting(false);
        toast.success('Location detected!');
      },
      () => {
        setForm(f => ({ ...f, district: 'Ahmedabad', taluka: 'Ahmedabad City', ward: 'Ward 3', specificLocation: 'Demo location (GPS denied)' }));
        setDetecting(false);
      }
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenId: user?.id || 'u5',
          citizenName: user?.name || 'Citizen',
          citizenPhone: (user as any)?.phone || '',
          citizenEmail: (user as any)?.email || null,
          title: form.title,
          description: form.description,
          category: `${domain?.label} — ${sub?.label}`,
          department: domain?.code || '',
          priority: sub?.priority || 'medium',
          channel: 'web',
          location: [form.specificLocation, form.ward, form.taluka, form.district].filter(Boolean).join(', '),
          ward: form.ward,
          district: form.district,
        }),
      });
      const data = await res.json();
      setResult({ token: data.data?.token || 'GRV-' + Date.now(), id: data.data?.id || '' });
      setStep(5);
    } catch {
      toast.error('Failed to submit grievance');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Step indicators ──────────────────────────────────────────────────────
  const STEPS = ['Category', 'Sub-Category', 'Issue Details', 'Review', 'Filed!'];

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => step > 1 && step < 5 ? setStep(s => s - 1) : router.push('/citizen')}
          className="w-8 h-8 rounded-lg bg-[#F0F2F7] flex items-center justify-center hover:bg-[#DDE3EE] transition-colors">
          <ArrowLeft size={16} className="text-[#3D5068]" />
        </button>
        <div>
          <h1 className="text-[16px] font-bold text-[#0E1C2F]">Submit Grievance</h1>
          <p className="text-[11px] text-[#7A8FA6]">ફરિયાદ નોંધો — File a complaint in 5 steps</p>
        </div>
      </div>

      {/* Step bar */}
      {step < 5 && (
        <div className="flex items-center mb-5">
          {STEPS.slice(0, 4).map((label, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all ${step > idx + 1 ? 'bg-[#16A34A] text-white' : step === idx + 1 ? 'text-white' : 'bg-[#DDE3EE] text-[#7A8FA6]'}`}
                style={step === idx + 1 ? { background: '#F4811F' } : {}}>
                {step > idx + 1 ? <CheckCircle size={14} /> : idx + 1}
              </div>
              <span className="hidden sm:block text-[10px] font-medium ml-1 mr-2 text-[#7A8FA6]">{label}</span>
              {idx < 3 && <div className={`flex-1 h-0.5 mr-1 ${step > idx + 1 ? 'bg-[#16A34A]' : 'bg-[#DDE3EE]'}`} />}
            </div>
          ))}
        </div>
      )}

      {/* ── STEP 1: Domain / Category ─────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-1">Select Category</h2>
          <p className="text-[11px] text-[#7A8FA6] mb-4">વિભાગ પસંદ કરો — Choose the service domain</p>
          <div className="grid grid-cols-1 gap-3">
            {DOMAINS.map(d => {
              const Icon = d.icon;
              const selected = domain?.id === d.id;
              return (
                <button key={d.id} onClick={() => setDomain(d)}
                  className="flex items-center gap-4 p-4 rounded-[12px] border-2 text-left transition-all"
                  style={{ borderColor: selected ? d.color : '#DDE3EE', background: selected ? d.bg : '#fff' }}>
                  <div className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0"
                    style={{ background: selected ? d.color : d.bg }}>
                    <Icon size={22} style={{ color: selected ? '#fff' : d.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-[#0E1C2F]">{d.label}</p>
                    <p className="text-[11px]" style={{ color: d.color }}>{d.labelGu}</p>
                    <p className="text-[10px] text-[#7A8FA6] mt-0.5">{d.subs.length} sub-categories</p>
                  </div>
                  {selected && <CheckCircle size={18} style={{ color: d.color, flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => { if (!domain) return toast.error('Please select a category'); setStep(2); }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-[12px] font-semibold text-white"
              style={{ background: '#F4811F' }}>
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Sub-category ─────────────────────────────────────────── */}
      {step === 2 && domain && (
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: domain.bg }}>
              <domain.icon size={14} style={{ color: domain.color }} />
            </div>
            <h2 className="text-[14px] font-bold text-[#0E1C2F]">{domain.label}</h2>
          </div>
          <p className="text-[11px] text-[#7A8FA6] mb-4">પ્રકાર પસંદ કરો — Select the specific issue type</p>
          <div className="space-y-2">
            {domain.subs.map(s => {
              const selected = sub?.id === s.id;
              return (
                <button key={s.id} onClick={() => setSub(s)}
                  className="w-full flex items-center gap-3 p-3 rounded-[10px] border-2 text-left transition-all"
                  style={{ borderColor: selected ? domain.color : '#DDE3EE', background: selected ? domain.bg : '#fff' }}>
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold text-[#0E1C2F]">{s.label}</p>
                    <p className="text-[10px]" style={{ color: domain.color }}>{s.labelGu}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: PRIORITY_BG[s.priority], color: PRIORITY_COLORS[s.priority] }}>
                      {s.priority.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-[#7A8FA6]">{s.sla}d SLA</span>
                    {selected && <CheckCircle size={14} style={{ color: domain.color }} />}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white">Back</button>
            <button onClick={() => { if (!sub) return toast.error('Please select a sub-category'); setStep(3); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12px] font-semibold text-white"
              style={{ background: '#F4811F' }}>
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Issue Details ─────────────────────────────────────────── */}
      {step === 3 && (
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-1">Issue Details</h2>
          <p className="text-[11px] text-[#7A8FA6] mb-4">સમસ્યાની વિગત — Describe your issue</p>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Title * <span className="text-[#7A8FA6] font-normal">({form.title.length}/80)</span></label>
              <input
                value={form.title}
                onChange={e => e.target.value.length <= 80 && update('title', e.target.value)}
                placeholder="Brief title for your grievance..."
                className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F]"
              />
            </div>

            {/* Description + Voice */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-[#3D5068]">Description *</label>
                <button onClick={toggleVoice}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-[10px] font-semibold transition-all"
                  style={{ background: listening ? '#FEE2E2' : '#F0F2F7', color: listening ? '#DC2626' : '#3D5068' }}>
                  {listening ? <><MicOff size={12} /> Recording...</> : <><Mic size={12} /> Voice Input</>}
                </button>
              </div>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={4}
                placeholder="Explain the issue in detail. When did it start? Who is affected? What is the impact?"
                className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F] resize-none"
                style={listening ? { borderColor: '#DC2626', background: '#FFF5F5' } : {}}
              />
              {listening && <p className="text-[10px] text-[#DC2626] mt-0.5 flex items-center gap-1"><span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Listening... speak now (gu/en)</p>}
            </div>

            {/* GPS + Location */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-semibold text-[#3D5068]">Location *</label>
                <button onClick={detectLocation} disabled={detecting}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-[10px] font-semibold transition-all"
                  style={{ background: '#E0F7FA', color: '#0891B2' }}>
                  {detecting ? <><span className="w-3 h-3 border border-teal-500 border-t-transparent rounded-full animate-spin" /> Detecting...</>
                    : <><Navigation size={11} /> Detect GPS</>}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#3D5068] mb-1">District *</label>
                  <div className="relative">
                    <select
                      value={form.district}
                      onChange={e => { setForm(f => ({ ...f, district: e.target.value, taluka: '', ward: '' })); }}
                      className="w-full px-3 py-2 border-2 border-[#DDE3EE] rounded-[10px] text-[11px] outline-none focus:border-[#F4811F] appearance-none bg-white">
                      <option value="">Select District</option>
                      {GUJARAT_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#3D5068] mb-1">Taluka</label>
                  <div className="relative">
                    <select
                      value={form.taluka}
                      onChange={e => { setForm(f => ({ ...f, taluka: e.target.value, ward: '' })); }}
                      disabled={!form.district}
                      className="w-full px-3 py-2 border-2 border-[#DDE3EE] rounded-[10px] text-[11px] outline-none focus:border-[#F4811F] appearance-none bg-white disabled:opacity-50">
                      <option value="">Select Taluka</option>
                      {(TALUKAS[form.district] || []).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#3D5068] mb-1">Ward / Village</label>
                  <div className="relative">
                    <select
                      value={form.ward}
                      onChange={e => update('ward', e.target.value)}
                      disabled={!form.taluka}
                      className="w-full px-3 py-2 border-2 border-[#DDE3EE] rounded-[10px] text-[11px] outline-none focus:border-[#F4811F] appearance-none bg-white disabled:opacity-50">
                      <option value="">Select Ward</option>
                      {getWards(form.district, form.taluka).map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#3D5068] mb-1">Specific Location</label>
                  <input
                    value={form.specificLocation}
                    onChange={e => update('specificLocation', e.target.value)}
                    placeholder="Street / Landmark"
                    className="w-full px-3 py-2 border-2 border-[#DDE3EE] rounded-[10px] text-[11px] outline-none focus:border-[#F4811F]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white">Back</button>
            <button
              onClick={() => {
                if (!form.title.trim()) return toast.error('Please enter a title');
                if (!form.description.trim()) return toast.error('Please describe the issue');
                if (!form.district) return toast.error('Please select a district');
                setStep(4);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12px] font-semibold text-white"
              style={{ background: '#F4811F' }}>
              Review <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Review & Submit ───────────────────────────────────────── */}
      {step === 4 && domain && sub && (
        <div className="space-y-4">
          <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
            <h2 className="text-[14px] font-bold text-[#0E1C2F] mb-1">Review & Submit</h2>
            <p className="text-[11px] text-[#7A8FA6] mb-4">સમીક્ષા — Verify details before submitting</p>

            {/* Draft card */}
            <div className="rounded-[12px] p-4 mb-4" style={{ border: '2px dashed #DDE3EE', background: '#FAFBFC' }}>
              {/* Tags row */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: domain.color }}>
                  <domain.icon size={10} /> {domain.label}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: PRIORITY_BG[sub.priority], color: PRIORITY_COLORS[sub.priority] }}>
                  {sub.priority.toUpperCase()}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#F0F2F7] text-[#3D5068]">
                  SLA: {sub.sla} days
                </span>
              </div>

              <p className="text-[13px] font-bold text-[#0E1C2F] mb-1">{form.title}</p>
              <p className="text-[11px] text-[#3D5068] mb-3 leading-relaxed">{form.description}</p>

              <div className="space-y-1.5 pt-3 border-t border-[#DDE3EE]">
                {[
                  { label: 'Sub-Category', value: sub.label },
                  { label: 'Department', value: domain.code },
                  { label: 'District', value: form.district },
                  { label: 'Taluka', value: form.taluka || '—' },
                  { label: 'Ward', value: form.ward || '—' },
                  { label: 'Location', value: form.specificLocation || '—' },
                  { label: 'Channel', value: 'Web Portal' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-[10px] text-[#7A8FA6]">{item.label}</span>
                    <span className="text-[10px] font-semibold text-[#0E1C2F]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[10px] p-3 text-[11px] mb-4" style={{ background: '#E0F7FA', color: '#0891B2' }}>
              📩 You will receive an SMS confirmation with your grievance token. Use it to track status anytime.
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white">Back</button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12px] font-bold text-white disabled:opacity-60"
                style={{ background: '#16A34A' }}>
                {submitting
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                  : <><Send size={14} /> Submit Grievance</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 5: Success ───────────────────────────────────────────────── */}
      {step === 5 && result && domain && sub && (
        <div className="space-y-4">
          {/* Hero */}
          <div className="rounded-[16px] p-6 text-center text-white" style={{ background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)' }}>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={36} className="text-white" />
            </div>
            <h2 className="text-[18px] font-black mb-1">Grievance Filed!</h2>
            <p className="text-[12px] text-green-100 mb-4">ફરિયાદ સફળતાપૂર્વક નોંધવામાં આવી</p>
            <div className="inline-block px-5 py-2 rounded-[10px] text-[13px] font-black tracking-widest" style={{ border: '2px dashed #FFF', background: 'rgba(255,255,255,0.15)' }}>
              {result.token}
            </div>
            <p className="text-[10px] text-green-100 mt-2">Your grievance token — save it for tracking</p>
          </div>

          {/* Status pills */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Status', value: 'Pending', color: '#D97706', bg: '#FEF3C7' },
              { label: 'Priority', value: sub.priority.charAt(0).toUpperCase() + sub.priority.slice(1), color: PRIORITY_COLORS[sub.priority], bg: PRIORITY_BG[sub.priority] },
              { label: 'SLA', value: `${sub.sla} Days`, color: '#0891B2', bg: '#E0F7FA' },
            ].map(p => (
              <div key={p.label} className="rounded-[10px] p-2.5 text-center" style={{ background: p.bg }}>
                <p className="text-[9px] text-[#7A8FA6] mb-0.5">{p.label}</p>
                <p className="text-[12px] font-bold" style={{ color: p.color }}>{p.value}</p>
              </div>
            ))}
          </div>

          {/* Detail rows */}
          <div className="bg-white rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
            <h3 className="text-[12px] font-bold text-[#0E1C2F] mb-3">Complaint Details</h3>
            <div className="space-y-2">
              {[
                { label: 'Category', value: domain.label },
                { label: 'Issue', value: sub.label },
                { label: 'Title', value: form.title },
                { label: 'District', value: form.district },
                { label: 'Department', value: domain.code },
                { label: 'Filed By', value: user?.name || 'Citizen' },
                { label: 'Channel', value: 'Web Portal' },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-1.5 border-b border-[#F0F2F7] last:border-0">
                  <span className="text-[10px] text-[#7A8FA6]">{row.label}</span>
                  <span className="text-[10px] font-semibold text-[#0E1C2F] text-right max-w-[55%]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What happens next */}
          <div className="rounded-[12px] p-4" style={{ background: '#E0F7FA', border: '1px solid #B2EBF2' }}>
            <h3 className="text-[12px] font-bold mb-2" style={{ color: '#0891B2' }}>What happens next?</h3>
            <div className="space-y-2">
              {[
                { n: 1, text: 'Your grievance has been assigned a token and registered.' },
                { n: 2, text: `The concerned department (${domain.code}) will review within ${sub.sla} days.` },
                { n: 3, text: 'You will receive SMS updates on every status change.' },
                { n: 4, text: 'If not resolved in time, it will be auto-escalated.' },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white" style={{ background: '#0891B2' }}>{s.n}</span>
                  <p className="text-[11px]" style={{ color: '#0E5060' }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white">
              <Printer size={14} /> Receipt
            </button>
            <button onClick={() => router.push('/citizen/complaints')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[12px] font-bold text-white"
              style={{ background: '#1A3260' }}>
              <ClipboardList size={14} /> My Grievances
            </button>
          </div>
          <button onClick={() => { setStep(1); setDomain(null); setSub(null); setForm({ title: '', description: '', district: '', taluka: '', ward: '', specificLocation: '' }); setResult(null); }}
            className="w-full py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white">
            Submit Another Grievance
          </button>
        </div>
      )}

      <AIChatbot />
    </div>
  );
}
