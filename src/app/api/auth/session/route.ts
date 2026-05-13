import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session-store';

// Hardcoded demo users - NO file I/O
const DEMO_USERS: any = {
  u1: { id: 'u1', name: 'Ravi Varma', email: 'ravi.varma@gujarat.gov.in', role: 'nodal_officer', district: 'Ahmedabad', department: 'Water Supply', designation: 'Nodal Officer' },
  u2: { id: 'u2', name: 'Anita Sharma', email: 'anita.sharma@gujarat.gov.in', role: 'clerk', district: 'Vadodara', department: 'Power', designation: 'Clerk' },
  u3: { id: 'u3', name: 'Bhupesh Patel', email: 'bhupesh.patel@gujarat.gov.in', role: 'admin', district: 'Surat', department: 'Admin', designation: 'Admin' },
  u4: { id: 'u4', name: 'CM Office', email: 'cm.office@gujarat.gov.in', role: 'cm', district: 'Gandhinagar', department: 'CM Office', designation: 'CM' },
  u5: { id: 'u5', name: 'Demo Citizen', email: 'demo.citizen@example.com', role: 'citizen', district: 'Ahmedabad', department: 'N/A', designation: 'Citizen' },
};

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('gms-session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get session from store
    const session = getSession(token);

    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Find user in demo data
    const user = DEMO_USERS[session.userId];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        ...user,
        initials: user.name.split(' ').map((n: string) => n[0]).join(''),
        avatarColor: '#3B82F6',
        permissions: user.role === 'admin' ? ['all'] : ['complaints.view'],
        status: 'active'
      },
      token
    });
  } catch (error) {
    console.error('[SESSION ERROR]', error);
    return NextResponse.json({ error: 'Session check failed' }, { status: 500 });
  }
}
