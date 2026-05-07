import React from 'react';
import { cn } from '@/lib/utils';
import { KPIData } from '@/types';

interface KPICardProps {
  data: KPIData;
  className?: string;
}

const trendClasses = {
  up: 'text-green-600',
  down: 'text-red-600',
  warn: 'text-amber-600',
  neutral: 'text-[#7A8FA6]',
};

export function KPICard({ data, className }: KPICardProps) {
  return (
    <div className={cn(
      'bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3.5 relative overflow-hidden',
      'shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]',
      className
    )}>
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]"
        style={{ background: data.accentColor }}
      />
      <div className="text-[10px] font-semibold text-[#7A8FA6] uppercase tracking-wide mb-2">
        {data.label}
      </div>
      <div className="text-[26px] font-bold text-[#0E1C2F] leading-none">
        {data.value}
      </div>
      {data.trend && (
        <div className={cn('text-[10px] mt-1.5', trendClasses[data.trendType ?? 'neutral'])}>
          {data.trend}
        </div>
      )}
    </div>
  );
}
