import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/citizen-schemes.json');

function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data: unknown[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(readData());
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = readData();
  const newItem = { id: 's' + (data.length + 1), ...body };
  data.push(newItem);
  writeData(data);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const data = readData();
  const idx = data.findIndex((s: { id: string }) => s.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data[idx] = { ...data[idx], ...body };
  writeData(data);
  return NextResponse.json(data[idx]);
}
