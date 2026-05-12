import { NextRequest } from 'next/server';
import { readJson, writeJson } from '@/lib/db';

type Permission = { module: string; code: string; levels: string[] };
type Role = { id: string; name: string; label: string; description: string; color: string; bg: string; protected: boolean; permissions: Permission[] };

export async function GET() {
  const roles = readJson<Role[]>('roles.json');
  return Response.json(roles);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, permissions } = body;
  const roles = readJson<Role[]>('roles.json');
  const idx = roles.findIndex(r => r.id === id);
  if (idx === -1) return Response.json({ error: 'Role not found' }, { status: 404 });
  if (roles[idx].protected) return Response.json({ error: 'Protected role cannot be modified' }, { status: 403 });
  roles[idx] = { ...roles[idx], permissions };
  writeJson('roles.json', roles);
  return Response.json(roles[idx]);
}
