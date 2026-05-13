import { NextRequest, NextResponse } from 'next/server';

import { readJson, writeJson, nextId } from '@/lib/db';

// Data is now in data/schemes.json at project root

export async function GET() {
  const data = readJson<any[]>('schemes.json');
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = readJson<any[]>('schemes.json');
  const newItem = { id: nextId(data, 's'), ...body };
  data.push(newItem);
  writeJson('schemes.json', data);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const data = readJson<any[]>('schemes.json');
  const idx = data.findIndex((s: any) => s.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data[idx] = { ...data[idx], ...body };
  writeJson('schemes.json', data);
  return NextResponse.json(data[idx]);
}
