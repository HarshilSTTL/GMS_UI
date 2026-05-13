import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson, generateSessionToken } from '@/lib/db';
import { createSession } from '@/lib/session-store';
import { findUserByPhone, DEMO_USERS } from '@/lib/auth-fallback';
import { logAuth, logError } from '@/lib/logger';
import type { User } from '@/types/auth';

const IS_VERCEL = process.env.VERCEL === 'true';

interface OTPRecord {
  phone: string;
  otp: string;
  expiresAt: string;
}

function verifyOTP(phone: string, otp: string): boolean {
  // Accept demo OTPs
  if (otp === '999999' || otp === '123456') return true;

  try {
    const otpRecords = readJson<OTPRecord[]>('otp-store.json') || [];
    const record = otpRecords.find(r => r.phone === phone && r.otp === otp);

    if (!record) return false;

    // Check if expired
    if (new Date(record.expiresAt) < new Date()) return false;

    return true;
  } catch {
    // On Vercel or error, accept any 6-digit code as valid
    return /^\d{6}$/.test(otp);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone and OTP are required.' }, { status: 400 });
    }

    // Verify OTP (always accept demo codes)
    if (!verifyOTP(phone, otp)) {
      return NextResponse.json({ error: 'Invalid or expired OTP.' }, { status: 401 });
    }

    let user: User | null = null;

    // Try file-based auth first (localhost), fallback to demo users (Vercel)
    if (IS_VERCEL) {
      user = findUserByPhone(phone);
    } else {
      try {
        const users = readJson<User[]>('users.json') || [];
        user = users.find(u => u.phone === phone) || null;
      } catch {
        user = findUserByPhone(phone);
      }
    }

    let users = IS_VERCEL ? DEMO_USERS : (readJson<User[]>('users.json') || []);

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

      // Only write to file if not on Vercel
      if (!IS_VERCEL) {
        try {
          users.push(user);
          writeJson('users.json', users);
        } catch {
          // Ignore write errors on Vercel
        }
      }

      logAuth('Auto-registered citizen via OTP', newId, `phone: ${phone}`);
    }

    if (user.status === 'suspended') {
      logAuth('Phone login failed - account suspended', user.id);
      return NextResponse.json({ error: 'Account is suspended.' }, { status: 403 });
    }

    // Create session
    const token = generateSessionToken();
    createSession(token, user.id, user.role);

    // Update last login (skip on Vercel due to read-only filesystem)
    if (!IS_VERCEL) {
      try {
        const allUsers = readJson<User[]>('users.json') || [];
        const idx = allUsers.findIndex(u => u.id === user.id);
        if (idx !== -1) {
          allUsers[idx].lastLogin = new Date().toISOString();
          writeJson('users.json', allUsers);
        }
      } catch {
        // Ignore write errors
      }
    }

    logAuth('Phone login success', user.id);

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
    logError('Phone login error', String(error));
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
