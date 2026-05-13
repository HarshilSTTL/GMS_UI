import { NextRequest } from 'next/server';
import { readJson, writeJson, nextId } from '@/lib/db';
import type { Officer } from '@/types';

export async function GET() {
  const officers = readJson<Officer[]>('officers.json');
  return Response.json(officers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const officers = readJson<Officer[]>('officers.json');
  const newItem: Officer = { ...body, id: nextId(officers, 'o') };
  officers.push(newItem);
  writeJson('officers.json', officers);
  return Response.json(newItem, { status: 201 });
}
