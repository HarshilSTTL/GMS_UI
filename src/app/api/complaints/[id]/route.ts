import { NextRequest } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import type { Complaint } from '@/types';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const complaints = readJson<Complaint[]>('complaints.json');
  const item = complaints.find(c => c.id === id);
  if (!item) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(item);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.json();
  const complaints = readJson<Complaint[]>('complaints.json');
  const idx = complaints.findIndex(c => c.id === id);
  if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });
  complaints[idx] = { ...complaints[idx], ...body, updatedAt: new Date().toISOString() };
  writeJson('complaints.json', complaints);
  return Response.json(complaints[idx]);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const complaints = readJson<Complaint[]>('complaints.json');
  const filtered = complaints.filter(c => c.id !== id);
  if (filtered.length === complaints.length) return Response.json({ error: 'Not found' }, { status: 404 });
  writeJson('complaints.json', filtered);
  return Response.json({ ok: true });
}
