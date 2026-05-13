import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getComplaints() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'data/complaints.json'), 'utf-8');
  return JSON.parse(raw);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const complaints = getComplaints();
    const complaint = complaints.find((c: any) => c.token === token);

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json(complaint);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch complaint' }, { status: 500 });
  }
}
