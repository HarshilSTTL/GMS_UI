import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type Permission = { module: string; code: string; levels: string[] };
export type GmsRole = {
  id: string; name: string; label: string; description: string;
  color: string; bg: string; protected: boolean; permissions: Permission[];
};

const KEY = ['roles'] as const;

async function fetchAll(): Promise<GmsRole[]> {
  const res = await fetch('/api/roles');
  if (!res.ok) throw new Error('Failed to fetch roles');
  return res.json();
}

export function useRoles() {
  return useQuery({ queryKey: KEY, queryFn: fetchAll });
}

export function useUpdateRolePermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: Permission[] }) =>
      fetch('/api/roles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, permissions }),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
