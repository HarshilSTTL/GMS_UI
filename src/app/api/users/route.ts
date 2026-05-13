import { NextRequest } from 'next/server';
import { readJson, writeJson, nextId } from '@/lib/db';

type User = {
  id: string; name: string; email: string; role: string;
  dept: string; district: string; status: string;
  lastLogin: string; complaints: number;
};

export async function GET() {
  const users = readJson<User[]>('users.json');
  return Response.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const users = readJson<User[]>('users.json');
  const newItem: User = {
    ...body,
    id: nextId(users, 'u'),
    status: 'active',
    lastLogin: new Date().toISOString().slice(0, 10),
    complaints: 0,
  };
  users.push(newItem);
  writeJson('users.json', users);
  return Response.json(newItem, { status: 201 });
}
