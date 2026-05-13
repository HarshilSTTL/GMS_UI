import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson, nextId, generateToken } from '@/lib/db';
import { logData, logError } from '@/lib/logger';
import type { Complaint } from '@/types/complaint';

// GET /api/grievances — List all grievances with optional filters
export async function GET(request: NextRequest) {
  try {
    const complaints = readJson<Complaint[]>('complaints.json');
    const { searchParams } = new URL(request.url);

    let filtered = [...complaints];

    // Filter by citizenId
    const citizenId = searchParams.get('citizenId');
    if (citizenId) {
      filtered = filtered.filter(c => c.citizenId === citizenId);
    }

    // Filter by department
    const department = searchParams.get('department');
    if (department) {
      filtered = filtered.filter(c => c.department === department);
    }

    // Filter by status
    const status = searchParams.get('status');
    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }

    // Filter by assigned officer
    const officerId = searchParams.get('officerId');
    if (officerId) {
      filtered = filtered.filter(c => c.assignedTo?.id === officerId);
    }

    // Filter by token
    const token = searchParams.get('token');
    if (token) {
      filtered = filtered.filter(c => c.token === token);
    }

    // Search by title
    const search = searchParams.get('search');
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(s) ||
        c.token.toLowerCase().includes(s) ||
        c.category.toLowerCase().includes(s)
      );
    }

    // Sort
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    filtered.sort((a, b) => {
      const aVal = String(a[sort as keyof Complaint] ?? '');
      const bVal = String(b[sort as keyof Complaint] ?? '');
      return order === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return NextResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    });
  } catch (error) {
    logError('GET /api/grievances failed', String(error));
    return NextResponse.json({ error: 'Failed to fetch grievances.' }, { status: 500 });
  }
}

// POST /api/grievances — Create a new grievance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      citizenId, citizenName, citizenPhone, citizenEmail,
      title, description, category, department,
      priority = 'medium', channel = 'web',
      location, ward, district
    } = body;

    if (!citizenId || !title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const complaints = readJson<Complaint[]>('complaints.json');
    const id = nextId(complaints, 'c');
    const token = generateToken();
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id,
      token,
      title,
      description,
      category,
      department: department || 'General',
      status: 'open',
      priority,
      channel,
      slaStatus: 'ok',
      slaDaysLeft: 10,
      citizenId,
      citizenName: citizenName || 'Unknown',
      citizenPhone: citizenPhone || '',
      citizenEmail: citizenEmail || null,
      location: location || '',
      ward: ward || null,
      district: district || '',
      assignedTo: null,
      groupId: null,
      isGroupPrimary: false,
      timeline: [
        {
          id: `tl-${id}-1`,
          type: 'created',
          title: 'Grievance Filed',
          actor: citizenName || 'Citizen',
          actorRole: 'citizen',
          timestamp: now,
          description: `Grievance filed via ${channel}. Token: ${token}`
        }
      ],
      feedback: null,
      rating: null,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null
    };

    complaints.push(newComplaint);
    writeJson('complaints.json', complaints);

    // Create notification for citizen
    try {
      const notifications = readJson<any[]>('notifications.json');
      notifications.push({
        id: `n${notifications.length + 1}`,
        userId: citizenId,
        title: 'Grievance Filed',
        message: `Your grievance ${token} has been filed successfully. Category: ${category}.`,
        timestamp: now,
        isRead: false,
        type: 'acknowledgement',
        grievanceId: id
      });
      writeJson('notifications.json', notifications);
    } catch {}

    logData('CREATE', 'grievances', id);

    return NextResponse.json({ data: newComplaint }, { status: 201 });
  } catch (error) {
    logError('POST /api/grievances failed', String(error));
    return NextResponse.json({ error: 'Failed to create grievance.' }, { status: 500 });
  }
}
