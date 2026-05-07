'use client';
import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDepartments, useCreateDepartment, useUpdateDepartment, type Department } from '@/hooks/useDepartments';

type ModalMode = 'add' | 'edit' | null;
type FormState = { name: string; full: string; sla_days: string; officers: string; categories: string };

export default function AdminDepartmentsPage() {
  const { data: departments = [], isLoading } = useDepartments();
  const createDept = useCreateDepartment();
  const updateDept = useUpdateDepartment();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', full: '', sla_days: '5', officers: '1', categories: '' });

  function openAdd() {
    setForm({ name: '', full: '', sla_days: '5', officers: '1', categories: '' });
    setEditDept(null);
    setModalMode('add');
  }

  function openEdit(d: Department) {
    setForm({ name: d.name, full: d.full, sla_days: String(d.sla_days), officers: String(d.officers), categories: d.categories.join(', ') });
    setEditDept(d);
    setModalMode('edit');
  }

  async function handleSave() {
    if (!form.name || !form.full) return toast.error('Code and full name are required');
    const payload = {
      name: form.name,
      full: form.full,
      sla_days: parseInt(form.sla_days, 10),
      officers: parseInt(form.officers, 10),
      categories: form.categories.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (modalMode === 'add') {
        await createDept.mutateAsync(payload);
        toast.success(`Department "${form.name}" created`);
      } else if (editDept) {
        await updateDept.mutateAsync({ id: editDept.id, data: payload });
        toast.success(`Department "${form.name}" updated`);
      }
      setModalMode(null);
    } catch {
      toast.error('Failed to save department');
    }
  }

  async function handleToggle(d: Department) {
    try {
      await updateDept.mutateAsync({ id: d.id, data: { active: !d.active } });
      toast.success(`${d.name} ${d.active ? 'deactivated' : 'activated'}`);
    } catch {
      toast.error('Failed to update department');
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[13px] text-[#7A8FA6]">Loading departments…</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Building2 size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0E1C2F]">Departments</h1>
            <p className="text-[12px] text-[#7A8FA6]">{departments.length} departments · {departments.filter(d => d.active).length} active</p>
          </div>
        </div>
        <button onClick={openAdd} className="px-4 py-2 rounded-[10px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
          + Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {departments.map(d => (
          <div key={d.id} className={`bg-white border rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)] ${d.active ? 'border-[#DDE3EE]' : 'border-gray-200 opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-[14px] font-bold text-[#0E1C2F]">{d.name}</h3>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${d.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {d.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A8FA6]">{d.full}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(d)} className="px-2 py-1 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all">Edit</button>
                <button onClick={() => handleToggle(d)} className={`px-2 py-1 rounded text-[10px] font-semibold transition-all border ${d.active ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200'}`}>
                  {d.active ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
            <div className="flex gap-4 mb-3">
              <div>
                <p className="text-[11px] text-[#7A8FA6]">SLA Limit</p>
                <p className="text-[14px] font-bold text-[#0E1C2F]">{d.sla_days}d</p>
              </div>
              <div>
                <p className="text-[11px] text-[#7A8FA6]">Officers</p>
                <p className="text-[14px] font-bold text-[#0E1C2F]">{d.officers}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[#7A8FA6] mb-1.5">Complaint Categories</p>
              <div className="flex flex-wrap gap-1">
                {d.categories.map(cat => (
                  <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{cat}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] w-full max-w-md shadow-xl">
            <div className="px-5 py-4 border-b border-[#DDE3EE]">
              <h2 className="text-[15px] font-bold text-[#0E1C2F]">{modalMode === 'add' ? 'Add Department' : 'Edit Department'}</h2>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Department Code</label>
                <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. GWSSB" className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[8px] focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Full Name</label>
                <input value={form.full} onChange={e => setForm(prev => ({ ...prev, full: e.target.value }))}
                  placeholder="e.g. Gujarat Water Supply Board" className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[8px] focus:outline-none focus:border-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">SLA Limit (days)</label>
                  <input type="number" min="1" value={form.sla_days} onChange={e => setForm(prev => ({ ...prev, sla_days: e.target.value }))}
                    className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[8px] focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Officer Count</label>
                  <input type="number" min="1" value={form.officers} onChange={e => setForm(prev => ({ ...prev, officers: e.target.value }))}
                    className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[8px] focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">Categories (comma-separated)</label>
                <input value={form.categories} onChange={e => setForm(prev => ({ ...prev, categories: e.target.value }))}
                  placeholder="e.g. Water Supply, Pipe Leak" className="w-full px-3 py-2 text-[12px] border border-[#DDE3EE] rounded-[8px] focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#DDE3EE] flex justify-end gap-2">
              <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-[8px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSave}
                disabled={createDept.isPending || updateDept.isPending}
                className="px-4 py-2 rounded-[8px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {createDept.isPending || updateDept.isPending ? 'Saving…' : modalMode === 'add' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
