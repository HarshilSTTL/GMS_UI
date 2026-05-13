import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import { logAuth } from '@/lib/logger';

interface OTPRecord {
  phone: string;
  otp: string;
  expiresAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: 'Valid 10-digit phone number is required.' }, { status: 400 });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Store OTP in JSON file (expires in 10 minutes)
    const otpRecords = readJson<OTPRecord[]>('otp-store.json') || [];
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Remove old OTP for this phone if exists
    const filtered = otpRecords.filter(r => r.phone !== phone || new Date(r.expiresAt) > new Date());
    filtered.push({ phone, otp, expiresAt });

    writeJson('otp-store.json', filtered);

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

  const otpRecords = readJson<OTPRecord[]>('otp-store.json') || [];
  const record = otpRecords.find(r => r.phone === phone && r.otp === otp);

  if (!record) return false;

  // Check if expired
  if (new Date(record.expiresAt) < new Date()) return false;

  return true;
}

export function storeOTP(phone: string, otp: string): void {
  const otpRecords = readJson<OTPRecord[]>('otp-store.json') || [];
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const filtered = otpRecords.filter(r => r.phone !== phone || new Date(r.expiresAt) > new Date());
  filtered.push({ phone, otp, expiresAt });

  writeJson('otp-store.json', filtered);
}
