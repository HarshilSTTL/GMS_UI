import { NextRequest, NextResponse } from 'next/server';
import complaints from '@/data/complaints.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const complaint = complaints.find(c => c.token === params.token);

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json(complaint);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch complaint' }, { status: 500 });
  }
}
