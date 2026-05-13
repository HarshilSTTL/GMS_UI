import { NextRequest } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import type { Officer } from '@/types';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const officers = readJson<Officer[]>('officers.json');
  const item = officers.find(o => o.id === id);
  if (!item) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(item);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.json();
  const officers = readJson<Officer[]>('officers.json');
  const idx = officers.findIndex(o => o.id === id);
  if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });
  officers[idx] = { ...officers[idx], ...body };
  writeJson('officers.json', officers);
  return Response.json(officers[idx]);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const officers = readJson<Officer[]>('officers.json');
  const filtered = officers.filter(o => o.id !== id);
  if (filtered.length === officers.length) return Response.json({ error: 'Not found' }, { status: 404 });
  writeJson('officers.json', filtered);
  return Response.json({ ok: true });
}
