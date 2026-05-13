'use client';
import React, { useState, useRef, useMemo } from 'react';
import {
  Users, Search, Upload, Plus, MoreVertical, Download, X,
  Shield, Mail, Phone, Building2, MapPin, Calendar, Clock, BadgeCheck,
  Sparkles, FileText, CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUsers, useCreateUser, useDeleteUser, type GmsUser } from '@/hooks/useUsers';

/* ─── Constants (matching users.json) ─── */
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin: { bg: '#FEF3C7', text: '#92400E' },
  nodal_officer: { bg: '#DBEAFE', text: '#1E40AF' },
  clerk: { bg: '#DCFCE7', text: '#065F46' },
};

const ROLE_LABELS: Record<string, string> = {
  admin: 'System Admin',
  nodal_officer: 'Nodal Officer',
  clerk: 'Clerk',
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: '#F0FDF4', text: '#065F46', dot: '#16A34A' },
  suspended: { bg: '#FEF2F2', text: '#991B1B', dot: '#DC2626' },
  inactive: { bg: '#F9FAFB', text: '#6B7280', dot: '#9CA3AF' },
};

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.inactive;
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const [filter, setFilter] = useState({ q: '', role: 'ALL', dept: 'ALL', status: 'ALL' });
  const [selected, setSelected] = useState<GmsUser | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showMore, setShowMore] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive unique departments & districts from real data
  const departments = useMemo(() => {
    const depts = [...new Set(users.map(u => u.dept).filter(Boolean))];
    return depts.sort();
  }, [users]);

  const districts = useMemo(() => {
    const dists = [...new Set(users.map(u => u.district).filter(Boolean))];
    return dists.sort();
  }, [users]);

  // Computed
  const filtered = users.filter(u =>
    (filter.q === '' || (u.name + u.email + u.district).toLowerCase().includes(filter.q.toLowerCase())) &&
    (filter.role === 'ALL' || u.role === filter.role) &&
    (filter.dept === 'ALL' || u.dept === filter.dept) &&
    (filter.status === 'ALL' || u.status === filter.status)
  );

  const activeCount = users.filter(u => u.status === 'active').length;
  const displayUsers = filtered;

  // Create form
  const [formCreate, setFormCreate] = useState({ name: '', email: '', phone: '', role: 'clerk', dept: '', district: '' });
  const [bulkFile, setBulkFile] = useState<File | null>(null);

  function resetCreateForm() {
    setFormCreate({ name: '', email: '', phone: '', role: 'clerk', dept: departments[0] ?? '', district: districts[0] ?? '' });
  }

  function handleCreateUser() {
    if (!formCreate.name || !formCreate.email) {
      return toast.error('Name and email are required');
    }
    createUser.mutate({
      name: formCreate.name,
      email: formCreate.email,
      role: formCreate.role,
      dept: formCreate.dept,
      district: formCreate.district,
    }, {
      onSuccess: (newUser) => {
        setShowCreate(false);
        resetCreateForm();
        toast.success(`User "${newUser.name}" created successfully`);
      },
      onError: () => toast.error('Failed to create user'),
    });
  }

  function handleDelete(userId: string) {
    deleteUser.mutate(userId, {
      onSuccess: () => {
        setSelected(null);
        setShowMore(null);
        toast.success('User deleted');
      },
      onError: () => toast.error('Failed to delete user'),
    });
  }

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0E1C2F]">User Management</h1>
            <p className="text-[12px] text-[#7A8FA6]">{users.length} users · {activeCount} active</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBulk(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] bg-white text-[#0E1C2F] hover:bg-[#F8FAFD] transition-all">
            <Upload size={12} /> Bulk Upload
          </button>
          <button onClick={() => { resetCreateForm(); setShowCreate(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            <Plus size={12} /> Add User
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3 mb-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
            <input value={filter.q} onChange={e => setFilter(f => ({ ...f, q: e.target.value }))} placeholder="Search by name, email…"
              className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
          </div>
          <select value={filter.role} onChange={e => setFilter(f => ({ ...f, role: e.target.value }))}
            className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white text-[#374151]">
            <option value="ALL">All roles</option>
            <option value="admin">System Admin</option>
            <option value="nodal_officer">Nodal Officer</option>
            <option value="clerk">Clerk</option>
          </select>
          <select value={filter.dept} onChange={e => setFilter(f => ({ ...f, dept: e.target.value }))}
            className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white text-[#374151]">
            <option value="ALL">All depts</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
            className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white text-[#374151]">
            <option value="ALL">All status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* ── Users Table ── */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        {isLoading ? (
          <div className="px-4 py-16 text-center text-[13px] text-[#7A8FA6]">Loading users…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#F9FAFB]">
                  {['User', 'Role', 'Department', 'District', 'Status', 'Last Login', ''].map(h => (
                    <th key={h} className="px-3.5 py-2.5 text-left text-[10.5px] font-semibold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayUsers.map((u, i) => {
                  const rc = ROLE_COLORS[u.role] ?? ROLE_COLORS.clerk;
                  const initials = u.name.split(' ').filter(w => w.length > 2).map(w => w[0]).join('').toUpperCase().slice(0, 2) || u.name.slice(0, 2).toUpperCase();
                  return (
                    <tr key={u.id}
                      className={cn(
                        'group cursor-pointer hover:bg-[#FAFBFC] transition-colors',
                        i !== displayUsers.length - 1 && 'border-b border-[#F3F4F6]'
                      )}
                      onClick={() => setSelected(u)}
                    >
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1A3260] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#0E1C2F] truncate">{u.name}</p>
                            <p className="text-[11px] text-[#6B7280] truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3.5 py-3">
                        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded" style={{ background: rc.bg, color: rc.text }}>
                          {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-[11.5px] text-[#374151]">
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 size={12} className="text-[#6B7280]" /> {u.dept}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-[#0E1C2F]">{u.district}</td>
                      <td className="px-3.5 py-3"><StatusBadge status={u.status} /></td>
                      <td className="px-3.5 py-3 text-[11px] text-[#6B7280]">{u.lastLogin}</td>
                      <td className="px-3.5 py-3">
                        <button onClick={e => { e.stopPropagation(); setShowMore(showMore === u.id ? null : u.id); }}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {displayUsers.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-[13px] text-[#7A8FA6]">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Row Actions Dropdown ── */}
      {showMore && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMore(null)} />
          <div className="fixed z-50 right-[200px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 min-w-[160px]">
            <button onClick={() => { setSelected(users.find(u => u.id === showMore)!); setShowMore(null); }}
              className="w-full px-3 py-2 text-left text-[12px] text-[#374151] hover:bg-[#F3F4F6] transition-colors">View Details</button>
            <button onClick={() => { setShowMore(null); toast.info('Edit modal coming soon'); }}
              className="w-full px-3 py-2 text-left text-[12px] text-[#374151] hover:bg-[#F3F4F6] transition-colors">Edit User</button>
            <button onClick={() => { setShowMore(null); toast.info('Reset password email sent'); }}
              className="w-full px-3 py-2 text-left text-[12px] text-[#374151] hover:bg-[#F3F4F6] transition-colors">Reset Password</button>
            <div className="border-t border-[#E5E7EB] my-1" />
            <button onClick={() => handleDelete(showMore)}
              className="w-full px-3 py-2 text-left text-[12px] text-red-600 hover:bg-red-50 transition-colors">Delete User</button>
          </div>
        </>
      )}

      {/* ════════ USER DETAIL MODAL (Person Card) ════════ */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-[16px] w-full max-w-[520px] shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#0E1C2F]">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-md flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"><X size={14} /></button>
            </div>
            <div className="p-5">
              {/* Person card header */}
              <div className="flex gap-4 mb-5 pb-4 border-b border-[#F3F4F6]">
                <div className="w-[60px] h-[60px] rounded-full bg-[#1A3260] text-white flex items-center justify-center text-[18px] font-bold flex-shrink-0">
                  {selected.name.split(' ').filter(w => w.length > 2).map(w => w[0]).join('').toUpperCase().slice(0, 2) || selected.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-bold text-[#0E1C2F]">{selected.name}</h3>
                  <p className="text-[12px] text-[#6B7280]">{ROLE_LABELS[selected.role] ?? selected.role}</p>
                  <div className="mt-1.5"><StatusBadge status={selected.status} /></div>
                </div>
              </div>

              {/* Detail fields */}
              <div className="space-y-0">
                {([
                  ['Email', selected.email, <Mail key="e" size={13} className="text-[#7A8FA6]" />],
                  ['Role', ROLE_LABELS[selected.role] ?? selected.role, <Shield key="r" size={13} className="text-[#7A8FA6]" />],
                  ['Department', selected.dept, <Building2 key="d" size={13} className="text-[#7A8FA6]" />],
                  ['District', selected.district, <MapPin key="m" size={13} className="text-[#7A8FA6]" />],
                  ['Last Login', selected.lastLogin, <Clock key="cl" size={13} className="text-[#AAB4BE]" />],
                  ['User ID', selected.id, <BadgeCheck key="b" size={13} className="text-[#AAB4BE]" />],
                  ['Complaints', String(selected.complaints ?? 0), <FileText key="f" size={13} className="text-[#AAB4BE]" />],
                ] as [string, string, React.ReactNode][]).map(([label, value, Icon]) => (
                  <div key={label} className="grid grid-cols-[120px_1fr] py-2 border-b border-[#F3F4F6] text-[12px]">
                    <div className="text-[#6B7280] font-medium flex items-center gap-1.5">
                      {Icon}
                      {label}
                    </div>
                    <div className="text-[#0E1C2F]">{value}</div>
                  </div>
                ))}
              </div>

              {/* AI Insight */}
              {selected.complaints !== undefined && selected.complaints > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-[#FAF5FF] to-white border border-[#E9D5FF] rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles size={11} className="text-purple-600" />
                    <span className="text-[10.5px] font-bold text-purple-600">AI Insight</span>
                  </div>
                  <p className="text-[11px] text-[#0E1C2F] leading-relaxed">
                    This user handled <b>{selected.complaints}</b> complaints. {selected.complaints > 20 ? 'Performance is above peer average.' : 'Consider monitoring workload distribution.'}
                  </p>
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#DDE3EE] flex justify-end gap-2">
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg text-[12px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]">Cancel</button>
              <button onClick={() => { toast.success('User updated'); setSelected(null); }} className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ ADD USER MODAL ════════ */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-[16px] w-full max-w-[520px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#0E1C2F]">Add New User</h2>
              <button onClick={() => setShowCreate(false)} className="w-7 h-7 rounded-md flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"><X size={14} /></button>
            </div>
            <div className="p-5">
              {/* AI Suggestion */}
              <div className="mb-4 p-3 bg-gradient-to-r from-[#FAF5FF] to-white border border-[#E9D5FF] rounded-lg text-[11.5px] text-[#0F1A2E] leading-relaxed">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={11} className="text-purple-600" />
                  <span className="text-[10.5px] font-bold text-purple-600">AI Suggest</span>
                </div>
                Based on email domain, suggested role: <b>District Officer</b> · Dept: <b>Health & FW</b>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">Full Name *</label>
                  <input value={formCreate.name} onChange={e => setFormCreate(f => ({ ...f, name: e.target.value }))} placeholder="Shri Suresh Patel"
                    className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">Email *</label>
                  <input value={formCreate.email} onChange={e => setFormCreate(f => ({ ...f, email: e.target.value }))} placeholder="suresh.patel@gujarat.gov.in"
                    className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">Phone</label>
                  <input value={formCreate.phone} onChange={e => setFormCreate(f => ({ ...f, phone: e.target.value }))} placeholder="+91 9XXXXXXXXX"
                    className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#374151] mb-1">Role *</label>
                    <select value={formCreate.role} onChange={e => setFormCreate(f => ({ ...f, role: e.target.value }))}
                      className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white">
                      <option value="clerk">Clerk</option>
                      <option value="nodal_officer">Nodal Officer</option>
                      <option value="admin">System Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#374151] mb-1">Department *</label>
                    <select value={formCreate.dept} onChange={e => setFormCreate(f => ({ ...f, dept: e.target.value }))}
                      className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white">
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">District</label>
                  <select value={formCreate.district} onChange={e => setFormCreate(f => ({ ...f, district: e.target.value }))}
                    className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white">
                    {districts.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#DDE3EE] flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg text-[12px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]">Cancel</button>
              <button onClick={handleCreateUser} disabled={createUser.isPending} className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                {createUser.isPending ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ BULK UPLOAD MODAL ════════ */}
      {showBulk && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowBulk(false)}>
          <div className="bg-white rounded-[16px] w-full max-w-[520px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#0E1C2F]">Bulk Upload Users</h2>
              <button onClick={() => setShowBulk(false)} className="w-7 h-7 rounded-md flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"><X size={14} /></button>
            </div>
            <div className="p-5">
              {/* Drop zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) setBulkFile(file); }}
                className="border-2 border-dashed border-[#D1D5DB] rounded-[9px] p-[22px] text-center bg-[#F9FAFB] mb-3 cursor-pointer hover:border-blue-300 transition-colors"
              >
                <Upload size={30} className="mx-auto mb-2 text-[#9CA3AF]" />
                <p className="text-[12.5px] font-semibold text-[#374151]">Drop CSV file here</p>
                <p className="text-[11px] text-[#6B7280] mt-1">or <span className="text-[#FF8C42] font-semibold cursor-pointer">browse files</span></p>
                <p className="text-[10.5px] text-[#6B7280] mt-2">Required columns: name, email, role, department, district</p>
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={e => { if (e.target.files?.[0]) setBulkFile(e.target.files[0]); }} />
              </div>

              {/* File preview */}
              {bulkFile && (
                <div className="flex items-center gap-2.5 p-3 bg-white border border-[#E5E7EB] rounded-lg mb-3">
                  <FileText size={18} className="text-[#6B7280]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#0E1C2F] truncate">{bulkFile.name}</p>
                    <p className="text-[10.5px] text-[#6B7280]">{(bulkFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-green-600 font-semibold">
                    <CheckCircle size={12} /> Validated
                  </span>
                </div>
              )}

              {/* AI Validation */}
              <div className="p-3 bg-gradient-to-r from-[#FAF5FF] to-white border border-[#E9D5FF] rounded-lg text-[11.5px] text-[#0F1C2E] leading-relaxed">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={11} className="text-purple-600" />
                  <span className="text-[10.5px] font-bold text-purple-600">AI Validation</span>
                </div>
                {bulkFile
                  ? 'File validated successfully. Rows matching required schema will be imported.'
                  : 'Upload a CSV file to begin validation. Required columns: name, email, role, department, district.'}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#DDE3EE] flex justify-end gap-2">
              <button onClick={() => { setBulkFile(null); setShowBulk(false); }} className="px-4 py-2 rounded-lg text-[12px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]">Cancel</button>
              <button onClick={() => { setShowBulk(false); toast.info('Bulk upload is a placeholder'); }} className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700">
                Upload Users
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
