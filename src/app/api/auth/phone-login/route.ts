import { NextRequest, NextResponse } from 'next/server';
import { generateSessionToken } from '@/lib/db';
import { createSession } from '@/lib/session-store';
import { verifyOTP } from '@/lib/otp-store';

// Hardcoded demo users - NO file I/O
const DEMO_USERS = [
  { id: 'u1', name: 'Ravi Varma', phone: '9876543210', email: 'ravi.varma@gujarat.gov.in', role: 'nodal_officer' as const, district: 'Ahmedabad', department: 'Water Supply', designation: 'Nodal Officer' },
  { id: 'u2', name: 'Anita Sharma', phone: '9876543211', email: 'anita.sharma@gujarat.gov.in', role: 'clerk' as const, district: 'Vadodara', department: 'Power', designation: 'Clerk' },
  { id: 'u5', name: 'Demo Citizen', phone: '9123456789', email: 'demo.citizen@example.com', role: 'citizen' as const, district: 'Ahmedabad', department: 'N/A', designation: 'Citizen' },
];

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
      console.log(`[PHONE-LOGIN] Invalid OTP for ${phone}: ${otp}`);
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    console.log(`[PHONE-LOGIN] OTP verified for ${phone}`);

    // Find user by phone or auto-create
    let user = DEMO_USERS.find(u => u.phone === phone);

    if (!user) {
      // Auto-create citizen for any phone
      user = {
        id: `u_${phone}`,
        name: `Citizen ${phone.slice(-4)}`,
        phone,
        email: `${phone}@citizen.local`,
        role: 'citizen' as const,
        district: 'Ahmedabad',
        department: 'N/A',
        designation: 'Citizen'
      };
    }

    // Create session token
    const token = generateSessionToken();
    createSession(token, user.id, user.role);

    // Return user (without password)
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        district: user.district,
        department: user.department,
        designation: user.designation,
        initials: user.name.split(' ').map(n => n[0]).join('').slice(0, 2),
        avatarColor: '#0891B2',
        permissions: ['complaints.submit', 'complaints.track'],
        status: 'active'
      },
      token
    });

    // Set session cookie
    response.cookies.set('gms-session', token, {
      httpOnly: true,
      secure: process.env.VERCEL === 'true' || process.env.NODE_ENV === 'production',
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
