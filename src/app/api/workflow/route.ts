import { NextRequest } from 'next/server';
import { readJson, writeJson } from '@/lib/db';

export async function GET() {
  const workflow = readJson('workflow.json');
  return Response.json(workflow);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  writeJson('workflow.json', body);
  return Response.json(body);
}
