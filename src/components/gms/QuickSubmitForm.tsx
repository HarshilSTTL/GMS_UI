'use client';
import { useState, useRef, useCallback } from 'react';
import {
  ArrowLeft, ChevronDown, Mic, MicOff, Navigation,
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

interface QuickSubmitFormProps {
  form: GrievanceFormData;
  onFormChange: (field: string, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  listening?: boolean;
  detecting?: boolean;
  lang?: 'en-IN' | 'gu-IN' | 'hi-IN';
  onToggleVoice?: () => void;
  onDetectLocation?: () => void;
}

export function QuickSubmitForm({
  form,
  onFormChange,
  onBack,
  onSubmit,
  submitting = false,
  listening = false,
  detecting = false,
  lang = 'en-IN',
  onToggleVoice,
  onDetectLocation,
}: QuickSubmitFormProps) {
  const update = (field: string, value: string) => {
    if (field === 'district') { onFormChange('district', value); onFormChange('taluka', ''); onFormChange('ward', ''); return; }
    if (field === 'taluka') { onFormChange('taluka', value); onFormChange('ward', ''); return; }
    onFormChange(field, value);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return toast.error('Please enter a title');
    if (!form.description.trim()) return toast.error('Please describe the issue');
    if (!form.district) return toast.error('Please select a district');
    onSubmit();
  };

  return (
    <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg bg-[#F0F2F7] flex items-center justify-center hover:bg-[#DDE3EE] transition-colors"
        >
          <ArrowLeft size={16} className="text-[#3D5068]" />
        </button>
        <div>
          <h2 className="text-[14px] font-bold text-[#0E1C2F]">Quick Submit Grievance</h2>
          <p className="text-[11px] text-[#7A8FA6]">Fill all details in one page</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
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
              <button onClick={onToggleVoice}
                className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-[10px] font-semibold transition-all"
                style={{ background: listening ? '#FEE2E2' : '#F0F2F7', color: listening ? '#DC2626' : '#3D5068' }}>
                {listening ? <><MicOff size={12} /> Recording...</> : <><Mic size={12} /> Voice Input</>}
              </button>
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
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={onBack} className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white">Back</button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 py-2.5 rounded-[10px] text-[12px] font-bold text-white disabled:opacity-60"
          style={{ background: '#16A34A' }}>
          {submitting
            ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</span>
            : 'Submit Grievance'}
        </button>
      </div>
    </div>
  );
}
