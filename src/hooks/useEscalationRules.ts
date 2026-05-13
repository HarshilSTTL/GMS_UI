import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface EscalationRule {
  id: string;
  name: string;
  trigger: string;
  level: number;
  targetRole: string;
  notifyVia: string[];
  autoActions: string[];
  active: boolean;
}

export function useEscalationRules() {
  const [rules, setRules] = useState<EscalationRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/escalation-rules');
      const data = await res.json();
      setRules(data.rules);
    } catch (error) {
      toast.error('Failed to fetch escalation rules');
    } finally {
      setLoading(false);
    }
  };

  const addRule = async (rule: Omit<EscalationRule, 'id'>) => {
    try {
      const res = await fetch('/api/escalation-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      });
      const newRule = await res.json();
      setRules([...rules, newRule]);
      toast.success('Rule created');
      return newRule;
    } catch (error) {
      toast.error('Failed to create rule');
      throw error;
    }
  };

  const updateRule = async (id: string, updates: Partial<EscalationRule>) => {
    try {
      const res = await fetch('/api/escalation-rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const updated = await res.json();
      setRules(rules.map(r => r.id === id ? updated : r));
      toast.success('Rule updated');
      return updated;
    } catch (error) {
      toast.error('Failed to update rule');
      throw error;
    }
  };

  const deleteRule = async (id: string) => {
    try {
      await fetch(`/api/escalation-rules?id=${id}`, { method: 'DELETE' });
      setRules(rules.filter(r => r.id !== id));
      toast.success('Rule deleted');
    } catch (error) {
      toast.error('Failed to delete rule');
      throw error;
    }
  };

  const toggleRule = async (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (rule) {
      await updateRule(id, { active: !rule.active });
    }
  };

  return { rules, loading, addRule, updateRule, deleteRule, toggleRule };
}
