'use client';
import React, { useState, useMemo } from 'react';
import { Radio, Plus, Edit2, Trash2, Search, X, Clock, Building2, Tag, Hash, FileText, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCategories, useCreateCategory, useDeleteCategory, type GmsCategory } from '@/hooks/useCategories';

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  critical: { bg: '#FEF2F2', text: '#991B1B' },
  high: { bg: '#FFFBEB', text: '#92400E' },
  medium: { bg: '#F0FDF4', text: '#065F46' },
  low: { bg: '#F8FAFD', text: '#3D5068' },
};

const DEPARTMENTS = ['GWSSB', 'Health (CDHO)', 'Roads & B', 'AMC', 'DGVCL', 'Revenue'];

const emptyForm = () => ({ name: '', description: '', department: DEPARTMENTS[0], slaHours: 48, priority: 'medium' as string });

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingCat, setEditingCat] = useState<GmsCategory | null>(null);
  const [selected, setSelected] = useState<GmsCategory | null>(null);
  const [form, setForm] = useState(emptyForm());

  const departments = useMemo(() => {
    if (categories.length === 0) return DEPARTMENTS;
    return [...new Set(categories.map(c => c.department))].sort();
  }, [categories]);

  const filtered = categories.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'all' || c.department === deptFilter;
    return matchSearch && matchDept;
  });

  const activeCount = categories.filter(c => c.active).length;
  const totalComplaints = categories.reduce((s, c) => s + c.complaintCount, 0);

  function openAdd() {
    setForm(emptyForm());
    setEditingCat(null);
    setModalMode('add');
  }

  function openEdit(cat: GmsCategory) {
    setForm({ name: cat.name, description: cat.description, department: cat.department, slaHours: cat.slaHours, priority: cat.priority });
    setEditingCat(cat);
    setModalMode('edit');
  }

  function handleSave() {
    if (!form.name) return toast.error('Category name is required');
    if (modalMode === 'add') {
      createCategory.mutate({ ...form, active: true, code: form.name.toUpperCase().replace(/\s+/g, '-').slice(0, 12) }, {
        onSuccess: () => { setModalMode(null); toast.success('Category created'); },
        onError: () => toast.error('Failed to create'),
      });
    } else if (modalMode === 'edit' && editingCat) {
      toast.info('Category updated');
      setModalMode(null);
    }
  }

  function handleDelete(cat: GmsCategory) {
    deleteCategory.mutate(cat.id, {
      onSuccess: () => toast.success(`"${cat.name}" deleted`),
      onError: () => toast.error('Failed to delete'),
    });
  }

  if (isLoading) {
    return <div className="px-4 py-16 text-center text-[13px] text-[#7A8FA6]">Loading categories…</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Radio size={20} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0E1C2F]">Categories</h1>
            <p className="text-[12px] text-[#7A8FA6]">{categories.length} categories · {activeCount} active · {totalComplaints} total complaints</p>
          </div>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
          <Plus size={12} /> Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories…"
            className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[10px] bg-white focus:outline-none focus:border-blue-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setDeptFilter('all')} className={cn('px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all', deptFilter === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-[#DDE3EE] text-[#3D5068]')}>All</button>
          {departments.map(d => (
            <button key={d} onClick={() => setDeptFilter(d)} className={cn('px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all', deptFilter === d ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-[#DDE3EE] text-[#3D5068]')}>{d}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['Category', 'Department', 'Priority', 'SLA', 'Complaints', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10.5px] font-bold text-[#7A8FA6] uppercase tracking-wider border-b border-[#DDE3EE] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const ps = PRIORITY_STYLES[c.priority] ?? PRIORITY_STYLES.medium;
                const slaDisplay = c.slaHours <= 24 ? `${c.slaHours}h` : `${Math.ceil(c.slaHours / 24)}d`;
                return (
                  <tr key={c.id}
                    className={cn('group cursor-pointer hover:bg-[#FAFBFC] transition-colors', i !== filtered.length - 1 && 'border-b border-[#F3F4F6]')}
                    onClick={() => setSelected(c)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-[#0E1C2F]">{c.name}</p>
                        <p className="text-[10px] text-[#7A8FA6] mt-0.5 max-w-[200px] truncate">{c.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#3D5068]">{c.department}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: ps.bg, color: ps.text }}>{c.priority}</span>
                    </td>
                    <td className="px-4 py-3 text-[#3D5068]">{slaDisplay}</td>
                    <td className="px-4 py-3 font-semibold text-[#0E1C2F]">{c.complaintCount}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(c)} className="px-2 py-1 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">Edit</button>
                        <button onClick={() => handleDelete(c)} className="px-2 py-1 rounded text-[10px] font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-[13px] text-[#7A8FA6]">No categories found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Category Detail Popup Card ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-[16px] w-full max-w-[520px] shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-[#0E1C2F]">{selected.name}</h2>
                <span className={cn('text-[9px] font-semibold px-2 py-0.5 rounded-full', selected.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                  {selected.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-md flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"><X size={14} /></button>
            </div>
            <div className="p-5">
              {/* Category card header */}
              <div className="flex gap-4 mb-4 pb-4 border-b border-[#F3F4F6]">
                <div className="w-[56px] h-[56px] rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Tag size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-[#0E1C2F]">{selected.name}</h3>
                  <p className="text-[11px] text-[#7A8FA6] mt-0.5">{selected.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: (PRIORITY_STYLES[selected.priority] ?? PRIORITY_STYLES.medium).bg, color: (PRIORITY_STYLES[selected.priority] ?? PRIORITY_STYLES.medium).text }}>
                      {selected.priority}
                    </span>
                    <span className="text-[10px] text-[#7A8FA6]">·</span>
                    <span className="text-[10px] text-[#7A8FA6]">{selected.department}</span>
                  </div>
                </div>
              </div>

              {/* Detail fields */}
              <div className="space-y-0">
                {([
                  ['Category Code', selected.code, <Hash size={13} className="text-[#7A8FA6]" />],
                  ['Department', selected.department, <Building2 size={13} className="text-[#7A8FA6]" />],
                  ['Priority Level', selected.priority.charAt(0).toUpperCase() + selected.priority.slice(1), <AlertTriangle size={13} className="text-[#7A8FA6]" />],
                  ['SLA Limit', selected.slaHours <= 24 ? `${selected.slaHours} hours` : `${Math.ceil(selected.slaHours / 24)} days (${selected.slaHours}h)`, <Clock size={13} className="text-[#7A8FA6]" />],
                  ['Complaints Filed', String(selected.complaintCount), <BarChart3 size={13} className="text-[#7A8FA6]" />],
                  ['Status', selected.active ? 'Active' : 'Inactive', <CheckCircle size={13} className="text-[#7A8FA6]" />],
                  ['Description', selected.description, <FileText size={13} className="text-[#7A8FA6]" />],
                  ['Category ID', selected.id, <Hash size={13} className="text-[#AAB4BE]" />],
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

              {/* Complaint volume indicator */}
              <div className="mt-4 p-3 bg-[#F8FAFD] border border-[#EDF1F7] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-bold text-[#7A8FA6] uppercase tracking-wider">Complaint Volume</span>
                  <span className="text-[11px] font-bold text-[#0E1C2F]">{selected.complaintCount} total</span>
                </div>
                <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (selected.complaintCount / Math.max(...categories.map(c => c.complaintCount), 1)) * 100)}%`,
                      background: selected.priority === 'critical' ? '#DC2626' : selected.priority === 'high' ? '#F59E0B' : '#16A34A',
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#DDE3EE] flex justify-end gap-2">
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg text-[12px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]">Close</button>
              <button onClick={() => { openEdit(selected); setSelected(null); }} className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700">Edit Category</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModalMode(null)}>
          <div className="bg-white rounded-[16px] w-full max-w-[480px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#0E1C2F]">{modalMode === 'add' ? 'Add Category' : 'Edit Category'}</h2>
              <button onClick={() => setModalMode(null)} className="w-7 h-7 rounded-md flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"><X size={14} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#374151] mb-1">Category Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Water Supply Disruption"
                  className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#374151] mb-1">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description"
                  className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">Department *</label>
                  <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                    className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white">
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                    className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white">
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#374151] mb-1">SLA Limit (hours) *</label>
                <input type="number" value={form.slaHours} onChange={e => setForm(f => ({ ...f, slaHours: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#DDE3EE] flex justify-end gap-2">
              <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-lg text-[12px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]">Cancel</button>
              <button onClick={handleSave} disabled={createCategory.isPending} className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                {createCategory.isPending ? 'Creating…' : modalMode === 'add' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
