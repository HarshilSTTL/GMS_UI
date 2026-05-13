import { NextRequest, NextResponse } from 'next/server';
import { readJson } from '@/lib/db';
import { getSession } from '@/lib/session-store';
import type { User } from '@/types/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('gms-session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const session = getSession(token);

    if (!session) {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
    }

    if (new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Session expired.' }, { status: 401 });
    }

    const users = readJson<User[]>('users.json');
    const user = users.find(u => u.id === session.userId);

    if (!user || user.status === 'suspended') {
      return NextResponse.json({ error: 'User not found or suspended.' }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, token: session.token });
  } catch (error) {
    return NextResponse.json({ error: 'Session check failed.' }, { status: 500 });
  }
}
