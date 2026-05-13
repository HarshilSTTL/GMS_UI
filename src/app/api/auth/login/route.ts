import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson, generateSessionToken } from '@/lib/db';
import { createSession } from '@/lib/session-store';
import { findUserByEmail } from '@/lib/auth-fallback';
import { logAuth, logError } from '@/lib/logger';
import type { User } from '@/types/auth';

const IS_VERCEL = process.env.VERCEL === 'true';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    let user: User | null = null;

    // Try file-based auth first (localhost), fallback to demo users (Vercel)
    if (IS_VERCEL) {
      user = findUserByEmail(email, password);
    } else {
      try {
        const users = readJson<User[]>('users.json') || [];
        user = users.find(u => u.email === email && u.password === password) || null;
      } catch {
        user = findUserByEmail(email, password);
      }
    }

    if (!user) {
      logAuth('Login failed - invalid credentials', email);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (user.status === 'suspended') {
      logAuth('Login failed - account suspended', email);
      return NextResponse.json({ error: 'Account is suspended.' }, { status: 403 });
    }

    // Create session
    const token = generateSessionToken();
    createSession(token, user.id, user.role);

    // Update last login (skip on Vercel due to read-only filesystem)
    if (!IS_VERCEL) {
      try {
        const users = readJson<User[]>('users.json') || [];
        const userIdx = users.findIndex(u => u.id === user.id);
        if (userIdx !== -1) {
          users[userIdx].lastLogin = new Date().toISOString();
          writeJson('users.json', users);
        }
      } catch {
        // Skip on error
      }
    }

    logAuth('Login success', user.id, `role: ${user.role}`);

    const { password: _, ...safeUser } = user;
    const response = NextResponse.json({ user: safeUser, token });
    response.cookies.set('gms-session', token, {
      httpOnly: true,
      secure: IS_VERCEL || process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    });
    return response;
  } catch (error) {
    logError('Login error', String(error));
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
