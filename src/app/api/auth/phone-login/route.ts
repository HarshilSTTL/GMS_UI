import { NextRequest, NextResponse } from 'next/server';
import { generateSessionToken } from '@/lib/db';
import { createSession } from '@/lib/session-store';
import { verifyOTP } from '@/lib/otp-store';

// DEMO CITIZEN — any phone/OTP always logs in as this user
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
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 });
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: 'Invalid OTP format' }, { status: 400 });
    }

    // Verify OTP
    if (!verifyOTP(phone, otp)) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    // Always use demo citizen regardless of phone number
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
    console.error('[PHONE-LOGIN ERROR]', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
