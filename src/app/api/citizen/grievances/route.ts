import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/citizen-grievances.json');

function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data: unknown[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET(req: NextRequest) {
  const data = readData();
  const citizenId = req.nextUrl.searchParams.get('citizenId');
  const token = req.nextUrl.searchParams.get('token');

  // Track by token
  if (token) {
    const grievance = data.find((g: { token: string }) => g.token === token);
    if (grievance) return NextResponse.json(grievance);
    return NextResponse.json({ error: 'Grievance not found' }, { status: 404 });
  }

  // Filter by citizenId
  if (citizenId) {
    const filtered = data.filter((g: { citizenId?: string }) => g.citizenId === citizenId);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = readData();
  const newGrievance = {
    id: 'cg' + (data.length + 1),
    citizenId: body.citizenId || '',
    token: 'GJ-2026-' + String(Math.floor(10000 + Math.random() * 90000)),
    title: body.title || '',
    description: body.description || '',
    category: body.category || '',
    department: body.department || '',
    status: 'pending',
    priority: body.priority || 'medium',
    channel: body.channel || 'web',
    slaStatus: 'ok',
    slaDaysLeft: 7,
    location: body.location || '',
    ward: body.ward || '',
    district: body.district || '',
    officer: 'Unassigned',
    officerDept: body.department || '',
    submittedDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedback: null,
    rating: null,
  };
  data.push(newGrievance);
  writeData(data);
  return NextResponse.json(newGrievance, { status: 201 });
}
