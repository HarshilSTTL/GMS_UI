import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson, generateToken } from '@/lib/db';
import type { Complaint } from '@/types/complaint';

export async function GET(req: NextRequest) {
  try {
    const complaints = readJson<Complaint[]>('complaints.json');
    const { searchParams } = new URL(req.url);
    const citizenId = searchParams.get('citizenId');

    const result = citizenId
      ? complaints.filter(c => c.citizenId === citizenId)
      : complaints;

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/citizen/grievances failed:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const complaints = readJson<Complaint[]>('complaints.json');
    const nums = complaints
      .map(c => parseInt(c.id.replace('c', ''), 10))
      .filter(n => !isNaN(n));
    const maxId = nums.length ? Math.max(...nums) : 0;
    const id = `c${maxId + 1}`;
    const token = generateToken();
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id,
      token,
      title: body.title || '',
      description: body.description || '',
      category: body.category || '',
      department: body.department || 'General',
      status: 'pending',
      priority: body.priority || 'medium',
      channel: body.channel || 'web',
      slaStatus: 'ok',
      slaDaysLeft: 7,
      citizenId: body.citizenId || '',
      citizenName: body.citizenName || 'Unknown',
      citizenPhone: body.citizenPhone || '',
      citizenEmail: body.citizenEmail || null,
      location: body.location || '',
      ward: body.ward || null,
      district: body.district || '',
      assignedTo: null,
      groupId: null,
      isGroupPrimary: false,
      timeline: [{
        id: `tl-${id}-1`,
        type: 'created',
        title: 'Grievance Filed',
        actor: body.citizenName || 'Citizen',
        actorRole: 'citizen',
        timestamp: now,
        description: `Filed via ${body.channel || 'web'}. Token: ${token}`
      }],
      feedback: null,
      rating: null,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    };

    complaints.push(newComplaint);
    writeJson('complaints.json', complaints);

    return NextResponse.json(newComplaint, { status: 201 });
  } catch (error) {
    console.error('POST /api/citizen/grievances failed:', error);
    return NextResponse.json({ error: 'Failed to create grievance' }, { status: 500 });
  }
}
