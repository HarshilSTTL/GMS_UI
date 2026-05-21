'use client';
import { useState, useRef, useCallback } from 'react';
import {
  ArrowLeft, ChevronDown, Mic, MicOff, Navigation, CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { GrievanceFormData } from '@/lib/grievanceSchema';

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

interface Domain {
  id: string;
  code: string;
  label: string;
  labelGu: string;
  color: string;
  bg: string;
  icon: any;
  subs: Sub[];
}

interface Sub {
  id: string;
  label: string;
  labelGu: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  sla: number;
}

interface QuickSubmitFormProps {
  form: GrievanceFormData;
  onFormChange: (field: string, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  onDomainChange?: (domain: Domain | null) => void;
  onSubChange?: (sub: Sub | null) => void;
  domain?: Domain | null;
  sub?: Sub | null;
  domains?: Domain[];
  submitting?: boolean;
  listening?: boolean;
  detecting?: boolean;
  lang?: 'en-IN' | 'gu-IN' | 'hi-IN';
  onLanguageChange?: (lang: 'en-IN' | 'gu-IN' | 'hi-IN') => void;
  onToggleVoice?: () => void;
  onDetectLocation?: () => void;
  selectedFiles?: File[];
  onFilesChange?: (files: File[]) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#DC2626', high: '#D97706', medium: '#1A56C4', low: '#16A34A',
};
const PRIORITY_BG: Record<string, string> = {
  critical: '#FEE2E2', high: '#FEF3C7', medium: '#EFF6FF', low: '#DCFCE7',
};

export function QuickSubmitForm({
  form,
  onFormChange,
  onBack,
  onSubmit,
  onDomainChange,
  onSubChange,
  domain = null,
  sub = null,
  domains = [],
  submitting = false,
  listening = false,
  detecting = false,
  lang = 'en-IN',
  onLanguageChange,
  onToggleVoice,
  onDetectLocation,
  selectedFiles = [],
  onFilesChange,
}: QuickSubmitFormProps) {
  const update = (field: string, value: string) => {
    if (field === 'district') { onFormChange('district', value); onFormChange('taluka', ''); onFormChange('ward', ''); return; }
    if (field === 'taluka') { onFormChange('taluka', value); onFormChange('ward', ''); return; }
    onFormChange(field, value);
  };

  const handleSubmit = () => {
    if (!domain || !sub) return toast.error('Please select a category and issue type');
    if (!form.title.trim()) return toast.error('Please enter a title');
    if (!form.description.trim()) return toast.error('Please describe the issue');
    if (!form.district) return toast.error('Please select a district');
    onSubmit();
  };

  return (
    <div className="bg-white rounded-[14px] p-6 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
      <div className="mb-6">
        <h2 className="text-[16px] font-bold text-[#0F1A2E] mb-1">⚡ Quick Submit Grievance</h2>
        <p className="text-[12px] text-[#7A8FA6]">Fill all details in one page — faster submission</p>
      </div>

      <div className="space-y-5 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {/* Category & Sub-Category */}
        {domains && domains.length > 0 && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-[#3D5068] mb-2">Category *</label>
              <div className="grid grid-cols-2 gap-2">
                {domains.map(d => {
                  const Icon = d.icon;
                  const selected = domain?.id === d.id;
                  return (
                    <button key={d.id} onClick={() => onDomainChange?.(d)}
                      className="flex items-center gap-2 p-3 rounded-[10px] border-2 text-left transition-all"
                      style={{ borderColor: selected ? d.color : '#DDE3EE', background: selected ? d.bg : '#fff' }}>
                      <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
                        style={{ background: selected ? d.color : d.bg }}>
                        <Icon size={14} style={{ color: selected ? '#fff' : d.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-[#0E1C2F] truncate">{d.label}</p>
                      </div>
                      {selected && <CheckCircle size={12} style={{ color: d.color, flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {domain && (
              <div>
                <label className="block text-[11px] font-semibold text-[#3D5068] mb-2">Issue Type *</label>
                <div className="space-y-1.5">
                  {domain.subs.map(s => {
                    const subSelected = sub?.id === s.id;
                    return (
                      <button key={s.id} onClick={() => onSubChange?.(s)}
                        className="w-full flex items-center gap-2 p-2.5 rounded-[8px] border-2 text-left transition-all text-[10px]"
                        style={{ borderColor: subSelected ? domain.color : '#E5E7EB', background: subSelected ? domain.bg : '#fff' }}>
                        <div className="flex-1">
                          <p className="font-semibold text-[#0E1C2F]">{s.label}</p>
                        </div>
                        <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                          style={{ background: PRIORITY_BG[s.priority], color: PRIORITY_COLORS[s.priority] }}>
                          {s.priority.toUpperCase()}
                        </span>
                        {subSelected && <CheckCircle size={10} style={{ color: domain.color, flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Title */}
        <div>
          <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">
            Title * <span className="text-[#7A8FA6] font-normal">({form.title.length}/80)</span>
          </label>
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
            {onToggleVoice && (
              <div className="flex items-center gap-2">
                <button onClick={onToggleVoice}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-[10px] font-semibold transition-all"
                  style={{ background: listening ? '#FEE2E2' : '#F0F2F7', color: listening ? '#DC2626' : '#3D5068' }}>
                  {listening ? <><MicOff size={12} /> Recording...</> : <><Mic size={12} /> Voice Input</>}
                </button>
                <div className="relative">
                  <select
                    value={lang}
                    onChange={e => onLanguageChange?.(e.target.value as 'en-IN' | 'gu-IN' | 'hi-IN')}
                    className="px-2.5 py-1 border-2 border-[#DDE3EE] rounded-[6px] text-[9px] outline-none focus:border-[#F4811F] appearance-none bg-white pr-6"
                  >
                    <option value="en-IN">🇬🇧 EN</option>
                    <option value="gu-IN">🇮🇳 GU</option>
                    <option value="hi-IN">🇮🇳 HI</option>
                  </select>
                  <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#7A8FA6] pointer-events-none" />
                </div>
              </div>
            )}
          </div>
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            rows={4}
            placeholder="Explain the issue in detail. When did it start? Who is affected?"
            className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F] resize-none"
            style={listening ? { borderColor: '#DC2626', background: '#FFF5F5' } : {}}
          />
          {listening && (
            <p className="text-[10px] text-[#DC2626] mt-0.5 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Listening... speak now ({lang.split('-')[0]})
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-semibold text-[#3D5068]">Location *</label>
            {onDetectLocation && (
              <button onClick={onDetectLocation} disabled={detecting}
                className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-[10px] font-semibold transition-all"
                style={{ background: '#E0F7FA', color: '#0891B2' }}>
                {detecting
                  ? <><span className="w-3 h-3 border border-teal-500 border-t-transparent rounded-full animate-spin" /> Detecting...</>
                  : <><Navigation size={11} /> Detect GPS</>}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-[10px] font-semibold text-[#3D5068] mb-1">District *</label>
              <div className="relative">
                <select value={form.district} onChange={e => update('district', e.target.value)}
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
                <select value={form.taluka} onChange={e => update('taluka', e.target.value)} disabled={!form.district}
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
                <select value={form.ward} onChange={e => update('ward', e.target.value)} disabled={!form.district}
                  className="w-full px-3 py-2 border-2 border-[#DDE3EE] rounded-[10px] text-[11px] outline-none focus:border-[#F4811F] appearance-none bg-white disabled:opacity-50">
                  <option value="">Select Ward</option>
                  {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
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

        {/* Documents */}
        <div className="border-t border-[#E5E7EB] pt-3">
          <label className="block text-[11px] font-semibold text-[#3D5068] mb-3 flex items-center gap-1.5">
            📎 Attach Documents
            <span className="text-[#7A8FA6] font-normal text-[10px]">(Optional but recommended)</span>
          </label>

          <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#DDE3EE] rounded-[12px] cursor-pointer hover:border-[#F4811F] hover:bg-[#FFF8F0] transition-all">
            <span className="text-[20px] mb-2">📎</span>
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
                if (onFilesChange) {
                  const newFiles = e.target.files ? Array.from(e.target.files) : [];
                  onFilesChange([...selectedFiles, ...newFiles]);
                }
              }}
              className="hidden"
            />
          </label>

          {selectedFiles.length > 0 && (
            <div className="bg-[#E0F7FA] border border-[#B2EBF2] rounded-lg p-4 mt-3 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-[#0891B2]">✓ {selectedFiles.length} file(s) selected</p>
                <button
                  onClick={() => {
                    if (onFilesChange) {
                      onFilesChange([]);
                    }
                  }}
                  className="text-[10px] text-[#0891B2] hover:text-[#01579B] font-semibold"
                >
                  Clear all
                </button>
              </div>
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#B2EBF2]">
                  <p className="text-[11px] text-[#0F1A2E] truncate flex-1">{file.name}</p>
                  <button
                    onClick={() => {
                      if (onFilesChange) {
                        onFilesChange(selectedFiles.filter((_, i) => i !== idx));
                      }
                    }}
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

      <div className="flex gap-3 mt-6 pt-4 border-t border-[#E5E7EB]">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white hover:bg-[#F4F2EE] transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 py-2.5 rounded-[10px] text-[12px] font-bold text-white transition-all hover:shadow-lg disabled:opacity-60"
          style={{ background: '#16A34A' }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            '✓ Submit Grievance'
          )}
        </button>
      </div>
    </div>
  );
}
