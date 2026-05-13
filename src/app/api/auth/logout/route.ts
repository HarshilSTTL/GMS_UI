import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session-store';
import { logAuth } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('gms-session')?.value;

    if (token) {
      deleteSession(token);
      logAuth('Logout', 'unknown');
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('gms-session', '', {
      httpOnly: true,
      secure: process.env.VERCEL === 'true' || process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
