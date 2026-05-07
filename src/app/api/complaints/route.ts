import { NextRequest } from 'next/server';
import { readJson, writeJson, nextId } from '@/lib/db';
import type { Complaint } from '@/types';

export async function GET() {
  const complaints = readJson<Complaint[]>('complaints.json');
  return Response.json(complaints);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const complaints = readJson<Complaint[]>('complaints.json');
  const newItem: Complaint = {
    ...body,
    id: nextId(complaints, 'c'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolvedAt: null,
  };
  complaints.unshift(newItem);
  writeJson('complaints.json', complaints);
  return Response.json(newItem, { status: 201 });
}
