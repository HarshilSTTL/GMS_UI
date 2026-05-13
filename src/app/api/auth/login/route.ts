import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson, generateSessionToken } from '@/lib/db';
import { logAuth, logError } from '@/lib/logger';
import type { User } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const users = readJson<User[]>('users.json');
    const user = users.find(u => u.email === email && u.password === password);

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
    const sessions = readJson<any[]>('sessions.json');
    sessions.push({
      token,
      userId: user.id,
      role: user.role,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
    writeJson('sessions.json', sessions);

    // Update last login
    user.lastLogin = new Date().toISOString();
    writeJson('users.json', users);

    logAuth('Login success', user.id, `role: ${user.role}`);

    const { password: _, ...safeUser } = user;
    const response = NextResponse.json({ user: safeUser, token });
    response.cookies.set('gms-session', token, {
      httpOnly: true,
      secure: false,
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
