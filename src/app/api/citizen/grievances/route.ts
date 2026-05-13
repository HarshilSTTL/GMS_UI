import { NextResponse } from 'next/server';
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

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = readData();
  const newGrievance = {
    id: 'cg' + (data.length + 1),
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
