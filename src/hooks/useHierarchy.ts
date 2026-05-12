import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type HierarchyNode = {
  id: string; name: string; type: string;
  headCount?: number; children?: HierarchyNode[];
};

const KEY = ['hierarchy'] as const;

async function fetchTree(): Promise<HierarchyNode> {
  const res = await fetch('/api/hierarchy');
  if (!res.ok) throw new Error('Failed to fetch hierarchy');
  return res.json();
}

export function useHierarchy() {
  return useQuery({ queryKey: KEY, queryFn: fetchTree });
}

export function useUpdateHierarchy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: HierarchyNode) =>
      fetch('/api/hierarchy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
