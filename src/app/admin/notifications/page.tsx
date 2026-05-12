'use client';
import React, { useState } from 'react';
import { MessageSquare, Mail, Smartphone, Bell, Globe, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNotificationTemplates } from '@/hooks/useNotificationTemplates';

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

const CHANNEL_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  Email: { icon: Mail, color: 'text-blue-600' },
  SMS: { icon: Smartphone, color: 'text-green-600' },
  Push: { icon: Bell, color: 'text-purple-600' },
};

export default function AdminNotificationsPage() {
  const { templates, channels, loading, addTemplate, updateTemplate, deleteTemplate, toggleTemplate } = useNotificationTemplates();
  const [tab, setTab] = useState<'templates' | 'channels'>('templates');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', event: '', channels: [], content: '', active: true });

  const handleEdit = (template: any) => {
    setEditingId(template.id);
    setFormData(template);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this template?')) {
      try {
        await deleteTemplate(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTemplate(editingId, formData);
      } else {
        await addTemplate(formData as any);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', event: '', channels: [], content: '', active: true });
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
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={20} style={{ color: colors.violet }} />
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: '700', color: colors.ink, margin: '0 0 4px 0' }}>Notifications</h1>
            <p style={{ fontSize: '11px', color: colors.t3, margin: 0 }}>{templates.length} templates · {channels.filter(c => c.status === 'connected').length} channels active</p>
          </div>
        </div>
        {tab === 'templates' && (
          <button onClick={() => { setEditingId(null); setFormData({ name: '', event: '', channels: [], content: '', active: true }); setShowModal(true); }} className="tt-btn">
            + Add Template
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: colors.bg, borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {(['templates', 'channels'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: tab === t ? colors.card : 'transparent', color: tab === t ? colors.ink : colors.t3, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: tab === t ? '0 1px 3px rgba(14,28,47,0.06)' : 'none' }}>
            {t === 'templates' ? 'Notification Templates' : 'Channel Configuration'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', color: colors.t3 }}>Loading...</div>
      ) : tab === 'templates' ? (
        <div style={{ display: 'grid', gap: '12px' }}>
          {templates.map(tmpl => (
            <div key={tmpl.id} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(14,28,47,0.08),0 4px 16px rgba(14,28,47,0.06)', opacity: tmpl.active ? 1 : 0.6 }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: '600', color: colors.ink, margin: 0 }}>{tmpl.name}</h3>
                  <span style={{ fontSize: '9px', fontWeight: '600', padding: '2px 8px', borderRadius: '10px', background: colors.bg, color: colors.t3 }}>{tmpl.event}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {tmpl.channels.map(ch => {
                      const ci = CHANNEL_ICONS[ch];
                      return ci ? <span key={ch} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: '600', color: colors.t3 }}><ci.icon size={11} style={{ color: ci.color }} /> {ch}</span> : null;
                    })}
                  </div>
                  <button onClick={() => handleEdit(tmpl)} style={{ padding: '4px 8px', borderRadius: '6px', border: `1px solid ${colors.border}`, background: '#EBF2FF', color: colors.brand, cursor: 'pointer' }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(tmpl.id)} style={{ padding: '4px 8px', borderRadius: '6px', border: `1px solid ${colors.border}`, background: '#FEF2F2', color: colors.red, cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <p style={{ fontSize: '10px', color: colors.t2, background: '#F8FAFD', borderRadius: '6px', padding: '8px', border: `1px solid #EEF1F7`, margin: 0, fontStyle: 'italic' }}>{tmpl.content}</p>
                <p style={{ fontSize: '8px', color: colors.t3, margin: '6px 0 0 0' }}>Available variables: {'{token}, {officer_name}, {sla_days}, {status}, {eta}, {rating_link}'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {channels.map(ch => {
            const statusBg = ch.status === 'connected' ? '#D1FAE5' : ch.status === 'error' ? '#FEF2F2' : '#F3F4F6';
            const statusColor = ch.status === 'connected' ? '#065F46' : ch.status === 'error' ? colors.red : '#6B7280';
            const iconColor = ch.status === 'connected' ? colors.green : '#D1D5DB';
            return (
              <div key={ch.id} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '12px 16px', boxShadow: '0 1px 3px rgba(14,28,47,0.08),0 4px 16px rgba(14,28,47,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: statusBg }}>
                    {ch.name.includes('Email') ? <Mail size={18} style={{ color: iconColor }} /> : ch.name.includes('SMS') ? <Smartphone size={18} style={{ color: iconColor }} /> : ch.name.includes('Push') ? <Bell size={18} style={{ color: iconColor }} /> : <Globe size={18} style={{ color: iconColor }} />}
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: colors.ink, margin: '0 0 2px 0' }}>{ch.name}</p>
                    <p style={{ fontSize: '10px', color: colors.t3, margin: 0 }}>{ch.provider}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '9px', fontWeight: '700', padding: '4px 10px', borderRadius: '10px', background: statusBg, color: statusColor }}>
                    {ch.status === 'connected' ? 'Connected' : ch.status === 'error' ? 'Error' : 'Disconnected'}
                  </span>
                  <button onClick={() => toast.info('Configure channel')} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: '600', background: '#EBF2FF', color: colors.brand, border: `1px solid ${colors.border}`, cursor: 'pointer' }}>
                    {ch.status === 'connected' ? 'Configure' : 'Connect'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: colors.card, borderRadius: '14px', padding: '20px', width: '380px', boxShadow: '0 4px 24px rgba(14,28,47,0.12)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: colors.ink, marginBottom: '16px' }}>
              {editingId ? 'Edit Template' : 'Create Template'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: colors.t2, marginBottom: '6px' }}>Template Name</label>
                <input type="text" placeholder="Template name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'inherit' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: colors.t2, marginBottom: '6px' }}>Event Trigger</label>
                <input type="text" placeholder="Event trigger" value={formData.event} onChange={(e) => setFormData({ ...formData, event: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'inherit' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: colors.t2, marginBottom: '6px' }}>Notification Channels</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px', border: `1px solid ${colors.border}`, borderRadius: '6px', background: colors.bg, minHeight: '36px' }}>
                  {['Email', 'SMS', 'Push'].map(channel => (
                    <label key={channel} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', color: colors.t2, cursor: 'pointer', background: colors.card, padding: '4px 8px', borderRadius: '4px', border: `1px solid ${colors.border}` }}>
                      <input
                        type="checkbox"
                        checked={formData.channels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, channels: [...formData.channels, channel] });
                          } else {
                            setFormData({ ...formData, channels: formData.channels.filter(c => c !== channel) });
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      {channel}
                    </label>
                  ))}
                </div>
                {formData.channels.length === 0 && <p style={{ fontSize: '9px', color: colors.t3, marginTop: '4px' }}>Select at least one channel</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: colors.t2, marginBottom: '6px' }}>Message Content</label>
                <textarea placeholder="Message template" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'inherit', minHeight: '80px', resize: 'vertical' }} required />
                <p style={{ fontSize: '8px', color: colors.t3, margin: '4px 0 0 0' }}>Variables: {'{'}{'{token}'}, {'{'}{'{officer_name}'}, {'{'}{'{sla_days}'}, {'{'}{'{status}'}, {'{'}{'{eta}'}, {'{'}{'{rating_link}'}</p>
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
