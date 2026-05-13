import { NextRequest, NextResponse } from 'next/server';
import { readJson } from '@/lib/db';
import { getSession } from '@/lib/session-store';
import { findUserById } from '@/lib/auth-fallback';
import type { User } from '@/types/auth';

const IS_VERCEL = process.env.VERCEL === 'true';

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

    // Skip expiry check on Vercel (in-memory sessions)
    if (!IS_VERCEL && new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Session expired.' }, { status: 401 });
    }

    let user: User | null = null;

    // Try file-based auth first, fallback to demo users
    if (IS_VERCEL) {
      user = findUserById(session.userId);
    } else {
      try {
        const users = readJson<User[]>('users.json') || [];
        user = users.find(u => u.id === session.userId) || null;
      } catch {
        user = findUserById(session.userId);
      }
    }

    if (!user || user.status === 'suspended') {
      return NextResponse.json({ error: 'User not found or suspended.' }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, token: session.token });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Session check failed.' }, { status: 500 });
  }
}
