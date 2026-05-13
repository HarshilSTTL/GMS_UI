import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/citizen-profile.json');

export async function POST(request: Request) {
  const data = await request.json();
  const { firstName, lastName, phone, email, aadhaar, district, taluka, city, state, pincode, address } = data;

  if (!firstName || !lastName || !phone) {
    return NextResponse.json({ error: 'First name, last name, and phone are required' }, { status: 400 });
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  const newId = `u${Date.now().toString(36)}`;

  // Save profile to JSON
  const profile = {
    id: newId,
    fullName,
    mobile: `+91 ${phone}`,
    email: email || '',
    dob: '',
    gender: '',
    aadhaar: aadhaar ? `XXXX XXXX ${aadhaar?.slice(-4)}` : '',
    district: district || '',
    taluka: taluka || '',
    ward: '',
    city: city || '',
    state: state || 'Gujarat',
    pincode: pincode || '',
    address: address || '',
    language: 'en',
    registeredAt: new Date().toISOString(),
    totalComplaints: 0,
    resolvedComplaints: 0,
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(profile, null, 2), 'utf-8');
  } catch {
    // ignore write errors in dev
  }

  return NextResponse.json({
    user: {
      id: newId,
      name: fullName,
      email: email || `${phone}@citizen.local`,
      role: 'citizen',
      department: 'N/A',
      designation: 'Citizen',
      initials,
      avatarColor: '#0891B2',
      permissions: ['complaints.submit', 'complaints.track'],
    },
    token: `mock-token-${newId}-${Date.now()}`,
  });
}
