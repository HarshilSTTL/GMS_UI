import { NextResponse } from 'next/server';

// In-memory OTP store for this route (separate from /api/auth/otp)
const OTP_STORE: Record<string, string> = {};

export async function POST(request: Request) {
  const { phone } = await request.json();
  if (!phone || phone.length !== 10) {
    return NextResponse.json({ error: 'Valid 10-digit phone number required' }, { status: 400 });
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  OTP_STORE[phone] = otp;
  // In production, send OTP via SMS. For demo, return it in response.
  return NextResponse.json({ success: true, otp, message: 'OTP sent to your phone' });
}
