import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
  const data = readData();
  const citizenId = req.nextUrl.searchParams.get('citizenId');

  if (citizenId) {
    const filtered = data.filter((n: { citizenId?: string }) =>
      n.citizenId === citizenId || !n.citizenId
    );
    return NextResponse.json(filtered);
  }

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const data = readData();
  const citizenId = req.nextUrl.searchParams.get('citizenId');

  if (body.markAllRead) {
    data.forEach((n: { isRead: boolean; citizenId?: string }) => {
      if (!citizenId || n.citizenId === citizenId || !n.citizenId) {
        n.isRead = true;
      }
    });
    writeData(data);
    const filtered = citizenId
      ? data.filter((n: { citizenId?: string }) => n.citizenId === citizenId || !n.citizenId)
      : data;
    return NextResponse.json(filtered);
  }

  const idx = data.findIndex((n: { id: string }) => n.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data[idx].isRead = body.isRead !== undefined ? body.isRead : true;
  writeData(data);
  return NextResponse.json(data[idx]);
}
