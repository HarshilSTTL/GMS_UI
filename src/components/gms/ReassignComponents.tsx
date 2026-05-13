'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { DEPT_ICONS } from '@/components/gms/ComplaintModals';
import type { Officer } from '@/types';

/* ═══════════════════════════════════════════════════════════════════════════
   REUSABLE: DEPARTMENT SELECTOR GRID
   Used in: Reassign page, ReassignDialog
   ═══════════════════════════════════════════════════════════════════════════ */
export function DepartmentSelector({
  departments,
  selected,
  onSelect,
  excludeDept,
  className,
}: {
  departments: { id: string; name: string; full: string }[];
  selected: string;
  onSelect: (name: string) => void;
  excludeDept?: string;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {departments
        .filter(d => d.name !== excludeDept)
        .map(dept => (
          <button
            key={dept.id}
            onClick={() => onSelect(dept.name)}
            className={cn(
              'flex items-center gap-2 px-3 py-2.5 border rounded-[8px] text-left transition-all',
              selected === dept.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-[#DDE3EE] bg-[#F0F2F7] hover:border-blue-300 hover:bg-blue-50'
            )}
          >
            <span className="text-lg flex-shrink-0">{DEPT_ICONS[dept.name] || '🏛'}</span>
            <div>
              <div className="text-[12px] font-semibold text-[#0E1C2F]">{dept.name}</div>
              <div className="text-[10px] text-[#7A8FA6]">{dept.full}</div>
            </div>
          </button>
        ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REUSABLE: OFFICER SELECTOR LIST
   Used in: Reassign page, ReassignDialog, Team page detail
   ═══════════════════════════════════════════════════════════════════════════ */
export function OfficerSelector({
  officers,
  selected,
  onSelect,
  showLoadCount,
  className,
}: {
  officers: Officer[];
  selected: string;
  onSelect: (id: string) => void;
  showLoadCount?: (o: Officer) => string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5 max-h-[240px] overflow-y-auto', className)}>
      {officers.length === 0 ? (
        <div className="text-[12px] text-[#7A8FA6] italic py-3 text-center">No officers available</div>
      ) : (
        officers.map(o => (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2.5 border rounded-[8px] text-left transition-all',
              selected === o.id
                ? 'border-green-500 bg-green-50'
                : 'border-[#DDE3EE] bg-[#F0F2F7] hover:border-green-300 hover:bg-green-50'
            )}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
              style={{ backgroundColor: o.color + '20', color: o.color }}
            >
              {o.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-[#0E1C2F]">{o.name}</div>
              <div className="text-[10px] text-[#7A8FA6]">{o.role} · {o.department}</div>
            </div>
            {showLoadCount && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                {showLoadCount(o)}
              </span>
            )}
            <span
              className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0',
                o.workload === 'ok' ? 'bg-green-50 text-green-700' :
                o.workload === 'high' ? 'bg-amber-50 text-amber-700' :
                'bg-red-50 text-red-700'
              )}
            >
              {o.workload === 'ok' ? 'Normal' : o.workload === 'high' ? 'High load' : 'Overloaded'}
            </span>
          </button>
        ))
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REUSABLE: SECTION CARD (detail-card styling from HTML)
   Used everywhere for consistent card layout
   ═══════════════════════════════════════════════════════════════════════════ */
export function SectionCard({
  title,
  rightElement,
  children,
  className,
  noBodyPadding,
}: {
  title: string;
  rightElement?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noBodyPadding?: boolean;
}) {
  return (
    <div className={cn('bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.06)]', className)}>
      <div className="px-4 py-3 border-b border-[#DDE3EE] flex items-center justify-between">
        <span className="text-[12px] font-bold text-[#0E1C2F]">{title}</span>
        {rightElement}
      </div>
      <div className={noBodyPadding ? '' : 'p-4'}>{children}</div>
    </div>
  );
}
