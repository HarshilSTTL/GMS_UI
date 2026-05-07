import { NextRequest } from 'next/server';
import { readJson, writeJson } from '@/lib/db';

type Department = {
  id: string; name: string; full: string;
  sla_days: number; officers: number; active: boolean;
  categories: string[];
};

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const departments = readJson<Department[]>('departments.json');
  const item = departments.find(d => d.id === id);
  if (!item) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(item);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.json();
  const departments = readJson<Department[]>('departments.json');
  const idx = departments.findIndex(d => d.id === id);
  if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });
  departments[idx] = { ...departments[idx], ...body };
  writeJson('departments.json', departments);
  return Response.json(departments[idx]);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const departments = readJson<Department[]>('departments.json');
  const filtered = departments.filter(d => d.id !== id);
  if (filtered.length === departments.length) return Response.json({ error: 'Not found' }, { status: 404 });
  writeJson('departments.json', filtered);
  return Response.json({ ok: true });
}
