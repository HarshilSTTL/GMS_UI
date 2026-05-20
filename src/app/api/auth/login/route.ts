import { NextRequest, NextResponse } from 'next/server';
import { generateSessionToken } from '@/lib/db';
import { createSession } from '@/lib/session-store';

// Hardcoded demo users - NO file I/O
const DEMO_USERS = [
  { id: 'u1', name: 'Ravi Varma', email: 'ravi.varma@gujarat.gov.in', password: 'officer123', role: 'nodal_officer' as const, district: 'Ahmedabad', department: 'Water Supply', designation: 'Nodal Officer' },
  { id: 'u2', name: 'Anita Sharma', email: 'anita.sharma@gujarat.gov.in', password: 'clerk123', role: 'clerk' as const, district: 'Vadodara', department: 'Power', designation: 'Clerk' },
  { id: 'u3', name: 'Bhupesh Patel', email: 'bhupesh.patel@gujarat.gov.in', password: 'admin123', role: 'admin' as const, district: 'Surat', department: 'Admin', designation: 'Admin' },
  { id: 'u4', name: 'CM Office', email: 'cm.office@gujarat.gov.in', password: 'cm123', role: 'cm' as const, district: 'Gandhinagar', department: 'CM Office', designation: 'CM' },
  { id: 'u5', name: 'Demo Citizen', email: 'demo.citizen@example.com', password: 'demo123', role: 'citizen' as const, district: 'Ahmedabad', department: 'N/A', designation: 'Citizen' },
  { id: 'u6', name: 'Dr. Aarti Desai', email: 'secretary.health@gujarat.gov.in', password: 'secretary123', role: 'health_secretary' as const, district: 'Gandhinagar', department: 'Health & Family Welfare', designation: 'Principal Secretary (Health)' },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find user in demo list
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create session token
    const token = generateSessionToken();
    createSession(token, user.id, user.role);

    const AVATAR_COLORS: Record<string, string> = {
      nodal_officer: '#1A56C4',
      clerk: '#16A34A',
      admin: '#7C3AED',
      cm: '#C9A84C',
      citizen: '#0891B2',
      health_secretary: '#004B87',
    };
    const PERMISSIONS: Record<string, string[]> = {
      admin: ['*'],
      health_secretary: ['dashboard.secretary', 'reports.view', 'departments.view', 'districts.view', 'escalations.view'],
      cm: ['dashboard.cm', 'reports.view', 'departments.view', 'districts.view'],
    };

    // Return user (without password)
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        department: user.department,
        designation: user.designation,
        initials: user.name.split(' ').map(n => n[0]).join(''),
        avatarColor: AVATAR_COLORS[user.role] ?? '#3B82F6',
        permissions: PERMISSIONS[user.role] ?? ['complaints.view'],
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
    console.error('[LOGIN ERROR]', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
