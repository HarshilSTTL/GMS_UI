import { NextRequest } from 'next/server';
import { readJson, writeJson } from '@/lib/db';

type User = {
  id: string; name: string; email: string; role: string;
  dept: string; district: string; status: string;
  lastLogin: string; complaints: number;
};

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const users = readJson<User[]>('users.json');
  const item = users.find(u => u.id === id);
  if (!item) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(item);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.json();
  const users = readJson<User[]>('users.json');
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });
  users[idx] = { ...users[idx], ...body };
  writeJson('users.json', users);
  return Response.json(users[idx]);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const users = readJson<User[]>('users.json');
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return Response.json({ error: 'Not found' }, { status: 404 });
  writeJson('users.json', filtered);
  return Response.json({ ok: true });
}
