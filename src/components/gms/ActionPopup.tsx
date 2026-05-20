'use client';
import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Send, ArrowUpRight, RotateCcw, Eye, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ActionPopupType =
  | 'resolve'
  | 'escalate'
  | 'acknowledge'
  | 'reassign'
  | 'send_update'
  | 'forward'
  | 'reopen'
  | 'error';

export interface ActionPopupData {
  type: ActionPopupType;
  token?: string;
  title: string;
  description: string;
  meta?: { label: string; value: string }[];
}

const CONFIG: Record<ActionPopupType, {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  headerBg: string;
  btnBg: string;
  btnHover: string;
}> = {
  resolve: {
    icon: <CheckCircle size={28} />,
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    borderColor: '#BBF7D0',
    headerBg: '#F0FDF4',
    btnBg: '#16A34A',
    btnHover: '#15803D',
  },
  escalate: {
    icon: <AlertTriangle size={28} />,
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    borderColor: '#FECACA',
    headerBg: '#FEF2F2',
    btnBg: '#DC2626',
    btnHover: '#B91C1C',
  },
  acknowledge: {
    icon: <span className="text-[22px]">✋</span>,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    borderColor: '#FDE68A',
    headerBg: '#FFFBEB',
    btnBg: '#D97706',
    btnHover: '#B45309',
  },
  reassign: {
    icon: <ArrowUpRight size={28} />,
    iconBg: '#FFEDD5',
    iconColor: '#EA580C',
    borderColor: '#FED7AA',
    headerBg: '#FFF7ED',
    btnBg: '#EA580C',
    btnHover: '#C2410C',
  },
  send_update: {
    icon: <Send size={24} />,
    iconBg: '#DBEAFE',
    iconColor: '#1D4ED8',
    borderColor: '#BFDBFE',
    headerBg: '#EFF6FF',
    btnBg: '#1D4ED8',
    btnHover: '#1E40AF',
  },
  forward: {
    icon: <ArrowUpRight size={28} />,
    iconBg: '#EDE9FE',
    iconColor: '#7C3AED',
    borderColor: '#DDD6FE',
    headerBg: '#F5F3FF',
    btnBg: '#7C3AED',
    btnHover: '#6D28D9',
  },
  reopen: {
    icon: <RotateCcw size={26} />,
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    borderColor: '#FECACA',
    headerBg: '#FEF2F2',
    btnBg: '#DC2626',
    btnHover: '#B91C1C',
  },
  error: {
    icon: <X size={28} />,
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    borderColor: '#FECACA',
    headerBg: '#FEF2F2',
    btnBg: '#DC2626',
    btnHover: '#B91C1C',
  },
};

interface Props {
  data: ActionPopupData;
  onClose: () => void;
}

export function ActionPopup({ data, onClose }: Props) {
  const cfg = CONFIG[data.type];

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(14,28,47,0.55)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[18px] w-full max-w-[420px] shadow-[0_8px_40px_rgba(14,28,47,0.22)] overflow-hidden"
        style={{ border: `1.5px solid ${cfg.borderColor}` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header stripe */}
        <div
          className="px-6 pt-8 pb-5 flex flex-col items-center text-center"
          style={{ background: cfg.headerBg }}
        >
          {/* Icon circle */}
          <div
            className="w-[68px] h-[68px] rounded-full flex items-center justify-center mb-4 shadow-sm"
            style={{ background: cfg.iconBg, color: cfg.iconColor }}
          >
            {cfg.icon}
          </div>

          <h2 className="text-[18px] font-bold text-[#0E1C2F] leading-tight mb-1.5">
            {data.title}
          </h2>
          <p className="text-[13px] text-[#3D5068] leading-relaxed max-w-[320px]">
            {data.description}
          </p>
        </div>

        {/* Meta info */}
        {(data.token || (data.meta && data.meta.length > 0)) && (
          <div className="px-6 py-4 border-y border-[#DDE3EE]">
            {data.token && (
              <div className="flex items-center justify-between py-1.5 border-b border-[#F0F2F7] last:border-0">
                <span className="text-[11px] font-semibold text-[#7A8FA6] uppercase tracking-wide">
                  Grievance Token
                </span>
                <span className="text-[12px] font-bold text-blue-600 font-mono">
                  {data.token}
                </span>
              </div>
            )}
            {data.meta?.map(item => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-[#F0F2F7] last:border-0">
                <span className="text-[11px] font-semibold text-[#7A8FA6] uppercase tracking-wide">
                  {item.label}
                </span>
                <span className="text-[12px] font-semibold text-[#0E1C2F]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-[9px] text-[13px] font-semibold text-white transition-all shadow-sm"
            style={{ background: cfg.btnBg }}
            onMouseOver={e => (e.currentTarget.style.background = cfg.btnHover)}
            onMouseOut={e => (e.currentTarget.style.background = cfg.btnBg)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
