import { NextRequest, NextResponse } from 'next/server';
import { generateAndStoreOTP } from '@/lib/otp-store';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: 'Valid 10-digit phone required' }, { status: 400 });
    }

    // Generate and store OTP
    const otp = generateAndStoreOTP(phone);

    return NextResponse.json({
      success: true,
      otp, // For demo - show the OTP in response
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('[OTP ERROR]', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
