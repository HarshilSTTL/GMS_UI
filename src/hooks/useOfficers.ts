import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Officer } from '@/types';

const KEY = ['officers'] as const;

async function fetchAll(): Promise<Officer[]> {
  const res = await fetch('/api/officers');
  if (!res.ok) throw new Error('Failed to fetch officers');
  return res.json();
}

export function useOfficers() {
  return useQuery({ queryKey: KEY, queryFn: fetchAll });
}

export function useUpdateOfficer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Officer> }) =>
      fetch(`/api/officers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useCreateOfficer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Officer, 'id'>) =>
      fetch('/api/officers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteOfficer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetch(`/api/officers/${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
