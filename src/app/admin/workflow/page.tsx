'use client';
import React, { useState } from 'react';
import { Settings, ArrowRight, Copy, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useWorkflows } from '@/hooks/useWorkflows';

const colors = {
  brand: '#FF8C42',
  red: '#ff8a80',
  green: '#16A34A',
  amber: '#D97706',
  violet: '#7C3AED',
  orange: '#FF8C42',
  ink: '#0F1A2E',
  t2: '#666',
  t3: '#999',
  border: '#E5E7EB',
  card: '#fff',
  bg: '#F4F2EE'
};

function WorkflowCard({ workflow, onEdit, onDuplicate, onDelete }: {
  workflow: any;
  onEdit: (w: any) => void;
  onDuplicate: (w: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(14,28,47,0.08),0 4px 16px rgba(14,28,47,0.06)', opacity: workflow.active ? 1 : 0.6 }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: colors.ink, margin: 0 }}>{workflow.name}</h3>
          <span style={{ fontSize: '9px', fontWeight: '600', padding: '2px 8px', borderRadius: '10px', background: '#EBF2FF', color: '#1E40AF' }}>{workflow.category}</span>
          <span className="status-badge" style={{ background: workflow.active ? '#D1FAE5' : '#F1F5F9', color: workflow.active ? '#065F46' : '#475569' }}>
            {workflow.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => onEdit(workflow)} style={{ padding: '4px 8px', borderRadius: '6px', border: `1px solid ${colors.border}`, background: '#EBF2FF', color: colors.brand, cursor: 'pointer' }}>
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDuplicate(workflow)} style={{ padding: '4px 8px', borderRadius: '6px', border: `1px solid ${colors.border}`, background: colors.bg, color: colors.t2, cursor: 'pointer' }}>
            <Copy size={14} />
          </button>
          <button onClick={() => onDelete(workflow.id)} style={{ padding: '4px 8px', borderRadius: '6px', border: `1px solid ${colors.border}`, background: '#FEF2F2', color: colors.red, cursor: 'pointer' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          {workflow.steps.map((step: any, idx: number) => (
            <React.Fragment key={step.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '8px', border: `1px solid ${step.auto ? '#E9D5FF' : colors.border}`, background: step.auto ? '#EDE9FE' : colors.bg, minWidth: '100px', fontSize: '10px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: colors.card, border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '600', color: colors.t3, flexShrink: 0 }}>
                  {idx + 1}
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: '600', color: colors.ink, margin: 0 }}>{step.name}</p>
                  <p style={{ fontSize: '8px', color: colors.t3, margin: 0 }}>{step.role}</p>
                </div>
              </div>
              {idx < workflow.steps.length - 1 && (
                <ArrowRight size={12} style={{ color: colors.t3, flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '9px', color: colors.t3 }}>{workflow.steps.length} steps</span>
          <span style={{ fontSize: '9px', color: colors.t3 }}>{workflow.steps.filter((s: any) => s.auto).length} automated</span>
        </div>
      </div>
    </div>
  );
}

interface WorkflowStep {
  id: string;
  name: string;
  role: string;
  action: string;
  auto: boolean;
  slaHours: number;
}

interface FormData {
  name: string;
  category: string;
  active: boolean;
  steps: WorkflowStep[];
}

export default function AdminWorkflowPage() {
  const { workflows, loading, addWorkflow, updateWorkflow, deleteWorkflow } = useWorkflows();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', category: '', active: true });

  const handleEdit = (workflow: any) => {
    setEditingId(workflow.id);
    setFormData({ name: workflow.name, category: workflow.category, active: workflow.active, steps: workflow.steps });
    setShowModal(true);
  };

  const handleDuplicate = async (workflow: any) => {
    const newWorkflow = { ...workflow, id: undefined };
    delete newWorkflow.id;
    delete newWorkflow.createdAt;
    try {
      await addWorkflow(newWorkflow);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this workflow?')) {
      try {
        await deleteWorkflow(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateWorkflow(editingId, formData);
      } else {
        await addWorkflow(formData as any);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', category: '', active: true, steps: [] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <style>{`
        .tt-btn { display: flex; align-items: center; gap: 6px; background: ${colors.brand}; border: none; border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 600; color: white; cursor: pointer; box-shadow: 0 2px 8px rgba(26,86,196,0.25); }
        .tt-btn:hover { background: #0E3A8C; }
        .status-badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; }
        .st-active { background: #D1FAE5; color: #065F46; }
        .st-inactive { background: #F1F5F9; color: #475569; }
        .card { background: ${colors.card}; border: 1px solid ${colors.border}; border-radius: 14px; box-shadow: 0 1px 3px rgba(14,28,47,0.08),0 4px 16px rgba(14,28,47,0.06); }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={20} style={{ color: colors.violet }} />
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: '700', color: colors.ink, margin: '0 0 4px 0' }}>Workflow Configuration</h1>
            <p style={{ fontSize: '11px', color: colors.t3, margin: 0 }}>{workflows.length} workflows · Define complaint processing flows</p>
          </div>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ name: '', category: '', active: true, steps: [] }); setShowModal(true); }} className="tt-btn">
          + Add Workflow
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#EDE9FE', border: `1px solid #E9D5FF` }} />
          <span style={{ fontSize: '11px', color: colors.t2, fontWeight: '600' }}>Automated</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#F8FAFD', border: `1px solid #EEF1F7` }} />
          <span style={{ fontSize: '11px', color: colors.t2, fontWeight: '600' }}>Manual</span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', color: colors.t3 }}>Loading workflows...</div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {workflows.map(w => (
            <WorkflowCard key={w.id} workflow={w} onEdit={handleEdit} onDuplicate={handleDuplicate} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, overflow: 'auto', padding: '20px' }}>
          <div style={{ background: colors.card, borderRadius: '14px', padding: '20px', width: '500px', boxShadow: '0 4px 24px rgba(14,28,47,0.12)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: colors.ink, marginBottom: '16px' }}>
              {editingId ? 'Edit Workflow' : 'Create Workflow'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: colors.t2, marginBottom: '6px' }}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'inherit' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: colors.t2, marginBottom: '6px' }}>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'inherit' }}
                  required
                />
              </div>

              {/* Steps Section */}
              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '12px', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ fontSize: '10px', fontWeight: '700', color: colors.t2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Workflow Steps</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newStep: WorkflowStep = { id: `s${Date.now()}`, name: '', role: '', action: '', auto: false, slaHours: 0 };
                      setFormData({ ...formData, steps: [...formData.steps, newStep] });
                    }}
                    style={{ fontSize: '11px', fontWeight: '600', color: colors.brand, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    + Add Step
                  </button>
                </div>

                {formData.steps.length === 0 ? (
                  <div style={{ fontSize: '11px', color: colors.t3, padding: '12px', background: colors.bg, borderRadius: '6px', textAlign: 'center' }}>
                    No steps yet. Add one to get started.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {formData.steps.map((step, idx) => (
                      <div key={step.id} style={{ padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '8px', background: colors.bg }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '700', color: colors.t3 }}>Step {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, steps: formData.steps.filter((_, i) => i !== idx) })}
                            style={{ fontSize: '10px', color: colors.red, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 'auto' }}
                          >
                            Remove
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                          <input
                            type="text"
                            placeholder="Step name"
                            value={step.name}
                            onChange={(e) => {
                              const updated = [...formData.steps];
                              updated[idx] = { ...step, name: e.target.value };
                              setFormData({ ...formData, steps: updated });
                            }}
                            style={{ padding: '6px 8px', borderRadius: '4px', border: `1px solid ${colors.border}`, fontSize: '11px', fontFamily: 'inherit' }}
                          />
                          <input
                            type="text"
                            placeholder="Role (e.g. Officer)"
                            value={step.role}
                            onChange={(e) => {
                              const updated = [...formData.steps];
                              updated[idx] = { ...step, role: e.target.value };
                              setFormData({ ...formData, steps: updated });
                            }}
                            style={{ padding: '6px 8px', borderRadius: '4px', border: `1px solid ${colors.border}`, fontSize: '11px', fontFamily: 'inherit' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                          <input
                            type="text"
                            placeholder="Action"
                            value={step.action}
                            onChange={(e) => {
                              const updated = [...formData.steps];
                              updated[idx] = { ...step, action: e.target.value };
                              setFormData({ ...formData, steps: updated });
                            }}
                            style={{ padding: '6px 8px', borderRadius: '4px', border: `1px solid ${colors.border}`, fontSize: '11px', fontFamily: 'inherit' }}
                          />
                          <input
                            type="number"
                            placeholder="SLA Hours"
                            value={step.slaHours}
                            onChange={(e) => {
                              const updated = [...formData.steps];
                              updated[idx] = { ...step, slaHours: parseInt(e.target.value) || 0 };
                              setFormData({ ...formData, steps: updated });
                            }}
                            style={{ padding: '6px 8px', borderRadius: '4px', border: `1px solid ${colors.border}`, fontSize: '11px', fontFamily: 'inherit' }}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="checkbox"
                            id={`auto-${step.id}`}
                            checked={step.auto}
                            onChange={(e) => {
                              const updated = [...formData.steps];
                              updated[idx] = { ...step, auto: e.target.checked };
                              setFormData({ ...formData, steps: updated });
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                          <label htmlFor={`auto-${step.id}`} style={{ fontSize: '10px', fontWeight: '600', color: colors.t2, cursor: 'pointer' }}>Automated</label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
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
