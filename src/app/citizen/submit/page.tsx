'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, CheckCircle, ChevronDown,
  Mic, MicOff, Navigation, Bot, X, Send,
  Hospital, Droplet, Route, Building2, Leaf,
  Printer, ClipboardList, AlertCircle, FileCheck, MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores';
import { addLocalGrievance } from '@/lib/local-store';
import { QuickSubmitForm } from '@/components/gms/QuickSubmitForm';
import { cn } from '@/lib/utils';

// ── Data ─────────────────────────────────────────────────────────────────────
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
  Jamnagar: ['Jamnagar City', 'Dhrol', 'Jamjodhpur', 'Jodia', 'Kalavad', 'Lalpur', 'Okhamandal'],
};

const WARDS = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8',
  'Panchayat Area', 'Town Area', 'Municipal Area', 'Rural Area'];

const STEPS = ['Category', 'Sub-type', 'Details', 'Review'];

type Domain = typeof DOMAINS[0];
type Sub = Domain['subs'][0];

// ── AI Chatbot ────────────────────────────────────────────────────────────────
function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm your GMS assistant. How can I help you file your grievance today?" },
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
        text: 'I understand your concern. Please fill in the form to submit your grievance. Our team will respond within the SLA period.',
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
        <div className="fixed bottom-24 right-6 w-80 rounded-[16px] shadow-2xl z-50 overflow-hidden flex flex-col"
          style={{ height: 380, background: '#fff', border: '1px solid #E5E7EB' }}>
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

// ── Form State Management ─────────────────────────────────────────────────────
interface FormData {
  title: string;
  description: string;
  district: string;
  taluka: string;
  ward: string;
  specificLocation: string;
}

interface FormErrors {
  [key: string]: string;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SubmitGrievance() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Submission modes
  const [mode, setMode] = useState<'detailed' | 'quick'>('detailed');
  const [modeTabFocus, setModeTabFocus] = useState<'detailed' | 'quick'>('detailed');

  // Form state
  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState<Domain | null>(null);
  const [sub, setSub] = useState<Sub | null>(null);
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    district: '',
    taluka: '',
    ward: '',
    specificLocation: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // File management
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Submission states
  const [result, setResult] = useState<{ token: string; id: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Voice & location
  const [listening, setListening] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'en-IN' | 'gu-IN' | 'hi-IN'>('en-IN');

  // Quick mode files
  const [quickModeFiles, setQuickModeFiles] = useState<File[]>([]);

  // Refs
  const recogRef = useRef<any>(null);
  const modeTabsRef = useRef<{ detailed: HTMLButtonElement | null; quick: HTMLButtonElement | null }>({ detailed: null, quick: null });

  // Validation
  const validateStep = (stepNum: number): boolean => {
    const newErrors: FormErrors = {};

    if (stepNum === 1 && !domain) {
      newErrors.domain = 'Please select a category';
    }
    if (stepNum === 2 && !sub) {
      newErrors.sub = 'Please select an issue type';
    }
    if (stepNum === 3) {
      if (!form.title.trim()) newErrors.title = 'Title is required';
      if (!form.description.trim()) newErrors.description = 'Description is required';
      if (!form.district) newErrors.district = 'District is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form update with error clearing
  const update = (field: string, value: string) => {
    if (errors[field]) {
      setErrors(e => {
        const newE = { ...e };
        delete newE[field];
        return newE;
      });
    }

    if (field === 'district') {
      setForm(f => ({ ...f, district: value, taluka: '', ward: '' }));
      return;
    }
    if (field === 'taluka') {
      setForm(f => ({ ...f, taluka: value, ward: '' }));
      return;
    }
    setForm(f => ({ ...f, [field]: value }));
  };

  // Keyboard navigation for tabs
  const handleModeTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, tabKey: 'detailed' | 'quick') => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setModeTabFocus(tabKey === 'detailed' ? 'quick' : 'detailed');
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setModeTabFocus(tabKey === 'detailed' ? 'quick' : 'detailed');
    }
  };

  useEffect(() => {
    if (modeTabFocus === 'detailed') {
      modeTabsRef.current.detailed?.focus();
    } else {
      modeTabsRef.current.quick?.focus();
    }
  }, [modeTabFocus]);

  const toggleVoice = useCallback(() => {
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechAPI) {
      setListening(true);
      setTimeout(() => {
        setForm(f => ({ ...f, description: f.description + (f.description ? ' ' : '') + 'Water supply has been disrupted for the past 3 days in our area.' }));
        setListening(false);
      }, 2000);
      return;
    }
    const recog = new SpeechAPI();
    recog.lang = voiceLang;
    recog.continuous = false;
    recog.interimResults = false;
    recog.onresult = (e: any) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          text += e.results[i][0].transcript + ' ';
        }
      }
      if (text.trim()) {
        setForm(f => ({ ...f, description: f.description + (f.description ? ' ' : '') + text.trim() }));
      }
    };
    recog.onend = () => setListening(false);
    recog.start();
    recogRef.current = recog;
    setListening(true);
  }, [listening, voiceLang]);

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
    if (!domain || !sub) {
      toast.error('Please select a category and issue type');
      return;
    }
    if (!form.title.trim()) return toast.error('Please enter a title');
    if (!form.description.trim()) return toast.error('Please describe the issue');
    if (!form.district) return toast.error('Please select a district');
    setSubmitting(true);
    try {
      let attachmentUrls: string[] = [];

      // Use the appropriate file array based on mode
      const filesToUpload = quickMode ? quickModeFiles : selectedFiles;

      // Upload files to Cloudinary if any
      if (filesToUpload.length > 0) {
        setUploadingFiles(true);
        for (const file of filesToUpload) {
          const uploadForm = new FormData();
          uploadForm.append('file', file);
          uploadForm.append('grievanceId', 'pending');

          const uploadRes = await fetch('/api/documents/upload', {
            method: 'POST',
            body: uploadForm,
          });

          if (!uploadRes.ok) {
            const uploadErr = await uploadRes.json();
            throw new Error(`File upload failed: ${uploadErr.error}`);
          }

          const uploadResult = await uploadRes.json();
          if (uploadResult.success) {
            attachmentUrls.push(uploadResult.data.url);
          }
        }
        setUploadingFiles(false);
      }

      const location = [form.specificLocation, form.ward, form.taluka, form.district].filter(Boolean).join(', ');

      const payload = {
        title: form.title,
        description: form.description,
        category: sub.label,
        department: domain.code,
        priority: sub.priority,
        channel: 'web',
        slaDaysLeft: sub.sla,
        citizenId: user?.id || '',
        citizenName: user?.name || 'Citizen',
        citizenPhone: '',
        citizenEmail: user?.email || '',
        location,
        ward: form.ward,
        district: form.district,
        attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      };

      const res = await fetch('/api/citizen/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Server error');
      }

      const saved = await res.json();
      // saved is the complaint object returned by the API
      const serverComplaint = {
        ...saved,
        submittedDate: saved.createdAt,
        officer: 'Unassigned',
        officerDept: domain.code,
      };
      addLocalGrievance(serverComplaint);

      setResult({ token: saved.token, id: saved.id });
      setStep(5);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setStep(1); setDomain(null); setSub(null); setQuickMode(false);
    setForm({ title: '', description: '', district: '', taluka: '', ward: '', specificLocation: '' });
    setResult(null);
    setSelectedFiles([]);
    setQuickModeFiles([]);
  }

  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      {/* ── Perfect Tab Navigation Header ── */}
      {result === null && (
        <div className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div
              className="flex relative"
              role="tablist"
              aria-label="Grievance submission mode"
            >
              {/* Detailed Submit Tab */}
              <button
                ref={el => { if (el) modeTabsRef.current.detailed = el; }}
                onClick={() => { setMode('detailed'); setStep(1); setDomain(null); setSub(null); setQuickModeFiles([]); setErrors({}); }}
                onKeyDown={(e) => handleModeTabKeyDown(e, 'detailed')}
                role="tab"
                aria-selected={mode === 'detailed'}
                aria-controls="detailed-panel"
                className={cn(
                  'px-6 py-4 text-[13px] font-semibold transition-colors relative',
                  mode === 'detailed'
                    ? 'text-[#F4811F]'
                    : 'text-[#7A8FA6] hover:text-[#3D5068]'
                )}
              >
                📋 Detailed Submit
                {mode === 'detailed' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#F4811F] transition-all duration-300"
                    style={{
                      borderRadius: '1px 1px 0 0',
                    }}
                  />
                )}
              </button>

              {/* Quick Submit Tab */}
              <button
                ref={el => { if (el) modeTabsRef.current.quick = el; }}
                onClick={() => { setMode('quick'); setStep(1); setDomain(null); setSub(null); setErrors({}); }}
                onKeyDown={(e) => handleModeTabKeyDown(e, 'quick')}
                role="tab"
                aria-selected={mode === 'quick'}
                aria-controls="quick-panel"
                className={cn(
                  'px-6 py-4 text-[13px] font-semibold transition-colors relative',
                  mode === 'quick'
                    ? 'text-[#F4811F]'
                    : 'text-[#7A8FA6] hover:text-[#3D5068]'
                )}
              >
                ⚡ Quick Submit
                {mode === 'quick' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#F4811F] transition-all duration-300"
                    style={{
                      borderRadius: '1px 1px 0 0',
                    }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto pb-20 px-4 py-8">
        {/* ── Page Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                if (mode === 'quick' && result === null) {
                  setMode('detailed');
                } else if (step > 1 && step < 5 && mode === 'detailed') {
                  setStep(s => s - 1);
                } else {
                  router.push('/citizen');
                }
              }}
              className="w-10 h-10 rounded-lg bg-white flex items-center justify-center hover:bg-[#E5E7EB] transition-colors border border-[#DDE3EE]"
              aria-label="Go back"
            >
              <ArrowLeft size={18} className="text-[#3D5068]" />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-[#0F1A2E]">Submit Grievance</h1>
              <p className="text-[12px] text-[#7A8FA6]">ફરિયાદ નોંધો — Help us resolve your concern</p>
            </div>
          </div>

          {/* Progress Indicator - Only for Detailed Mode */}
          {mode === 'detailed' && result === null && (
            <div className="bg-white rounded-[12px] p-4 border border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                {STEPS.map((label, idx) => (
                  <div key={idx} className="flex items-center flex-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all"
                      style={{
                        background: step > idx + 1 ? '#16A34A' : step === idx + 1 ? '#F4811F' : '#E5E7EB',
                        color: step >= idx + 1 ? '#fff' : '#7A8FA6',
                      }}
                    >
                      {step > idx + 1 ? <CheckCircle size={14} /> : idx + 1}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-1 rounded-full transition-all ${
                          step > idx + 1 ? 'bg-[#16A34A]' : 'bg-[#E5E7EB]'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#7A8FA6] mt-3">
                Step {step} of {STEPS.length} • {STEPS[step - 1]}
              </p>
            </div>
          )}
        </div>

        {/* ── Quick Submit Mode ── */}
        {mode === 'quick' && result === null && (
          <div id="quick-panel" role="tabpanel" aria-labelledby="quick-tab">
            <QuickSubmitForm
              form={form}
              onFormChange={update}
              onBack={() => { setMode('detailed'); setDomain(null); setSub(null); setErrors({}); }}
              onSubmit={handleSubmit}
              onDomainChange={setDomain}
              onSubChange={setSub}
              domain={domain}
              sub={sub}
              domains={DOMAINS}
              submitting={submitting}
              listening={listening}
              detecting={detecting}
              lang={voiceLang}
              onLanguageChange={setVoiceLang}
              onToggleVoice={toggleVoice}
              onDetectLocation={detectLocation}
              selectedFiles={quickModeFiles}
              onFilesChange={setQuickModeFiles}
            />
          </div>
        )}

      {/* ── Step 1: Domain ── */}
      {step === 1 && mode === 'detailed' && result === null && (
        <div id="detailed-panel" role="tabpanel" aria-labelledby="detailed-tab">
          <div className="bg-white rounded-[14px] p-6 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
            <div className="mb-6">
              <h2 className="text-[16px] font-bold text-[#0F1A2E] mb-2">Select Category</h2>
              <p className="text-[12px] text-[#7A8FA6]">વિભાગ પસંદ કરો — Choose the service domain for your grievance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {DOMAINS.map(d => {
                const Icon = d.icon;
                const selected = domain?.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => { setDomain(d); setErrors({}); }}
                    className="flex items-center gap-3 p-4 rounded-[12px] border-2 text-left transition-all hover:shadow-md"
                    style={{
                      borderColor: selected ? d.color : '#E5E7EB',
                      background: selected ? d.bg : '#fff',
                    }}
                    aria-pressed={selected}
                  >
                    <div
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-transform"
                      style={{
                        background: selected ? d.color : d.bg,
                        transform: selected ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      <Icon size={20} style={{ color: selected ? '#fff' : d.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#0F1A2E]">{d.label}</p>
                      <p className="text-[10px]" style={{ color: d.color }}>
                        {d.labelGu} • {d.subs.length} types
                      </p>
                    </div>
                    {selected && <CheckCircle size={16} style={{ color: d.color, flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!validateStep(1)) return;
                  setStep(2);
                }}
                className="px-6 py-2.5 rounded-[10px] text-[12px] font-semibold text-white flex items-center gap-2 transition-all hover:shadow-lg"
                style={{ background: '#F4811F' }}
              >
                Next <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Sub-category ── */}
      {step === 2 && domain && mode === 'detailed' && result === null && (
        <div className="bg-white rounded-[14px] p-6 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: domain.bg }}
            >
              <domain.icon size={16} style={{ color: domain.color }} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#0F1A2E]">{domain.label}</h2>
              <p className="text-[12px] text-[#7A8FA6]">પ્રકાર પસંદ કરો — Select the specific issue type</p>
            </div>
          </div>

          <div className="space-y-2 mb-6 max-h-[60vh] overflow-y-auto pr-2">
            {domain.subs.map(s => {
              const selected = sub?.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSub(s); setErrors({}); }}
                  className="w-full flex items-center gap-3 p-3 rounded-[10px] border-2 text-left transition-all hover:shadow-sm"
                  style={{
                    borderColor: selected ? domain.color : '#E5E7EB',
                    background: selected ? domain.bg : '#fff',
                  }}
                  aria-pressed={selected}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#0F1A2E]">{s.label}</p>
                    <p className="text-[10px]" style={{ color: domain.color }}>
                      {s.labelGu}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p
                        className="text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{
                          background: PRIORITY_BG[s.priority],
                          color: PRIORITY_COLORS[s.priority],
                        }}
                      >
                        {s.priority.toUpperCase()}
                      </p>
                      <p className="text-[9px] text-[#7A8FA6] mt-0.5">{s.sla}d SLA</p>
                    </div>
                    {selected && <CheckCircle size={14} style={{ color: domain.color, flexShrink: 0 }} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white hover:bg-[#F4F2EE] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!validateStep(2)) return;
                setStep(3);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12px] font-semibold text-white transition-all hover:shadow-lg"
              style={{ background: '#F4811F' }}
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Issue Details ── */}
      {step === 3 && mode === 'detailed' && result === null && (
        <div className="bg-white rounded-[14px] p-6 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
          <div className="mb-6">
            <h2 className="text-[16px] font-bold text-[#0F1A2E] mb-2">Issue Details</h2>
            <p className="text-[12px] text-[#7A8FA6]">સમસ્યાની વિગત — Describe your issue in detail</p>
          </div>
          <div className="space-y-5">
            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-semibold text-[#3D5068]">
                  📝 Title *
                </label>
                <span className="text-[10px] text-[#7A8FA6]">
                  {form.title.length}/80
                </span>
              </div>
              <input
                value={form.title}
                onChange={e => e.target.value.length <= 80 && update('title', e.target.value)}
                placeholder="Brief title for your grievance..."
                className={cn(
                  'w-full px-3 py-2.5 border-2 rounded-[10px] text-[12px] outline-none transition-colors',
                  errors.title
                    ? 'border-[#DC2626] bg-[#FFF5F5] focus:border-[#DC2626]'
                    : 'border-[#DDE3EE] focus:border-[#F4811F]'
                )}
              />
              {errors.title && (
                <p className="text-[10px] text-[#DC2626] mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>

            {/* Description + Voice */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-semibold text-[#3D5068]">
                  💬 Description *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleVoice}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[10px] font-semibold transition-all"
                    style={{
                      background: listening ? '#FEE2E2' : '#F0F2F7',
                      color: listening ? '#DC2626' : '#3D5068',
                    }}
                    aria-pressed={listening}
                  >
                    {listening ? (
                      <>
                        <MicOff size={12} /> Recording...
                      </>
                    ) : (
                      <>
                        <Mic size={12} /> Voice
                      </>
                    )}
                  </button>
                  <div className="relative">
                    <select
                      value={voiceLang}
                      onChange={e => setVoiceLang(e.target.value as 'en-IN' | 'gu-IN' | 'hi-IN')}
                      className="px-2.5 py-1.5 border-2 border-[#DDE3EE] rounded-[6px] text-[9px] outline-none focus:border-[#F4811F] appearance-none bg-white pr-6"
                      disabled={!listening}
                    >
                      <option value="en-IN">EN</option>
                      <option value="gu-IN">GU</option>
                      <option value="hi-IN">HI</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#7A8FA6] pointer-events-none" />
                  </div>
                </div>
              </div>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={4}
                placeholder="Explain the issue in detail. When did it start? Who is affected? What action is needed?"
                className={cn(
                  'w-full px-3 py-2.5 border-2 rounded-[10px] text-[12px] outline-none transition-colors resize-none',
                  errors.description
                    ? 'border-[#DC2626] bg-[#FFF5F5] focus:border-[#DC2626]'
                    : listening
                      ? 'border-[#DC2626] bg-[#FFF5F5] focus:border-[#DC2626]'
                      : 'border-[#DDE3EE] focus:border-[#F4811F]'
                )}
              />
              <div className="flex items-center justify-between mt-1.5">
                {listening && (
                  <p className="text-[10px] text-[#DC2626] flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Listening in {voiceLang === 'en-IN' ? 'English' : voiceLang === 'gu-IN' ? 'Gujarati' : 'Hindi'}...
                  </p>
                )}
                {errors.description && (
                  <p className="text-[10px] text-[#DC2626] flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-[#F4F2EE] rounded-[12px] p-4 -mx-2">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[11px] font-semibold text-[#3D5068] flex items-center gap-1.5">
                  <MapPin size={14} /> Location *
                </label>
                <button
                  onClick={detectLocation}
                  disabled={detecting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[10px] font-semibold transition-all bg-[#E0F7FA] text-[#0891B2] hover:bg-[#B2EBF2] disabled:opacity-60"
                >
                  {detecting ? (
                    <>
                      <span className="w-2.5 h-2.5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Navigation size={11} /> Detect GPS
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#3D5068] mb-1.5">
                    District *
                  </label>
                  <div className="relative">
                    <select
                      value={form.district}
                      onChange={e => update('district', e.target.value)}
                      className={cn(
                        'w-full px-3 py-2 border-2 rounded-[10px] text-[11px] outline-none appearance-none bg-white transition-colors',
                        errors.district
                          ? 'border-[#DC2626] focus:border-[#DC2626]'
                          : 'border-[#DDE3EE] focus:border-[#F4811F]'
                      )}
                    >
                      <option value="">Select District</option>
                      {GUJARAT_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#3D5068] mb-1.5">Taluka</label>
                  <div className="relative">
                    <select
                      value={form.taluka}
                      onChange={e => update('taluka', e.target.value)}
                      disabled={!form.district}
                      className="w-full px-3 py-2 border-2 border-[#DDE3EE] rounded-[10px] text-[11px] outline-none focus:border-[#F4811F] appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <option value="">Select Taluka</option>
                      {(TALUKAS[form.district] || []).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#3D5068] mb-1.5">Ward / Village</label>
                  <div className="relative">
                    <select
                      value={form.ward}
                      onChange={e => update('ward', e.target.value)}
                      disabled={!form.district}
                      className="w-full px-3 py-2 border-2 border-[#DDE3EE] rounded-[10px] text-[11px] outline-none focus:border-[#F4811F] appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <option value="">Select Ward</option>
                      {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#3D5068] mb-1.5">Street / Landmark</label>
                  <input
                    value={form.specificLocation}
                    onChange={e => update('specificLocation', e.target.value)}
                    placeholder="e.g., Main Road, Intersection"
                    className="w-full px-3 py-2 border-2 border-[#DDE3EE] rounded-[10px] text-[11px] outline-none focus:border-[#F4811F] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <label className="block text-[11px] font-semibold text-[#3D5068] mb-3 flex items-center gap-1.5">
                📎 Attach Documents
                <span className="text-[#7A8FA6] font-normal text-[10px]">(Optional but recommended)</span>
              </label>

              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#DDE3EE] rounded-[12px] cursor-pointer hover:border-[#F4811F] hover:bg-[#FFF8F0] transition-all">
                <FileCheck size={24} className="text-[#7A8FA6] mb-2" />
                <span className="text-[12px] font-semibold text-[#3D5068] text-center">
                  Click to upload or drag and drop
                </span>
                <span className="text-[10px] text-[#7A8FA6] text-center mt-1">
                  PNG, JPG, PDF, DOC, DOCX (Max 5MB each)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={e => {
                    const newFiles = e.target.files ? Array.from(e.target.files) : [];
                    setSelectedFiles([...selectedFiles, ...newFiles]);
                  }}
                  className="hidden"
                />
              </label>

              {selectedFiles.length > 0 && (
                <div className="bg-[#E0F7FA] border border-[#B2EBF2] rounded-lg p-4 mt-3 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-bold text-[#0277BD]">✓ {selectedFiles.length} file(s) selected</p>
                    <button
                      onClick={() => setSelectedFiles([])}
                      className="text-[10px] text-[#0277BD] hover:text-[#01579B] font-semibold"
                    >
                      Clear all
                    </button>
                  </div>
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#B2EBF2]"
                    >
                      <p className="text-[11px] text-[#0F1A2E] truncate flex-1">{file.name}</p>
                      <button
                        onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                        className="text-[10px] text-[#FF8A80] hover:text-red-700 font-semibold ml-2 flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-[#E5E7EB]">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white hover:bg-[#F4F2EE] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!validateStep(3)) return;
                setStep(4);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12px] font-semibold text-white transition-all hover:shadow-lg"
              style={{ background: '#F4811F' }}
            >
              Review <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Review & Submit ── */}
      {step === 4 && domain && sub && mode === 'detailed' && result === null && (
        <div className="space-y-4">
          <div className="bg-white rounded-[14px] p-6 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
            <div className="mb-6">
              <h2 className="text-[16px] font-bold text-[#0F1A2E] mb-2">Review Your Grievance</h2>
              <p className="text-[12px] text-[#7A8FA6]">સમીક્ષા — Please verify all details before submitting</p>
            </div>

            {/* Category & Priority Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold text-white"
                style={{ background: domain.color }}
              >
                <domain.icon size={12} /> {domain.label}
              </span>
              <span
                className="px-3 py-2 rounded-full text-[11px] font-bold"
                style={{ background: PRIORITY_BG[sub.priority], color: PRIORITY_COLORS[sub.priority] }}
              >
                {sub.priority.toUpperCase()} PRIORITY
              </span>
              <span className="px-3 py-2 rounded-full text-[11px] font-semibold bg-[#E0F7FA] text-[#0891B2]">
                ⏱️ SLA: {sub.sla} days
              </span>
            </div>

            {/* Title & Description */}
            <div className="bg-[#F4F2EE] rounded-[12px] p-4 mb-4">
              <p className="text-[12px] font-bold text-[#0F1A2E] mb-2">{form.title}</p>
              <p className="text-[12px] text-[#3D5068] leading-relaxed whitespace-pre-wrap">{form.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Issue Type', value: sub.label, icon: '📋' },
                { label: 'Department', value: domain.code, icon: '🏢' },
                { label: 'District', value: form.district || '—', icon: '📍' },
                { label: 'Taluka', value: form.taluka || '—', icon: '🗺️' },
                { label: 'Ward', value: form.ward || '—', icon: '🏘️' },
                { label: 'Channel', value: 'Web Portal', icon: '💻' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-[#E5E7EB] rounded-[10px] p-3">
                  <p className="text-[10px] text-[#7A8FA6] mb-1">{item.icon} {item.label}</p>
                  <p className="text-[11px] font-semibold text-[#0F1A2E]">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Specific Location */}
            {form.specificLocation && (
              <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-3 mb-4">
                <p className="text-[10px] text-[#7A8FA6] mb-1">📌 Specific Location</p>
                <p className="text-[11px] font-semibold text-[#0F1A2E]">{form.specificLocation}</p>
              </div>
            )}

            {/* Attachments */}
            {selectedFiles.length > 0 && (
              <div className="bg-[#E0F7FA] border border-[#B2EBF2] rounded-[10px] p-4 mb-4">
                <p className="text-[11px] font-bold text-[#0891B2] mb-2.5">📎 {selectedFiles.length} File(s) Attached</p>
                <div className="space-y-1.5">
                  {selectedFiles.map((file, idx) => (
                    <p key={idx} className="text-[10px] text-[#0277BD]">
                      • {file.name}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Info Banner */}
            <div className="bg-[#E0F7FA] border border-[#B2EBF2] rounded-[10px] p-4">
              <p className="text-[11px] text-[#0891B2] font-semibold mb-1.5">✓ What happens next?</p>
              <ul className="text-[10px] text-[#0891B2] space-y-1">
                <li>• Your grievance will be assigned a unique tracking token</li>
                <li>• The department will respond within {sub.sla} days (SLA)</li>
                <li>• You'll receive SMS updates on every status change</li>
                <li>• Auto-escalation applies if not resolved within SLA</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white hover:bg-[#F4F2EE] transition-colors disabled:opacity-60"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12px] font-bold text-white transition-all hover:shadow-lg disabled:opacity-60"
              style={{ background: '#16A34A' }}
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={14} /> Submit Grievance
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 5: Success ── */}
      {result && domain && sub && (
        <div className="space-y-4">
          {/* Success Banner */}
          <div
            className="rounded-[16px] p-8 text-center text-white shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
            }}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-white animate-bounce" />
            </div>
            <h2 className="text-[22px] font-black mb-2">Grievance Successfully Filed!</h2>
            <p className="text-[13px] text-green-100 mb-6">ફરિયાદ સફળતાપૂર્વક નોંધવામાં આવી</p>

            {/* Token */}
            <div className="bg-white/15 rounded-[12px] px-6 py-3 mb-4 inline-block">
              <p className="text-[10px] text-green-100 mb-1.5">Your Grievance Token</p>
              <p className="text-[18px] font-black tracking-widest font-mono">{result.token}</p>
            </div>
            <p className="text-[11px] text-green-100">Save this token to track your grievance anytime</p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '📊 Status', value: 'Pending', color: '#D97706', bg: '#FEF3C7' },
              {
                label: '🎯 Priority',
                value: sub.priority.charAt(0).toUpperCase() + sub.priority.slice(1),
                color: PRIORITY_COLORS[sub.priority],
                bg: PRIORITY_BG[sub.priority],
              },
              { label: '⏱️ SLA', value: `${sub.sla} Days`, color: '#0891B2', bg: '#E0F7FA' },
            ].map(p => (
              <div key={p.label} className="rounded-[12px] p-4 text-center" style={{ background: p.bg }}>
                <p className="text-[10px] text-[#7A8FA6] mb-1">{p.label.split(' ')[1]}</p>
                <p className="text-[13px] font-bold" style={{ color: p.color }}>
                  {p.value}
                </p>
              </div>
            ))}
          </div>

          {/* Complaint Details */}
          <div className="bg-white rounded-[14px] p-6 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
            <h3 className="text-[13px] font-bold text-[#0F1A2E] mb-4 flex items-center gap-1.5">
              📋 Complaint Details
            </h3>
            <div className="space-y-3">
              {[
                { label: '📁 Category', value: domain.label },
                { label: '🔍 Issue Type', value: sub.label },
                { label: '📝 Title', value: form.title },
                { label: '📍 District', value: form.district },
                { label: '🏢 Department', value: domain.code },
                { label: '👤 Filed By', value: user?.name || 'Citizen' },
                { label: '💻 Channel', value: 'Web Portal' },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2 border-b border-[#F4F2EE] last:border-0">
                  <span className="text-[11px] text-[#7A8FA6]">{row.label.split(' ')[0]} {row.label.split(' ').slice(1).join(' ')}</span>
                  <span className="text-[11px] font-semibold text-[#0F1A2E] text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-[#E0F7FA] border border-[#B2EBF2] rounded-[14px] p-6">
            <h3 className="text-[13px] font-bold text-[#0891B2] mb-4 flex items-center gap-1.5">
              ✓ What Happens Next?
            </h3>
            <div className="space-y-3">
              {[
                {
                  n: 1,
                  text: 'Your grievance has been registered and assigned a token for tracking.',
                },
                {
                  n: 2,
                  text: `The ${domain.code} department will review your grievance within ${sub.sla} days.`,
                },
                { n: 3, text: 'You will receive SMS updates on every status change.' },
                {
                  n: 4,
                  text: 'If not resolved within SLA, your grievance will be automatically escalated.',
                },
              ].map(s => (
                <div key={s.n} className="flex gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: '#0891B2' }}
                  >
                    {s.n}
                  </span>
                  <p className="text-[11px] text-[#0E5060] pt-0.5">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white hover:bg-[#F4F2EE] transition-colors"
            >
              <Printer size={14} /> Download Receipt
            </button>
            <button
              onClick={() => router.push('/citizen/grievances')}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] text-[12px] font-bold text-white transition-all hover:shadow-lg"
              style={{ background: '#1A3260' }}
            >
              <ClipboardList size={14} /> View My Grievances
            </button>
          </div>

          <button
            onClick={resetForm}
            className="w-full py-3 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white hover:bg-[#F4F2EE] transition-colors"
          >
            ➕ Submit Another Grievance
          </button>
        </div>
      )}

      </div>

      {/* ── AI Chatbot ── */}
      <AIChatbot />
    </div>
  );
}
