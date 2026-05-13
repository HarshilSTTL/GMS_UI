import { NextRequest, NextResponse } from 'next/server';
import { generateSessionToken } from '@/lib/db';
import { createSession } from '@/lib/session-store';
import { logAuth } from '@/lib/logger';

// DEMO CITIZEN — registration always returns this user's data
const DEMO_CITIZEN = {
  id: 'u5',
  name: 'Rajesh Patel',
  phone: '9876543210',
  email: 'citizen@gmail.com',
  role: 'citizen' as const,
  district: 'Ahmedabad',
  department: 'N/A',
  designation: 'Citizen',
  initials: 'RP',
  avatarColor: '#F4811F',
  permissions: ['complaints.submit', 'complaints.track'],
  status: 'active',
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { firstName, lastName, phone } = data;

    if (!firstName || !lastName || !phone) {
      return NextResponse.json({ error: 'First name, last name, and phone are required.' }, { status: 400 });
    }

    logAuth('Citizen registration (demo)', DEMO_CITIZEN.id, `Registered: ${firstName} ${lastName} / ${phone} → mapped to demo citizen`);

    // Always create a session for demo citizen
    const token = generateSessionToken();
    createSession(token, DEMO_CITIZEN.id, DEMO_CITIZEN.role);

    const response = NextResponse.json({ user: DEMO_CITIZEN, token });

    response.cookies.set('gms-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
}
