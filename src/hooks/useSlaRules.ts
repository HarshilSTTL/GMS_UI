import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type EscalationStep = {
  level: number; afterHours: number; role: string; notify: string[];
};

export type SlaRule = {
  id: string; name: string; categoryCode: string; category: string;
  department: string; priority: string; responseHours: number;
  resolutionHours: number; escalationLevels: number;
  escalations: EscalationStep[];
  conditions: string[];
  active: boolean; note?: string; isOverride?: boolean;
};

const KEY = ['sla-rules'] as const;

async function fetchAll(): Promise<SlaRule[]> {
  const res = await fetch('/api/sla-rules');
  if (!res.ok) throw new Error('Failed to fetch SLA rules');
  return res.json();
}

export function useSlaRules() {
  return useQuery({ queryKey: KEY, queryFn: fetchAll });
}

export function useCreateSlaRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SlaRule>) =>
      fetch('/api/sla-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateSlaRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SlaRule> & { id: string }) =>
      fetch('/api/sla-rules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
