'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FileComplaint = dynamic(() => import('../file-complaint/page').then(mod => ({ default: mod.default })), { ssr: false });
const Submit = dynamic(() => import('../submit/page').then(mod => ({ default: mod.default })), { ssr: false });

type Tab = 'step-by-step' | 'quick-submit';

export default function GrievancePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('step-by-step');

  return (
    <div className="min-h-screen bg-[#F0F2F7]">
      {/* Header */}
      <div className="bg-white border-b border-[#DDE3EE] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => router.back()} className="w-8 h-8 rounded-lg bg-[#F0F2F7] flex items-center justify-center hover:bg-[#DDE3EE] transition-colors">
              <ChevronLeft size={18} className="text-[#3D5068]" />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-[#0E1C2F]">File a New Grievance</h1>
              <p className="text-[12px] text-[#7A8FA6]">Choose your preferred method to submit a complaint</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#DDE3EE]">
            <button
              onClick={() => setActiveTab('step-by-step')}
              className={`px-6 py-3 text-[13px] font-semibold border-b-2 transition-all ${
                activeTab === 'step-by-step'
                  ? 'border-[#F4811F] text-[#F4811F]'
                  : 'border-transparent text-[#7A8FA6] hover:text-[#3D5068]'
              }`}
            >
              📋 Step by Step
            </button>
            <button
              onClick={() => setActiveTab('quick-submit')}
              className={`px-6 py-3 text-[13px] font-semibold border-b-2 transition-all ${
                activeTab === 'quick-submit'
                  ? 'border-[#F4811F] text-[#F4811F]'
                  : 'border-transparent text-[#7A8FA6] hover:text-[#3D5068]'
              }`}
            >
              ⚡ Quick Submit
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'step-by-step' && (
          <div className="animate-fadeIn">
            <div className="bg-blue-50 border border-blue-200 rounded-[14px] p-4 mb-6 flex gap-3">
              <span className="text-[20px] flex-shrink-0">📋</span>
              <div>
                <p className="text-[13px] font-bold text-blue-900">Detailed Form</p>
                <p className="text-[11px] text-blue-700">Select category, add details, attach documents, and submit in organized steps</p>
              </div>
            </div>
            <FileComplaint />
          </div>
        )}

        {activeTab === 'quick-submit' && (
          <div className="animate-fadeIn">
            <div className="bg-amber-50 border border-amber-200 rounded-[14px] p-4 mb-6 flex gap-3">
              <span className="text-[20px] flex-shrink-0">⚡</span>
              <div>
                <p className="text-[13px] font-bold text-amber-900">Quick & Easy</p>
                <p className="text-[11px] text-amber-700">Fast submission with streamlined form - perfect when you're in a hurry</p>
              </div>
            </div>
            <Submit />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
