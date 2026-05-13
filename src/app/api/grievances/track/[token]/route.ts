import { NextRequest, NextResponse } from 'next/server';
import { readJson } from '@/lib/db';
import type { Complaint } from '@/types/complaint';

// GET /api/grievances/track/[token] — Track grievance by token
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const complaints = readJson<Complaint[]>('complaints.json');
    const complaint = complaints.find(c => c.token === token);

    if (!complaint) {
      return NextResponse.json({ error: 'Grievance not found. Please check the token number.' }, { status: 404 });
    }

    return NextResponse.json({ data: complaint });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track grievance.' }, { status: 500 });
  }
}
