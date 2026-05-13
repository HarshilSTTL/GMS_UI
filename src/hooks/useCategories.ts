import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type GmsCategory = {
  id: string; code: string; name: string; description: string;
  department: string; slaHours: number; priority: string;
  active: boolean; complaintCount: number;
};

const KEY = ['categories'] as const;

async function fetchAll(): Promise<GmsCategory[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export function useCategories() {
  return useQuery({ queryKey: KEY, queryFn: fetchAll });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<GmsCategory>) =>
      fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/categories?id=${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
