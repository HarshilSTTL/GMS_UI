import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface AIFeature {
  id: string;
  name: string;
  description: string;
  active: boolean;
  confidence: number;
  lastRun?: string;
  modelVersion?: string;
  accuracy?: number;
}

export function useAIConfig() {
  const [features, setFeatures] = useState<AIFeature[]>([]);
  const [stats, setStats] = useState({ activeModels: 0, avgConfidence: 0, autoAssignmentsToday: 0, duplicatesCaught: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/ai-config');
      const data = await res.json();
      setFeatures(data.features);
      setStats(data.stats);
    } catch (error) {
      toast.error('Failed to fetch AI configuration');
    } finally {
      setLoading(false);
    }
  };

  const updateFeature = async (id: string, updates: Partial<AIFeature>) => {
    try {
      const res = await fetch('/api/ai-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const updated = await res.json();
      setFeatures(features.map(f => f.id === id ? updated : f));
      toast.success('AI feature updated');
      return updated;
    } catch (error) {
      toast.error('Failed to update AI feature');
      throw error;
    }
  };

  const toggleFeature = async (id: string) => {
    const feature = features.find(f => f.id === id);
    if (feature) {
      await updateFeature(id, { active: !feature.active });
    }
  };

  return { features, stats, loading, updateFeature, toggleFeature };
}
