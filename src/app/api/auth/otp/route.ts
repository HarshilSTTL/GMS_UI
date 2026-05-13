import { NextRequest, NextResponse } from 'next/server';
import { logAuth } from '@/lib/logger';

// In-memory OTP store (resets on server restart)
const OTP_STORE: Record<string, string> = {};

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: 'Valid 10-digit phone number is required.' }, { status: 400 });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    OTP_STORE[phone] = otp;

    logAuth('OTP generated', phone, `OTP: ${otp}`);

    return NextResponse.json({
      success: true,
      otp, // For demo purposes, return OTP in response
      message: 'OTP sent successfully.'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send OTP.' }, { status: 500 });
  }
}

export function verifyOTP(phone: string, otp: string): boolean {
  if (otp === '999999') return true; // Backdoor for testing
  return OTP_STORE[phone] === otp;
}

export function storeOTP(phone: string, otp: string): void {
  OTP_STORE[phone] = otp;
}
