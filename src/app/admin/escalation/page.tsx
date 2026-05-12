'use client';
import React, { useState } from 'react';
import { AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useEscalationRules } from '@/hooks/useEscalationRules';

const colors = {
  brand: '#1A56C4',
  red: '#DC2626',
  green: '#16A34A',
  amber: '#D97706',
  violet: '#7C3AED',
  orange: '#EA580C',
  ink: '#0E1C2F',
  t2: '#3D5068',
  t3: '#7A8FA6',
  border: '#DDE3EE',
  card: '#FFFFFF',
  bg: '#F0F2F7'
};

const LEVEL_COLORS: Record<number, { bg: string; text: string }> = {
  1: { bg: '#FFFBEB', text: '#92400E' },
  2: { bg: '#FEF3C7', text: '#92400E' },
  3: { bg: '#FEF2F2', text: '#991B1B' },
};

interface FormData {
  name: string;
  trigger: string;
  level: number;
  targetRole: string;
  notifyVia: string[];
  autoActions: string[];
  active: boolean;
}

export default function AdminEscalationPage() {
  const { rules, loading, addRule, updateRule, deleteRule, toggleRule } = useEscalationRules();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '', trigger: '', level: 1, targetRole: '', notifyVia: [], autoActions: [], active: true
  });

  const handleEdit = (rule: any) => {
    setEditingId(rule.id);
    setFormData(rule);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this rule?')) {
      try {
        await deleteRule(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRule(editingId, formData);
      } else {
        await addRule(formData);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', trigger: '', level: 1, targetRole: '', notifyVia: [], autoActions: [], active: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <style>{`
        .tt-btn { display: flex; align-items: center; gap: 6px; background: ${colors.brand}; border: none; border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 600; color: white; cursor: pointer; box-shadow: 0 2px 8px rgba(26,86,196,0.25); }
        .tt-btn:hover { background: #0E3A8C; }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} style={{ color: colors.red }} />
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: '700', color: colors.ink, margin: '0 0 4px 0' }}>Escalation Matrix</h1>
            <p style={{ fontSize: '11px', color: colors.t3, margin: 0 }}>{rules.length} rules · Auto-escalation triggers & actions</p>
          </div>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ name: '', trigger: '', level: 1, targetRole: '', notifyVia: [], autoActions: [], active: true }); setShowModal(true); }} className="tt-btn">
          + Add Rule
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        {[1, 2, 3].map(lvl => (
          <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', backgroundColor: LEVEL_COLORS[lvl].bg, color: LEVEL_COLORS[lvl].text }}>
              Level {lvl}
            </div>
            <span style={{ fontSize: '11px', color: colors.t2, fontWeight: '600' }}>{lvl === 1 ? 'Warning' : lvl === 2 ? 'Escalation' : 'Critical'}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', color: colors.t3 }}>Loading rules...</div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {rules.map(rule => {
            const lc = LEVEL_COLORS[rule.level];
            return (
              <div key={rule.id} style={{ background: colors.card, border: `1px solid ${rule.active ? colors.border : '#E5E7EB'}`, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(14,28,47,0.08),0 4px 16px rgba(14,28,47,0.06)', opacity: rule.active ? 1 : 0.6 }}>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0, backgroundColor: lc.bg, color: lc.text }}>
                    L{rule.level}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '12px', fontWeight: '600', color: colors.ink, margin: 0 }}>{rule.name}</h3>
                      <span style={{ fontSize: '9px', fontWeight: '600', padding: '2px 8px', borderRadius: '10px', background: rule.active ? '#D1FAE5' : '#F1F5F9', color: rule.active ? '#065F46' : '#475569' }}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p style={{ fontSize: '10px', color: colors.t3, marginBottom: '8px', margin: 0 }}>
                      <span style={{ fontWeight: '600' }}>Trigger:</span> {rule.trigger}
                      <span style={{ margin: '0 8px', color: colors.border }}>|</span>
                      <span style={{ fontWeight: '600' }}>Target:</span> {rule.targetRole}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <p style={{ fontSize: '8px', fontWeight: '700', color: colors.t3, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notify Via</p>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {rule.notifyVia.map(ch => (
                            <span key={ch} style={{ fontSize: '9px', fontWeight: '600', padding: '2px 8px', borderRadius: '10px', background: '#EBF2FF', color: '#1E40AF' }}>{ch}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: '8px', fontWeight: '700', color: colors.t3, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Auto Actions</p>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {rule.autoActions.map(a => (
                            <span key={a} style={{ fontSize: '9px', fontWeight: '600', padding: '2px 8px', borderRadius: '10px', background: '#FFFBEB', color: '#92400E' }}>{a}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button onClick={() => handleEdit(rule)} style={{ padding: '4px 8px', borderRadius: '6px', border: `1px solid ${colors.border}`, background: '#EBF2FF', color: colors.brand, cursor: 'pointer' }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => toggleRule(rule.id)} style={{ padding: '4px 8px', borderRadius: '6px', border: `1px solid ${rule.active ? colors.border : colors.border}`, background: rule.active ? '#FEF2F2' : '#D1FAE5', color: rule.active ? colors.red : colors.green, cursor: 'pointer', fontSize: '10px', fontWeight: '600' }}>
                      {rule.active ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => handleDelete(rule.id)} style={{ padding: '4px 8px', borderRadius: '6px', border: `1px solid ${colors.border}`, background: '#FEF2F2', color: colors.red, cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: colors.card, borderRadius: '14px', padding: '20px', width: '380px', boxShadow: '0 4px 24px rgba(14,28,47,0.12)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: colors.ink, marginBottom: '16px' }}>
              {editingId ? 'Edit Rule' : 'Create Rule'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: colors.t2, marginBottom: '6px' }}>Name</label>
                <input type="text" placeholder="Rule name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'inherit' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: colors.t2, marginBottom: '6px' }}>Trigger</label>
                <input type="text" placeholder="Trigger condition" value={formData.trigger} onChange={(e) => setFormData({ ...formData, trigger: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'inherit' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: colors.t2, marginBottom: '6px' }}>Level</label>
                <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'inherit' }}>
                  <option value={1}>Level 1 - Warning</option>
                  <option value={2}>Level 2 - Escalation</option>
                  <option value={3}>Level 3 - Critical</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: colors.t2, marginBottom: '6px' }}>Target Role</label>
                <input type="text" placeholder="Target role" value={formData.targetRole} onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'inherit' }} required />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} style={{ cursor: 'pointer' }} />
                <label htmlFor="active" style={{ fontSize: '11px', fontWeight: '600', color: colors.t2, cursor: 'pointer' }}>Active</label>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: colors.bg, color: colors.t2, border: 'none', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: colors.brand, color: 'white', border: 'none', cursor: 'pointer' }}>
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
