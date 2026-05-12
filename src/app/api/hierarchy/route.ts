import { NextRequest } from 'next/server';
import { readJson, writeJson } from '@/lib/db';

export async function GET() {
  const hierarchy = readJson('hierarchy.json');
  return Response.json(hierarchy);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const hierarchy = readJson('hierarchy.json');
  writeJson('hierarchy.json', body);
  return Response.json(body);
}
