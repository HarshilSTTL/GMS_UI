import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import { logAuth } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('gms-session')?.value;

    if (token) {
      const sessions = readJson<any[]>('sessions.json');
      const updated = sessions.filter(s => s.token !== token);
      writeJson('sessions.json', updated);
      logAuth('Logout', 'unknown');
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('gms-session', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
