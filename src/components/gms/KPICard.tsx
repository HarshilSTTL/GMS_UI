'use client';
import React from 'react';
import Link from 'next/link';
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

const inner = (data: KPIData, className?: string) => (
  <div className={cn(
    'bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3.5 relative overflow-hidden',
    'shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)]',
    data.href && 'hover:shadow-[0_4px_16px_rgba(14,28,47,0.14)] hover:border-[#C8D0DE] transition-all',
    className
  )}>
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
    {data.href && (
      <div className="text-[9px] font-semibold text-[#7A8FA6] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        View →
      </div>
    )}
  </div>
);

export function KPICard({ data, className }: KPICardProps) {
  if (data.href) {
    return (
      <Link href={data.href} className="group block">
        {inner(data, className)}
      </Link>
    );
  }
  return inner(data, className);
}
