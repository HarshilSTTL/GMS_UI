import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson, generateSessionToken } from '@/lib/db';
import { logAuth, logError } from '@/lib/logger';
import type { User } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone and OTP are required.' }, { status: 400 });
    }

    // Verify OTP (accept 999999 as backdoor)
    if (otp !== '999999') {
      // In production, verify against stored OTP
      // For now, accept any 6-digit OTP
      if (!/^\d{6}$/.test(otp)) {
        return NextResponse.json({ error: 'Invalid OTP.' }, { status: 401 });
      }
    }

    const users = readJson<User[]>('users.json');
    let user = users.find(u => u.phone === phone);

    if (!user) {
      // Create a new citizen account for unknown phone numbers
      const newId = `u${users.length + 1}`;
      user = {
        id: newId,
        name: `Citizen ${phone.slice(-4)}`,
        email: `${phone}@citizen.local`,
        phone,
        password: '',
        role: 'citizen',
        department: 'N/A',
        designation: 'Citizen',
        initials: `C${phone.slice(-1)}`,
        avatarColor: '#0891B2',
        permissions: ['complaints.submit', 'complaints.track'],
        status: 'active',
        district: '',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      writeJson('users.json', users);
      logAuth('Auto-registered citizen via OTP', newId, `phone: ${phone}`);
    }

    if (user.status === 'suspended') {
      logAuth('Phone login failed - account suspended', user.id);
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

    logAuth('Phone login success', user.id);

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
    logError('Phone login error', String(error));
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
