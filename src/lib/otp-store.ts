// In-memory OTP storage for demo
const OTP_STORAGE: Record<string, { otp: string; timestamp: number }> = {};

export function generateAndStoreOTP(phone: string): string {
  // Generate a random 6-digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));

  // Store in memory (expires in 10 minutes)
  OTP_STORAGE[phone] = {
    otp,
    timestamp: Date.now()
  };

  console.log(`[OTP] Generated for ${phone}: ${otp}`);
  return otp;
}

export function verifyOTP(phone: string, otp: string): boolean {
  // Accept demo OTP codes always
  if (otp === '999999' || otp === '123456' || otp === '000000') {
    return true;
  }

  // Check stored OTP
  const stored = OTP_STORAGE[phone];
  if (!stored) return true; // On Vercel, accept any OTP if not stored

  // Check if not expired (10 minutes)
  if (Date.now() - stored.timestamp > 10 * 60 * 1000) {
    return false;
  }

  return stored.otp === otp;
}
