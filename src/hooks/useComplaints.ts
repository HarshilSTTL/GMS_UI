import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Complaint } from '@/types';

const KEY = ['complaints'] as const;

async function fetchAll(): Promise<Complaint[]> {
  const res = await fetch('/api/complaints');
  if (!res.ok) throw new Error('Failed to fetch complaints');
  return res.json();
}

async function fetchOne(id: string): Promise<Complaint> {
  const res = await fetch(`/api/complaints/${id}`);
  if (!res.ok) throw new Error('Complaint not found');
  return res.json();
}

export function useComplaints() {
  return useQuery({ queryKey: KEY, queryFn: fetchAll });
}

export function useComplaint(id: string) {
  return useQuery({ queryKey: [...KEY, id], queryFn: () => fetchOne(id) });
}

export function useUpdateComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Complaint> }) =>
      fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useCreateComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Complaint>) =>
      fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetch(`/api/complaints/${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
