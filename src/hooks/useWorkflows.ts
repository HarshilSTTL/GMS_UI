import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface WorkflowStep {
  id: string;
  name: string;
  role: string;
  action: string;
  auto: boolean;
  slaHours: number;
}

export interface Workflow {
  id: string;
  name: string;
  category: string;
  active: boolean;
  steps: WorkflowStep[];
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/workflows');
      const data = await res.json();
      setWorkflows(data.workflows);
    } catch (error) {
      toast.error('Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  };

  const addWorkflow = async (workflow: Omit<Workflow, 'id'>) => {
    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow),
      });
      const newWorkflow = await res.json();
      setWorkflows([...workflows, newWorkflow]);
      toast.success('Workflow created');
      return newWorkflow;
    } catch (error) {
      toast.error('Failed to create workflow');
      throw error;
    }
  };

  const updateWorkflow = async (id: string, updates: Partial<Workflow>) => {
    try {
      const res = await fetch('/api/workflows', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const updated = await res.json();
      setWorkflows(workflows.map(w => w.id === id ? updated : w));
      toast.success('Workflow updated');
      return updated;
    } catch (error) {
      toast.error('Failed to update workflow');
      throw error;
    }
  };

  const deleteWorkflow = async (id: string) => {
    try {
      await fetch(`/api/workflows?id=${id}`, { method: 'DELETE' });
      setWorkflows(workflows.filter(w => w.id !== id));
      toast.success('Workflow deleted');
    } catch (error) {
      toast.error('Failed to delete workflow');
      throw error;
    }
  };

  const toggleWorkflow = async (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (workflow) {
      await updateWorkflow(id, { active: !workflow.active });
    }
  };

  return { workflows, loading, addWorkflow, updateWorkflow, deleteWorkflow, toggleWorkflow };
}
