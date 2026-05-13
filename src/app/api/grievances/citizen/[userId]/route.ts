import { NextRequest, NextResponse } from 'next/server';
import { readJson } from '@/lib/db';
import type { Complaint } from '@/types/complaint';

// GET /api/grievances/citizen/[userId] — Get all grievances for a citizen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const complaints = readJson<Complaint[]>('complaints.json');
    const citizenComplaints = complaints.filter(c => c.citizenId === userId);

    return NextResponse.json({
      data: citizenComplaints,
      total: citizenComplaints.length
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch citizen grievances.' }, { status: 500 });
  }
}
