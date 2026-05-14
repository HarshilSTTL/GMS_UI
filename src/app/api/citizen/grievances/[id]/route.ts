import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import type { Complaint } from '@/types/complaint';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const complaints = readJson<Complaint[]>('complaints.json');
    const item = complaints.find(c => c.id === id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch grievance' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const complaints = readJson<Complaint[]>('complaints.json');
    const idx = complaints.findIndex(c => c.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    complaints[idx] = { ...complaints[idx], ...body, updatedAt: new Date().toISOString() };
    writeJson('complaints.json', complaints);
    return NextResponse.json(complaints[idx]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update grievance' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const complaints = readJson<Complaint[]>('complaints.json');
    const filtered = complaints.filter(c => c.id !== id);
    if (filtered.length === complaints.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    writeJson('complaints.json', filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete grievance' }, { status: 500 });
  }
}
