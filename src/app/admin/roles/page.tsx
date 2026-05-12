'use client';
import React, { useState } from 'react';
import {
  Shield, Folder, Users, Building2, MapPin, BarChart3, Clock,
  Settings, Workflow, Bell, Bot, Globe2, ScrollText, Plus,
  Download, Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRoles, useUpdateRolePermissions, type GmsRole } from '@/hooks/useRoles';

const MODULE_ICONS: Record<string, React.ElementType> = {
  dashboard: BarChart3,
  users: Users,
  roles: Shield,
  hierarchy: Building2,
  categories: Folder,
  sla: Clock,
  workflow: Workflow,
  notif: Bell,
  ai: Bot,
  master: Globe2,
  audit: ScrollText,
};

const LEVEL_LABELS: Record<string, string> = {
  view: 'View',
  edit: 'Edit',
  approve: 'Approve',
  delete: 'Delete',
};

function PermCheckbox({ checked, color, onChange }: { checked: boolean; color: string; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        'relative w-[18px] h-[18px] rounded-[5px] border-[1.5px] transition-all duration-150 inline-flex items-center justify-center flex-shrink-0',
        checked ? 'border-transparent' : 'border-[#CBD5E1] bg-white hover:border-[#374151] hover:bg-[#F8FAFC]'
      )}
      style={checked ? { background: color } : undefined}
    >
      <svg className={cn('w-[11px] h-[11px] text-white transition-all duration-150', checked ? 'opacity-100 scale-100' : 'opacity-0 scale-40')} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3.5 8.5 6.8 11.5 12.5 5" />
      </svg>
    </button>
  );
}

export default function AdminRolesPage() {
  const { data: roles = [], isLoading } = useRoles();
  const updatePerms = useUpdateRolePermissions();
  const [selectedId, setSelectedId] = useState<string>('');
  const [localPerms, setLocalPerms] = useState<Record<string, string[]>>({});

  const selected = roles.find(r => r.id === selectedId) ?? roles[0];

  React.useEffect(() => {
    if (roles.length > 0 && !selectedId) setSelectedId(roles[0].id);
  }, [roles, selectedId]);

  React.useEffect(() => {
    if (selected) {
      const map: Record<string, string[]> = {};
      selected.permissions.forEach(p => { map[p.code] = [...p.levels]; });
      setLocalPerms(map);
    }
  }, [selected]);

  function handleToggle(modCode: string, level: string) {
    if (!selected || selected.protected) {
      return toast.info('Protected role permissions cannot be modified');
    }
    setLocalPerms(prev => {
      const current = prev[modCode] ?? [];
      const next = current.includes(level) ? current.filter(l => l !== level) : [...current, level];
      return { ...prev, [modCode]: next };
    });
  }

  function handleSave() {
    if (!selected || selected.protected) return;
    const permissions = selected.permissions.map(p => ({
      ...p,
      levels: localPerms[p.code] ?? p.levels,
    }));
    updatePerms.mutate({ id: selected.id, permissions }, {
      onSuccess: () => toast.success(`${selected.label} permissions saved`),
      onError: () => toast.error('Failed to save'),
    });
  }

  if (isLoading) {
    return <div className="px-4 py-16 text-center text-[13px] text-[#7A8FA6]">Loading roles…</div>;
  }

  const permLevels = ['view', 'edit', 'approve', 'delete'];

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Shield size={20} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0E1C2F]">Roles & Permissions</h1>
            <p className="text-[12px] text-[#7A8FA6]">{roles.length} system roles · {roles.reduce((s, r) => s + r.permissions.reduce((a, p) => a + p.levels.length, 0), 0)} total permissions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.info('Export coming soon')} className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] bg-white text-[#0E1C2F] hover:bg-[#F8FAFD] transition-all">
            <Download size={12} /> Export
          </button>
          <button onClick={() => toast.info('New role coming soon')} className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            <Plus size={12} /> New Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
        {/* Role list */}
        <div className="space-y-2">
          {roles.map(r => {
            const permCount = r.permissions.reduce((s, p) => s + p.levels.length, 0);
            return (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={cn(
                  'w-full text-left p-3 rounded-[12px] border transition-all',
                  selected?.id === r.id ? 'border-blue-400 bg-blue-50' : 'border-[#DDE3EE] bg-white hover:border-[#BCC9D9]'
                )}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: r.bg, color: r.color }}>{r.label}</span>
                  {r.protected && <span className="text-[9px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-px rounded-full border border-purple-200">Protected</span>}
                </div>
                <p className="text-[10px] text-[#7A8FA6] line-clamp-2">{r.description}</p>
                <p className="text-[9.5px] text-[#7A8FA6] mt-1">{permCount} permissions</p>
              </button>
            );
          })}
        </div>

        {/* Permissions panel */}
        {selected && (
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: selected.bg }}>
                <Shield size={18} style={{ color: selected.color }} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#0E1C2F]">{selected.label}</div>
                <p className="text-[11px] text-[#7A8FA6]">Tap any cell to grant/revoke</p>
              </div>
              {selected.protected && (
                <span className="ml-auto text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Protected</span>
              )}
            </div>
            <p className="text-[11px] text-[#7A8FA6] mb-4">{selected.description}</p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#F9FAFB]">
                    <th className="px-4 py-2.5 text-left text-[10.5px] font-semibold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB]">Module</th>
                    {permLevels.map(lvl => (
                      <th key={lvl} className="px-3 py-2.5 text-center text-[10.5px] font-semibold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB]">{LEVEL_LABELS[lvl]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selected.permissions.map(mod => {
                    const Icon = MODULE_ICONS[mod.code] ?? Settings;
                    const levels = localPerms[mod.code] ?? mod.levels;
                    return (
                      <tr key={mod.code} className="border-b border-[#F3F4F6]">
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-2">
                            <Icon size={13} className="text-[#6B7280]" />
                            <span className="font-semibold text-[#0E1C2F]">{mod.module}</span>
                          </span>
                        </td>
                        {permLevels.map(lvl => {
                          const has = levels.includes(lvl);
                          return (
                            <td key={lvl} className="px-3 py-2.5 text-center">
                              <PermCheckbox checked={has} color={selected.color} onChange={() => handleToggle(mod.code, lvl)} />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 pt-4 border-t border-[#DDE3EE] flex justify-end gap-2">
              <button onClick={() => {
                const map: Record<string, string[]> = {};
                selected.permissions.forEach(p => { map[p.code] = [...p.levels]; });
                setLocalPerms(map);
                toast.info('Permissions reset to default');
              }} className="px-4 py-2 rounded-lg text-[12px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]">
                Reset to Default
              </button>
              <button onClick={handleSave} disabled={selected.protected || updatePerms.isPending} className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                {updatePerms.isPending ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
