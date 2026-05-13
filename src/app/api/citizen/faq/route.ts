import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/citizen-faq.json');

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
  const newItem = { id: 'f' + (data.length + 1), ...body };
  data.push(newItem);
  writeData(data);
  return NextResponse.json(newItem, { status: 201 });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const data = readData();
  const filtered = data.filter((f: { id: string }) => f.id !== body.id);
  if (filtered.length === data.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeData(filtered);
  return NextResponse.json({ success: true });
}
