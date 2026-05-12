'use client';
import React, { useState, useMemo } from 'react';
import {
  BarChart2, Plus, Edit2, Clock, AlertTriangle, CheckCircle,
  X, Search, Sparkles, ArrowUpRight, Mail, Bell, Smartphone,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSlaRules, useCreateSlaRule, useUpdateSlaRule, type SlaRule, type EscalationStep } from '@/hooks/useSlaRules';
import { useCategories } from '@/hooks/useCategories';

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  critical: { bg: '#FEF2F2', text: '#991B1B' },
  high: { bg: '#FFFBEB', text: '#92400E' },
  medium: { bg: '#F0FDF4', text: '#065F46' },
  low: { bg: '#F8FAFD', text: '#3D5068' },
};

const LEVEL_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  2: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  3: { bg: '#FEF2F2', text: '#991B1B', border: '#FCA5A5' },
};

const NOTIFY_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  Email: { icon: Mail, color: 'text-blue-500' },
  SMS: { icon: Smartphone, color: 'text-green-500' },
  Push: { icon: Bell, color: 'text-purple-500' },
};

const emptyForm = () => ({
  name: '', category: '', categoryCode: '', department: '',
  priority: 'medium' as string, responseHours: 4, resolutionHours: 48,
  escalationLevels: 1, note: '', isOverride: false,
});

export default function AdminSLAPage() {
  const { data: rules = [], isLoading } = useSlaRules();
  const { data: categories = [] } = useCategories();
  const createRule = useCreateSlaRule();
  const updateRule = useUpdateSlaRule();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SlaRule | null>(null);
  const [selected, setSelected] = useState<SlaRule | null>(null);
  const [form, setForm] = useState(emptyForm());

  // Derived data
  const departments = useMemo(() => {
    const depts = [...new Set(rules.map(r => r.department).filter(Boolean))];
    return depts.sort();
  }, [rules]);

  const filtered = rules.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    const matchDept = deptFilter === 'all' || r.department === deptFilter;
    const matchPri = priorityFilter === 'all' || r.priority === priorityFilter;
    return matchSearch && matchDept && matchPri;
  });

  const activeCount = rules.filter(r => r.active).length;
  const criticalCount = rules.filter(r => r.priority === 'critical').length;
  const avgResolution = rules.length > 0 ? Math.round(rules.reduce((s, r) => s + r.resolutionHours, 0) / rules.length) : 0;

  function openAdd() {
    setEditing(null);
    setForm(emptyForm());
    setShowModal(true);
  }

  function openEdit(rule: SlaRule) {
    setEditing(rule);
    setForm({
      name: rule.name, category: rule.category, categoryCode: rule.categoryCode,
      department: rule.department, priority: rule.priority,
      responseHours: rule.responseHours, resolutionHours: rule.resolutionHours,
      escalationLevels: rule.escalationLevels, note: rule.note ?? '',
      isOverride: rule.isOverride ?? false,
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name) return toast.error('Rule name is required');
    if (editing) {
      updateRule.mutate({ id: editing.id, ...form }, {
        onSuccess: () => { setShowModal(false); toast.success('Rule updated'); },
        onError: () => toast.error('Failed to update'),
      });
    } else {
      createRule.mutate(form, {
        onSuccess: () => { setShowModal(false); toast.success('SLA rule created'); },
        onError: () => toast.error('Failed to create'),
      });
    }
  }

  function handleToggle(rule: SlaRule) {
    updateRule.mutate({ id: rule.id, active: !rule.active }, {
      onSuccess: () => toast.success(`Rule ${rule.active ? 'disabled' : 'enabled'}`),
    });
  }

  function formatHours(h: number) {
    if (h <= 0) return '--';
    return h <= 24 ? `${h}h` : `${Math.ceil(h / 24)}d`;
  }

  if (isLoading) {
    return <div className="px-4 py-16 text-center text-[13px] text-[#7A8FA6]">Loading SLA rules…</div>;
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <BarChart2 size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0E1C2F]">SLA Rule Engine</h1>
            <p className="text-[12px] text-[#7A8FA6]">{activeCount} active rules · Configure response & resolution times</p>
          </div>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
          <Plus size={12} /> Add Rule
        </button>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3 flex items-center gap-3 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center"><CheckCircle size={16} className="text-green-600" /></div>
          <div><p className="text-[20px] font-bold text-[#0E1C2F]">{activeCount}</p><p className="text-[10px] text-[#7A8FA6]">Active Rules</p></div>
        </div>
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3 flex items-center gap-3 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center"><Clock size={16} className="text-amber-600" /></div>
          <div><p className="text-[20px] font-bold text-[#0E1C2F]">{formatHours(avgResolution)}</p><p className="text-[10px] text-[#7A8FA6]">Avg Resolution</p></div>
        </div>
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3 flex items-center gap-3 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center"><AlertTriangle size={16} className="text-red-600" /></div>
          <div><p className="text-[20px] font-bold text-[#0E1C2F]">{criticalCount}</p><p className="text-[10px] text-[#7A8FA6]">Critical Rules</p></div>
        </div>
      </div>

      {/* ── Filter Row ── */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] px-4 py-3 mb-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rules…"
              className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
          </div>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white text-[#374151]">
            <option value="all">All departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white text-[#374151]">
            <option value="all">All priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* ── Rules Table ── */}
      <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-[#F8FAFD]">
              <tr>
                {['Rule Name', 'Category', 'Dept', 'Priority', 'Response', 'Resolution', 'Escalation', 'Status', ''].map(h => (
                  <th key={h} className="px-3.5 py-2.5 text-left text-[10.5px] font-bold text-[#7A8FA6] uppercase tracking-wider border-b border-[#DDE3EE] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const ps = PRIORITY_STYLES[r.priority] ?? PRIORITY_STYLES.low;
                const lc = LEVEL_COLORS[r.escalationLevels] ?? LEVEL_COLORS[1];
                return (
                  <tr key={r.id}
                    className={cn('group cursor-pointer hover:bg-[#FAFBFC] transition-colors', i !== filtered.length - 1 && 'border-b border-[#F3F4F6]', !r.active && 'opacity-50')}
                    onClick={() => setSelected(r)}
                  >
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-[#0E1C2F]">{r.name}</p>
                        {r.isOverride && <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-px rounded-full border border-purple-200">Override</span>}
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-[#3D5068] max-w-[140px] truncate">{r.category}</td>
                    <td className="px-3.5 py-3 text-[#3D5068]">{r.department}</td>
                    <td className="px-3.5 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: ps.bg, color: ps.text }}>{r.priority}</span>
                    </td>
                    <td className="px-3.5 py-3 text-[#3D5068]">{r.responseHours}h</td>
                    <td className="px-3.5 py-3 text-[#3D5068]">{formatHours(r.resolutionHours)}</td>
                    <td className="px-3.5 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: lc.bg, color: lc.text }}>L{r.escalationLevels}</span>
                    </td>
                    <td className="px-3.5 py-3">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', r.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                        {r.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3.5 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(r)} className="px-2 py-1 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">Edit</button>
                        <button onClick={() => handleToggle(r)} className={cn('px-2 py-1 rounded text-[10px] font-semibold border', r.active ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200')}>
                          {r.active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-[13px] text-[#7A8FA6]">No SLA rules found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Rule Detail Popup ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-[16px] w-full max-w-[560px] shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-center justify-between sticky top-0 bg-white rounded-t-[16px] z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock size={15} className="text-blue-600" />
                </div>
                <h2 className="text-[15px] font-bold text-[#0E1C2F]">{selected.name}</h2>
                {selected.isOverride && <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-px rounded-full border border-purple-200">Override</span>}
              </div>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-md flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"><X size={14} /></button>
            </div>

            <div className="p-5">
              {/* Rule meta bar */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F3F4F6]">
                <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <BarChart2 size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#0E1C2F]">{selected.name}</p>
                  <p className="text-[11px] text-[#7A8FA6]">{selected.category} · {selected.department}</p>
                </div>
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0', selected.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                  {selected.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Detail fields */}
              <div className="space-y-0">
                {([
                  ['Category', selected.category],
                  ['Department', selected.department],
                  ['Priority', (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: (PRIORITY_STYLES[selected.priority] ?? PRIORITY_STYLES.low).bg, color: (PRIORITY_STYLES[selected.priority] ?? PRIORITY_STYLES.low).text }}>
                      {selected.priority}
                    </span>
                  )],
                  ['Response Time', `${selected.responseHours} hours`],
                  ['Resolution Time', selected.resolutionHours <= 24 ? `${selected.resolutionHours} hours` : `${Math.ceil(selected.resolutionHours / 24)} days (${selected.resolutionHours}h)`],
                  ['Conditions', selected.conditions.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {selected.conditions.map((cond, ci) => (
                        <span key={ci} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{cond}</span>
                      ))}
                    </div>
                  ) : <span className="text-[#7A8FA6]">--</span>],
                  ['Rule ID', <span key="id" className="text-[11px] text-[#AAB4BE] font-mono">{selected.id}</span>],
                ] as [string, React.ReactNode][]).map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[120px_1fr] py-2 border-b border-[#F3F4F6] text-[12px]">
                    <div className="text-[#6B7280] font-medium">{label}</div>
                    <div className="text-[#0E1C2F]">{value}</div>
                  </div>
                ))}
              </div>

              {/* Escalation Path Visualization */}
              <div className="mt-4 p-3 bg-gradient-to-r from-[#FAF5FF] to-white border border-[#E9D5FF] rounded-lg">
                <div className="flex items-center gap-1.5 mb-3">
                  <ArrowUpRight size={11} className="text-purple-600" />
                  <span className="text-[10.5px] font-bold text-purple-600">Escalation Path</span>
                </div>
                <div className="space-y-2">
                  {selected.escalations && selected.escalations.length > 0 ? (
                    selected.escalations.map((esc: EscalationStep, idx: number) => {
                      const lc = LEVEL_COLORS[esc.level] ?? LEVEL_COLORS[1];
                      return (
                        <div key={idx} className="relative">
                          {idx > 0 && (
                            <div className="absolute left-[15px] -top-2 w-0.5 h-2" style={{ background: '#D8B4FE' }} />
                          )}
                          <div className="flex items-start gap-3 p-2.5 rounded-lg border" style={{ background: lc.bg, borderColor: lc.border }}>
                            {/* Level badge */}
                            <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 border" style={{ background: 'white', color: lc.text, borderColor: lc.border }}>
                              L{esc.level}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-semibold text-[#0E1C2F]">{esc.role}</span>
                                <span className="text-[9px] font-bold px-1.5 py-px rounded-full bg-white/80 text-[#7A8FA6] border border-[#DDE3EE]">after {esc.afterHours}h</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {esc.notify.map((ch: string) => {
                                  const ni = NOTIFY_ICONS[ch];
                                  return ni ? (
                                    <span key={ch} className="flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-px rounded-full bg-white/80 border border-[#DDE3EE]">
                                      <ni.icon size={9} className={ni.color} />
                                      {ch}
                                    </span>
                                  ) : (
                                    <span key={ch} className="text-[10px] font-medium px-1.5 py-px rounded-full bg-white/80 border border-[#DDE3EE]">{ch}</span>
                                  );
                                })}
                              </div>
                            </div>
                            {/* Arrow connector */}
                            {idx < selected.escalations.length - 1 && (
                              <div className="absolute -bottom-2 left-[15px] w-0.5 h-2" style={{ background: '#D8B4FE' }} />
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center gap-2">
                      {Array.from({ length: selected.escalationLevels }, (_, i) => (
                        <React.Fragment key={i}>
                          <span className="text-[10px] font-semibold px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200">Level {i + 1}</span>
                          {i < selected.escalationLevels - 1 && <ArrowUpRight size={10} className="text-purple-300" />}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Note */}
              {selected.note && (
                <div className="mt-4 p-3 bg-[#F8FAFD] border border-[#EDF1F7] rounded-lg">
                  <p className="text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wider mb-1">Note</p>
                  <p className="text-[11px] text-[#0E1C2F] leading-relaxed">{selected.note}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#DDE3EE] flex justify-end gap-2 sticky bottom-0 bg-white rounded-b-[16px]">
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg text-[12px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]">Close</button>
              <button onClick={() => { openEdit(selected); setSelected(null); }} className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700">Edit Rule</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-[16px] w-full max-w-[520px] shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-center justify-between sticky top-0 bg-white rounded-t-[16px] z-10">
              <h2 className="text-[15px] font-bold text-[#0E1C2F]">{editing ? 'Edit SLA Rule' : 'Add SLA Rule'}</h2>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-md flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"><X size={14} /></button>
            </div>
            <div className="p-5 space-y-3">
              {/* AI Suggestion */}
              {!editing && (
                <div className="p-3 bg-gradient-to-r from-[#FAF5FF] to-white border border-[#E9D5FF] rounded-lg text-[11.5px] text-[#0F1A2E] leading-relaxed">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={11} className="text-purple-600" />
                    <span className="text-[10.5px] font-bold text-purple-600">AI Suggest</span>
                  </div>
                  Based on department and category, recommended SLA: <b>48h resolution</b>, <b>Level 2 escalation</b>
                </div>
              )}
              <div>
                <label className="block text-[11px] font-semibold text-[#374151] mb-1">Rule Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Water Supply — Critical"
                  className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">Category *</label>
                  <select value={form.category} onChange={e => {
                    const cat = categories.find(c => c.name === e.target.value);
                    setForm(f => ({ ...f, category: e.target.value, categoryCode: cat?.code ?? '', department: cat?.department ?? f.department }));
                  }} className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white">
                    <option value="">Select category</option>
                    <option value="All Categories">All Categories (Override)</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">Department</label>
                  <input value={form.department} readOnly
                    className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#6B7280]" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
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
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">Response (h)</label>
                  <input type="number" value={form.responseHours} onChange={e => setForm(f => ({ ...f, responseHours: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">Resolution (h)</label>
                  <input type="number" value={form.resolutionHours} onChange={e => setForm(f => ({ ...f, resolutionHours: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">Escalation Levels</label>
                  <select value={form.escalationLevels} onChange={e => setForm(f => ({ ...f, escalationLevels: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white">
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                    <option value={3}>Level 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">Override Rule</label>
                  <select value={form.isOverride ? 'yes' : 'no'} onChange={e => setForm(f => ({ ...f, isOverride: e.target.value === 'yes' }))}
                    className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white">
                    <option value="no">No</option>
                    <option value="yes">Yes — applies to all</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#374151] mb-1">Note</label>
                <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Optional description or override note"
                  className="w-full px-3 py-2 text-[12px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#DDE3EE] flex justify-end gap-2 sticky bottom-0 bg-white rounded-b-[16px]">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-[12px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]">Cancel</button>
              <button onClick={handleSave} disabled={createRule.isPending || updateRule.isPending} className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                {(createRule.isPending || updateRule.isPending) ? 'Saving...' : editing ? 'Save Changes' : 'Create Rule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
