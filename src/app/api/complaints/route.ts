import { NextRequest } from 'next/server';
import { readJson, writeJson, nextId } from '@/lib/db';
import type { Complaint } from '@/types';

function generateToken(): string {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 90000) + 10000);
  return `GVM-${year}-${random}`;
}

export async function GET() {
  const complaints = readJson<Complaint[]>('complaints.json');
  return Response.json(complaints);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const complaints = readJson<Complaint[]>('complaints.json');
  const now = new Date().toISOString();
  const newItem: Complaint = {
    status: 'open',
    priority: 'medium',
    channel: 'web',
    slaStatus: 'ok',
    slaDaysLeft: 5,
    district: 'Ahmedabad',
    assignedTo: undefined,
    groupId: undefined,
    isGroupPrimary: false,
    ...body,
    id: nextId(complaints, 'c'),
    token: generateToken(),
    createdAt: now,
    updatedAt: now,
    resolvedAt: undefined,
  };
  complaints.unshift(newItem);
  writeJson('complaints.json', complaints);
  return Response.json(newItem, { status: 201 });
}
