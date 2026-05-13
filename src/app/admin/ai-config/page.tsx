'use client';
import React, { useState, useEffect } from 'react';
import { Zap, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface AIFeature {
  id: string;
  name: string;
  description: string;
  modelName: string;
  active: boolean;
  threshold: number;
}

interface AIStats {
  activeFeatures: number;
  totalFeatures: number;
  apiCallsToday: number;
  costToday: number;
  avgConfidence: number;
}

const colors = {
  brand: '#FF8C42',
  red: '#ff8a80',
  green: '#16A34A',
  ink: '#0F1A2E',
  t2: '#666',
  t3: '#999',
  border: '#E5E7EB',
  card: '#fff',
  bg: '#F4F2EE'
};

export default function AdminAIConfigPage() {
  const [features, setFeatures] = useState<AIFeature[]>([]);
  const [stats, setStats] = useState<AIStats>({ activeFeatures: 0, totalFeatures: 0, apiCallsToday: 0, costToday: 0, avgConfidence: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/ai-config');
      const data = await res.json();
      setFeatures(data.features);
      setStats(data.stats);
    } catch (error) {
      toast.error('Failed to fetch AI config');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, newState: boolean) => {
    const updated = features.map(f => f.id === id ? { ...f, active: newState } : f);
    setFeatures(updated);

    try {
      await fetch('/api/ai-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: newState }),
      });

      const activeCount = updated.filter(f => f.active).length;
      setStats({ ...stats, activeFeatures: activeCount });
      toast.success(newState ? 'Feature enabled' : 'Feature disabled');
    } catch (error) {
      toast.error('Failed to update feature');
      fetchData();
    }
  };

  const handleThresholdChange = (id: string, threshold: number) => {
    setFeatures(features.map(f => f.id === id ? { ...f, threshold } : f));
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await fetch('/api/ai-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', features }),
      });
      toast.success('Configuration saved successfully');
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', padding: '22px' }}>
      <style>{`
        input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: ${colors.border};
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          cursor: pointer;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${colors.brand};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${colors.brand};
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FFE8D6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} style={{ color: colors.brand }} />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '700', color: colors.ink, margin: '0 0 2px 0' }}>AI Configuration</h1>
            <p style={{ fontSize: '12px', color: colors.t3, margin: 0 }}>{stats.activeFeatures} of {stats.totalFeatures} features active · {stats.apiCallsToday.toLocaleString()} calls today</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => toast.info('Usage logs - coming soon')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${colors.border}`, background: colors.card, color: colors.t2, cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
            <LogOut size={14} />
            Usage Logs
          </button>
          <button onClick={handleSaveConfig} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', background: colors.brand, color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '600', opacity: saving ? 0.6 : 1 }}>
            <Settings size={14} />
            {saving ? 'Saving...' : 'Save Config'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Active Features', value: `${stats.activeFeatures}/${stats.totalFeatures}`, color: colors.brand },
          { label: 'API Calls Today', value: stats.apiCallsToday.toLocaleString(), color: '#0F1A2E' },
          { label: 'Cost Today', value: `$${stats.costToday.toFixed(2)}`, color: colors.green },
          { label: 'Avg Confidence', value: `${stats.avgConfidence}%`, color: colors.brand },
        ].map(stat => (
          <div key={stat.label} style={{ background: colors.card, borderRadius: '10px', padding: '14px 16px', border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px rgba(15,26,46,0.06)' }}>
            <div style={{ fontSize: '10px', fontWeight: '600', color: colors.t3, textTransform: 'uppercase', marginBottom: '6px' }}>{stat.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Features List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: colors.t3 }}>Loading AI features...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {features.map(feature => (
            <div key={feature.id} style={{ background: colors.card, borderRadius: '10px', padding: '16px', border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px rgba(15,26,46,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: feature.active ? 1 : 0.6 }}>
              {/* Left Side */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '700', color: colors.ink, margin: 0 }}>{feature.name}</h3>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: feature.active ? colors.green : colors.t3 }}>
                    {feature.active ? '●' : '○'} {feature.active ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: colors.t3, margin: '0 0 8px 0' }}>{feature.description}</p>
                <p style={{ fontSize: '10px', color: colors.t2, margin: 0 }}>Model: <strong>{feature.modelName}</strong></p>
              </div>

              {/* Right Side - Threshold Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px', paddingLeft: '20px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: '600', color: colors.t3 }}>Confidence Threshold</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: colors.brand }}>{feature.threshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={feature.threshold}
                    onChange={(e) => handleThresholdChange(feature.id, parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => handleToggle(feature.id, !feature.active)}
                  style={{
                    width: '50px',
                    height: '28px',
                    borderRadius: '14px',
                    border: 'none',
                    background: feature.active ? colors.green : colors.border,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px 4px',
                    position: 'relative',
                    transition: 'background 0.3s',
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '12px',
                    background: '#fff',
                    position: 'absolute',
                    left: feature.active ? '24px' : '2px',
                    transition: 'left 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
