import { NextResponse } from 'next/server';
import { generateOTP } from '@/data/mock-users';

export async function POST(request: Request) {
  const { phone } = await request.json();
  if (!phone || phone.length !== 10) {
    return NextResponse.json({ error: 'Valid 10-digit phone number required' }, { status: 400 });
  }
  const otp = generateOTP(phone);
  // In production, send OTP via SMS. For demo, return it in response.
  return NextResponse.json({ success: true, otp, message: 'OTP sent to your phone' });
}
