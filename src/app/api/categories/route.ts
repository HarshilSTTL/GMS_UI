import { NextRequest } from 'next/server';
import { readJson, writeJson, nextId } from '@/lib/db';

type Category = {
  id: string; code: string; name: string; description: string;
  department: string; slaHours: number; priority: string;
  active: boolean; complaintCount: number;
};

export async function GET() {
  const categories = readJson<Category[]>('categories.json');
  return Response.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const categories = readJson<Category[]>('categories.json');
  const newItem: Category = { ...body, id: nextId(categories, 'cat'), complaintCount: 0 };
  categories.push(newItem);
  writeJson('categories.json', categories);
  return Response.json(newItem, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const categories = readJson<Category[]>('categories.json');
  const idx = categories.findIndex(c => c.id === body.id);
  if (idx === -1) return Response.json({ error: 'Category not found' }, { status: 404 });
  categories[idx] = { ...categories[idx], ...body };
  writeJson('categories.json', categories);
  return Response.json(categories[idx]);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'ID required' }, { status: 400 });
  const categories = readJson<Category[]>('categories.json');
  const filtered = categories.filter(c => c.id !== id);
  writeJson('categories.json', filtered);
  return Response.json({ deleted: id });
}
