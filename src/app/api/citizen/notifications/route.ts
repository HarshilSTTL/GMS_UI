import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/citizen-notifications.json');

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

export async function PUT(req: Request) {
  const body = await req.json();
  const data = readData();
  if (body.markAllRead) {
    data.forEach((n: { isRead: boolean }) => { n.isRead = true; });
    writeData(data);
    return NextResponse.json(data);
  }
  const idx = data.findIndex((n: { id: string }) => n.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data[idx].isRead = body.isRead !== undefined ? body.isRead : true;
  writeData(data);
  return NextResponse.json(data[idx]);
}
