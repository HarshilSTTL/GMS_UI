'use client';
import React, { useState } from 'react';
import { Users, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useUsers, useCreateUser, useUpdateUser, type GmsUser } from '@/hooks/useUsers';

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin: { bg: '#EDE9FE', text: '#5B21B6' },
  nodal_officer: { bg: '#DBEAFE', text: '#1E40AF' },
  clerk: { bg: '#D1FAE5', text: '#065F46' },
  cm: { bg: '#FEF3C7', text: '#92400E' },
};

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: '#F0FDF4', text: '#065F46', dot: '#16A34A' },
  inactive: { bg: '#F9FAFB', text: '#6B7280', dot: '#9CA3AF' },
  suspended: { bg: '#FEF2F2', text: '#991B1B', dot: '#DC2626' },
};

type ModalMode = 'add' | 'edit' | null;
type FormState = { name: string; email: string; role: string; dept: string; district: string };

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editUser, setEditUser] = useState<GmsUser | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', email: '', role: 'nodal_officer', dept: '', district: '' });

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  function openAdd() {
    setForm({ name: '', email: '', role: 'nodal_officer', dept: '', district: '' });
    setEditUser(null);
    setModalMode('add');
  }

  function openEdit(u: GmsUser) {
    setForm({ name: u.name, email: u.email, role: u.role, dept: u.dept, district: u.district });
    setEditUser(u);
    setModalMode('edit');
  }

  async function handleSave() {
    if (!form.name || !form.email) return toast.error('Name and email are required');
    try {
      if (modalMode === 'add') {
        await createUser.mutateAsync(form);
        toast.success(`User "${form.name}" created`);
      } else if (editUser) {
        await updateUser.mutateAsync({ id: editUser.id, data: form });
        toast.success(`User "${form.name}" updated`);
      }
      setModalMode(null);
    } catch {
      toast.error('Failed to save user');
    }
  }

  async function handleStatusToggle(u: GmsUser) {
    const nextStatus = u.status === 'active' ? 'suspended' : 'active';
    try {
      await updateUser.mutateAsync({ id: u.id, data: { status: nextStatus } });
      toast.success(`User ${u.name} ${nextStatus === 'active' ? 'activated' : 'suspended'}`);
    } catch {
      toast.error('Failed to update status');
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[13px] text-[#7A8FA6]">Loading users…</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0E1C2F]">User Management</h1>
            <p className="text-[12px] text-[#7A8FA6]">{users.length} total users · {users.filter(u => u.status === 'active').length} active</p>
          </div>
        </div>
        <button onClick={openAdd} className="px-4 py-2 rounded-[10px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
          + Add User
        </button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] bg-white focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'admin', 'nodal_officer', 'clerk'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border capitalize transition-all ${roleFilter === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-[#DDE3EE] text-[#3D5068]'}`}>
              {r === 'all' ? 'All Roles' : r === 'nodal_officer' ? 'Nodal Officer' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['Name', 'Email', 'Role', 'Department', 'District', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const rc = ROLE_COLORS[u.role] || ROLE_COLORS.clerk;
                const sc = STATUS_COLORS[u.status] || STATUS_COLORS.inactive;
                return (
                  <tr key={u.id} className={i !== filtered.length - 1 ? 'border-b border-[#DDE3EE]' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 flex-shrink-0">
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-[#0E1C2F]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#3D5068]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: rc.bg, color: rc.text }}>
                        {u.role === 'nodal_officer' ? 'Nodal Officer' : u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#3D5068]">{u.dept}</td>
                    <td className="px-4 py-3 text-[#3D5068]">{u.district}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
                        <span className="text-[10px] font-semibold capitalize" style={{ color: sc.text }}>{u.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#7A8FA6]">{u.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(u)} className="px-2 py-1 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all">Edit</button>
                        <button onClick={() => handleStatusToggle(u)} className={`px-2 py-1 rounded text-[10px] font-semibold transition-all border ${u.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200'}`}>
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-[#7A8FA6]">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] w-full max-w-md shadow-xl">
            <div className="px-5 py-4 border-b border-[#DDE3EE]">
              <h2 className="text-[15px] font-bold text-[#0E1C2F]">{modalMode === 'add' ? 'Add New User' : 'Edit User'}</h2>
            </div>
            <div className="p-5 space-y-3">
              {([['name', 'Full Name', 'text'], ['email', 'Email Address', 'email']] as const).map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[8px] focus:outline-none focus:border-blue-400"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Role</label>
                <select value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[8px] focus:outline-none focus:border-blue-400">
                  <option value="nodal_officer">Nodal Officer</option>
                  <option value="clerk">Clerk</option>
                  <option value="admin">Admin</option>
                  <option value="cm">CM</option>
                </select>
              </div>
              {([['dept', 'Department'], ['district', 'District']] as const).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">{label}</label>
                  <input
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[8px] focus:outline-none focus:border-blue-400"
                  />
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-[#DDE3EE] flex justify-end gap-2">
              <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSave}
                disabled={createUser.isPending || updateUser.isPending}
                className="px-4 py-2 rounded-[8px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {createUser.isPending || updateUser.isPending ? 'Saving…' : modalMode === 'add' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
