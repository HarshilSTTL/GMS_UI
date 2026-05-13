import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type WfState = {
  id: string; label: string; color: string;
  isInitial: boolean; isTerminal: boolean;
};

export type WfTransition = {
  id: string; from: string; to: string; action: string;
  trigger: string; description: string;
};

export type WorkflowData = {
  states: WfState[];
  transitions: WfTransition[];
  actionsByState: Record<string, string[]>;
};

const KEY = ['workflow'] as const;

async function fetchWorkflow(): Promise<WorkflowData> {
  const res = await fetch('/api/workflow');
  if (!res.ok) throw new Error('Failed to fetch workflow');
  return res.json();
}

export function useWorkflow() {
  return useQuery({ queryKey: KEY, queryFn: fetchWorkflow });
}

export function useUpdateWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkflowData) =>
      fetch('/api/workflow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
