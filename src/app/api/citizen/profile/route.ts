import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/citizen-profiles.json');

function readProfiles() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeProfiles(data: unknown[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET(req: NextRequest) {
  const citizenId = req.nextUrl.searchParams.get('citizenId');
  const profiles = readProfiles();

  if (citizenId) {
    const profile = profiles.find((p: { id: string }) => p.id === citizenId);
    if (profile) return NextResponse.json(profile);
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Fallback: return first profile (legacy)
  return NextResponse.json(profiles[0] || {});
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const citizenId = req.nextUrl.searchParams.get('citizenId') || body.id;
  const profiles = readProfiles();

  const idx = profiles.findIndex((p: { id: string }) => p.id === citizenId);
  if (idx >= 0) {
    profiles[idx] = { ...profiles[idx], ...body };
    writeProfiles(profiles);
    return NextResponse.json(profiles[idx]);
  }

  // If profile doesn't exist, create it
  const newProfile = { ...body, id: citizenId };
  profiles.push(newProfile);
  writeProfiles(profiles);
  return NextResponse.json(newProfile);
}
