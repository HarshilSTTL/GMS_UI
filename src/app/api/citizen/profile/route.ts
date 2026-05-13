import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/citizen-profile.json');

export async function GET() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return NextResponse.json(JSON.parse(raw));
}

export async function PUT(req: Request) {
  const body = await req.json();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const current = JSON.parse(raw);
  const updated = { ...current, ...body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
  return NextResponse.json(updated);
}
