'use client';
import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

const ROLES = [
  {
    id: 'r1', name: 'nodal_officer', label: 'Nodal Officer', color: '#1A56C4', bg: '#DBEAFE',
    description: 'Department-level officer responsible for handling and resolving complaints.',
    permissions: {
      'View complaints': true, 'Assign complaints': true, 'Update complaint status': true,
      'Resolve complaints': true, 'Escalate complaints': true, 'Bulk operations': false,
      'View reports': true, 'Export data': false, 'Manage users': false,
      'View CM dashboard': false, 'System settings': false,
    },
  },
  {
    id: 'r2', name: 'clerk', label: 'Clerk / Data Entry', color: '#065F46', bg: '#D1FAE5',
    description: 'Data entry operator for filing new complaints and basic status updates.',
    permissions: {
      'View complaints': true, 'Assign complaints': false, 'Update complaint status': true,
      'Resolve complaints': false, 'Escalate complaints': false, 'Bulk operations': false,
      'View reports': false, 'Export data': false, 'Manage users': false,
      'View CM dashboard': false, 'System settings': false,
    },
  },
  {
    id: 'r3', name: 'cm', label: 'CM / State Official', color: '#92400E', bg: '#FEF3C7',
    description: 'Chief Minister office — state-wide overview, critical alerts, and AI action board.',
    permissions: {
      'View complaints': true, 'Assign complaints': false, 'Update complaint status': false,
      'Resolve complaints': false, 'Escalate complaints': true, 'Bulk operations': false,
      'View reports': true, 'Export data': true, 'Manage users': false,
      'View CM dashboard': true, 'System settings': false,
    },
  },
  {
    id: 'r4', name: 'admin', label: 'System Administrator', color: '#5B21B6', bg: '#EDE9FE',
    description: 'Full system access — user management, configuration, all dashboards.',
    permissions: {
      'View complaints': true, 'Assign complaints': true, 'Update complaint status': true,
      'Resolve complaints': true, 'Escalate complaints': true, 'Bulk operations': true,
      'View reports': true, 'Export data': true, 'Manage users': true,
      'View CM dashboard': true, 'System settings': true,
    },
  },
];

const PERMISSION_GROUPS = [
  { label: 'Complaint Operations', keys: ['View complaints', 'Assign complaints', 'Update complaint status', 'Resolve complaints', 'Escalate complaints', 'Bulk operations'] },
  { label: 'Data & Reports', keys: ['View reports', 'Export data'] },
  { label: 'Administration', keys: ['Manage users', 'View CM dashboard', 'System settings'] },
];

export default function AdminRolesPage() {
  const [selected, setSelected] = useState(ROLES[0].id);
  const role = ROLES.find(r => r.id === selected)!;

  function handleToggle(perm: string) {
    if (role.name === 'admin') return toast.info('Admin role permissions cannot be modified');
    toast.success(`Permission "${perm}" toggled for ${role.label}`);
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Shield size={20} className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Roles & Permissions</h1>
          <p className="text-[12px] text-[#7A8FA6]">{ROLES.length} system roles · Configure access control</p>
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr] gap-4">
        {/* Role list */}
        <div className="space-y-2">
          {ROLES.map(r => (
            <button
              key={r.id}
              onClick={() => setSelected(r.id)}
              className={`w-full text-left p-3 rounded-[12px] border transition-all ${selected === r.id ? 'border-blue-400 bg-blue-50' : 'border-[#DDE3EE] bg-white hover:border-[#BCC9D9]'}`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: r.bg, color: r.color }}>{r.label}</span>
              </div>
              <p className="text-[10px] text-[#7A8FA6] line-clamp-2">{r.description}</p>
            </button>
          ))}
        </div>

        {/* Permissions panel */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[14px] font-bold text-[#0E1C2F]">{role.label}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: role.bg, color: role.color }}>{role.name}</span>
            {role.name === 'admin' && <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Protected</span>}
          </div>
          <p className="text-[11px] text-[#7A8FA6] mb-4">{role.description}</p>

          <div className="space-y-4">
            {PERMISSION_GROUPS.map(group => (
              <div key={group.label}>
                <p className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wider mb-2">{group.label}</p>
                <div className="space-y-2">
                  {group.keys.map(perm => {
                    const enabled = role.permissions[perm as keyof typeof role.permissions];
                    return (
                      <div key={perm} className="flex items-center justify-between py-2 px-3 rounded-[8px] bg-[#F8FAFD] border border-[#EDF1F7]">
                        <span className="text-[12px] text-[#3D5068]">{perm}</span>
                        <button
                          onClick={() => handleToggle(perm)}
                          className={`relative w-9 h-5 rounded-full transition-all ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${enabled ? 'left-[18px]' : 'left-0.5'}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-[#DDE3EE] flex justify-end gap-2">
            <button className="px-4 py-2 rounded-[8px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-gray-50">
              Reset to Default
            </button>
            <button onClick={() => toast.success(`${role.label} permissions saved`)} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
