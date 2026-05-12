import { NextRequest, NextResponse } from 'next/server';
import complaints from '@/data/complaints.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Filter complaints for the citizen user
    // In a real app, you'd filter by citizenEmail or userId
    // For now, return sample data
    const citizenComplaints = complaints.filter(c =>
      c.citizenEmail === 'rajesh@example.com' ||
      c.citizenEmail === 'priya@example.com' ||
      c.citizenEmail === 'vikram@example.com' ||
      c.citizenEmail === 'meera@example.com'
    );

    return NextResponse.json(citizenComplaints);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 });
  }
}
