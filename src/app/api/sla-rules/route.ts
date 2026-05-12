import { NextRequest } from 'next/server';
import { readJson, writeJson, nextId } from '@/lib/db';

type SlaRule = {
  id: string; name: string; categoryCode: string; category: string;
  department: string; priority: string; responseHours: number;
  resolutionHours: number; escalationLevels: number;
  active: boolean; note?: string; isOverride?: boolean;
};

export async function GET() {
  const rules = readJson<SlaRule[]>('sla-rules.json');
  return Response.json(rules);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rules = readJson<SlaRule[]>('sla-rules.json');
  const newItem: SlaRule = { ...body, id: nextId(rules, 'sla'), active: true };
  rules.unshift(newItem);
  writeJson('sla-rules.json', rules);
  return Response.json(newItem, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const rules = readJson<SlaRule[]>('sla-rules.json');
  const idx = rules.findIndex(r => r.id === body.id);
  if (idx === -1) return Response.json({ error: 'Rule not found' }, { status: 404 });
  rules[idx] = { ...rules[idx], ...body };
  writeJson('sla-rules.json', rules);
  return Response.json(rules[idx]);
}
