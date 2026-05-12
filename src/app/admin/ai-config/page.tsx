'use client';
import React, { useState } from 'react';
import { Zap, Brain, MessageSquareText, FileText, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  active: boolean;
  confidence: number;
  lastRun?: string;
}

const MOCK_FEATURES: AIFeature[] = [
  { id: 'ai1', name: 'Auto-Categorization', description: 'AI-powered complaint category detection based on description analysis', icon: FileText, active: true, confidence: 94, lastRun: '2 min ago' },
  { id: 'ai2', name: 'Priority Prediction', description: 'Machine learning model to predict complaint priority based on content and context', icon: Sparkles, active: true, confidence: 87, lastRun: '5 min ago' },
  { id: 'ai3', name: 'Smart Assignment', description: 'Auto-assign complaints to officers based on workload, expertise, and location', icon: Brain, active: true, confidence: 91, lastRun: '1 min ago' },
  { id: 'ai4', name: 'Duplicate Detection', description: 'Identify and group similar complaints from same area or citizen', icon: ShieldCheck, active: true, confidence: 88, lastRun: '3 min ago' },
  { id: 'ai5', name: 'Citizen Sentiment Analysis', description: 'Analyze citizen messages to detect urgency and sentiment', icon: MessageSquareText, active: false, confidence: 79, lastRun: 'Never' },
  { id: 'ai6', name: 'Resolution Suggestion', description: 'Suggest resolution steps based on historical similar complaints', icon: Sparkles, active: false, confidence: 72, lastRun: 'Never' },
];

const AI_STATS = [
  { label: 'Active Models', value: MOCK_FEATURES.filter(f => f.active).length, color: '#7C3AED' },
  { label: 'Avg Confidence', value: `${Math.round(MOCK_FEATURES.filter(f => f.active).reduce((a, f) => a + f.confidence, 0) / MOCK_FEATURES.filter(f => f.active).length)}%`, color: '#1A56C4' },
  { label: 'Auto-Assignments Today', value: 47, color: '#16A34A' },
  { label: 'Duplicates Caught', value: 12, color: '#EA580C' },
];

export default function AdminAIConfigPage() {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Zap size={20} className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">AI Configuration</h1>
          <p className="text-[12px] text-[#7A8FA6]">{MOCK_FEATURES.filter(f => f.active).length} active models · Manage AI/ML features</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {AI_STATS.map(s => (
          <div key={s.label} className="bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3 relative overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]" style={{ background: s.color }} />
            <div className="text-[10px] font-semibold text-[#7A8FA6] uppercase tracking-wide mb-1">{s.label}</div>
            <div className="text-[24px] font-bold text-[#0E1C2F]">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MOCK_FEATURES.map(feature => {
          const Icon = feature.icon;
          return (
            <div key={feature.id} className={cn('bg-white border rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]', feature.active ? 'border-[#DDE3EE]' : 'border-gray-200 opacity-60')}>
              <div className="px-5 py-3.5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', feature.active ? 'bg-purple-100' : 'bg-gray-100')}>
                      <Icon size={16} className={feature.active ? 'text-purple-600' : 'text-gray-400'} />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-[#0E1C2F]">{feature.name}</h3>
                      <p className="text-[10px] text-[#7A8FA6]">Last run: {feature.lastRun}</p>
                    </div>
                  </div>
                  <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full', feature.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                    {feature.active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-[11px] text-[#3D5068] mb-3">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-[#7A8FA6]">Confidence</span>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', feature.confidence >= 90 ? 'bg-green-500' : feature.confidence >= 80 ? 'bg-amber-500' : 'bg-red-400')}
                        style={{ width: `${feature.confidence}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-[#0E1C2F]">{feature.confidence}%</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toast.info('Configure model')} className="px-2 py-1 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">Config</button>
                    <button onClick={() => toast.info('Feature toggled')} className={cn('px-2 py-1 rounded text-[10px] font-semibold border', feature.active ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200')}>
                      {feature.active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
