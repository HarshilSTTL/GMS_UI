import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson, nextId, generateSessionToken } from '@/lib/db';
import { logAuth, logError } from '@/lib/logger';
import type { User } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { firstName, lastName, fatherName, phone, email, aadhaar, district, taluka, city, state, pincode, address } = data;

    if (!firstName || !lastName || !phone) {
      return NextResponse.json({ error: 'First name, last name, and phone are required.' }, { status: 400 });
    }

    const users = readJson<User[]>('users.json');

    // Check if phone already exists
    const existingUser = users.find(u => u.phone === phone);
    if (existingUser) {
      // Return existing user
      const token = generateSessionToken();
      const sessions = readJson<any[]>('sessions.json');
      sessions.push({
        token,
        userId: existingUser.id,
        role: existingUser.role,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
      writeJson('sessions.json', sessions);

      logAuth('Registration - existing user returned', existingUser.id);

      const { password: _, ...safeUser } = existingUser;
      const response = NextResponse.json({ user: safeUser, token });
      response.cookies.set('gms-session', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/'
      });
      return response;
    }

    // Create new citizen user
    const fullName = `${firstName} ${lastName}`.trim();
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const newId = nextId(users, 'u');

    const newUser: User = {
      id: newId,
      name: fullName,
      email: email || `${phone}@citizen.local`,
      phone,
      password: '',
      role: 'citizen',
      department: 'N/A',
      designation: 'Citizen',
      initials,
      avatarColor: '#0891B2',
      permissions: ['complaints.submit', 'complaints.track'],
      status: 'active',
      district: district || '',
      fatherName: fatherName || '',
      aadhaar: aadhaar || '',
      taluka: taluka || '',
      city: city || '',
      pincode: pincode || '',
      address: address || '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeJson('users.json', users);

    // Create session
    const token = generateSessionToken();
    const sessions = readJson<any[]>('sessions.json');
    sessions.push({
      token,
      userId: newId,
      role: 'citizen',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
    writeJson('sessions.json', sessions);

    logAuth('Citizen registered', newId, `name: ${fullName}, phone: ${phone}`);

    const { password: _, ...safeUser } = newUser;
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
    logError('Registration error', String(error));
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
}
