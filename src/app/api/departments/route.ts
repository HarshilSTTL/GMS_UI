import { NextRequest } from 'next/server';
import { readJson, writeJson, nextId } from '@/lib/db';

type Department = {
  id: string; name: string; full: string;
  sla_days: number; officers: number; active: boolean;
  categories: string[];
};

export async function GET() {
  const departments = readJson<Department[]>('departments.json');
  return Response.json(departments);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const departments = readJson<Department[]>('departments.json');
  const newItem: Department = {
    ...body,
    id: nextId(departments, 'd'),
    active: true,
    categories: body.categories ?? [],
  };
  departments.push(newItem);
  writeJson('departments.json', departments);
  return Response.json(newItem, { status: 201 });
}
