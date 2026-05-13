import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson, nextId } from '@/lib/db';

export async function GET() {
  const data = readJson<any[]>('faq.json');
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = readJson<any[]>('faq.json');
  const newItem = { id: nextId(data, 'f'), ...body };
  data.push(newItem);
  writeJson('faq.json', data);
  return NextResponse.json(newItem, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const data = readJson<any[]>('faq.json');
  const filtered = data.filter((f: any) => f.id !== body.id);
  if (filtered.length === data.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeJson('faq.json', data);
  return NextResponse.json({ success: true });
}
