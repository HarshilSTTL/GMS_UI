import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROFILES_FILE = path.join(process.cwd(), 'src/data/citizen-profiles.json');

function readProfiles() {
  try {
    const raw = fs.readFileSync(PROFILES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeProfiles(data: unknown[]) {
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(data, null, 2));
}

export async function POST(request: Request) {
  const data = await request.json();
  const { firstName, lastName, fatherName, phone, email, aadhaar, district, taluka, city, state, pincode, address } = data;

  if (!firstName || !lastName || !phone) {
    return NextResponse.json({ error: 'First name, last name, and phone are required' }, { status: 400 });
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  const newId = `u${Date.now().toString(36)}`;

  // Check if phone already registered
  const profiles = readProfiles();
  const existing = profiles.find((p: { phone?: string; mobile?: string }) =>
    p.phone === phone || p.mobile === `+91 ${phone}`
  );
  if (existing) {
    return NextResponse.json({
      user: {
        id: existing.id,
        name: existing.fullName,
        email: existing.email || `${phone}@citizen.local`,
        role: 'citizen',
        department: 'N/A',
        designation: 'Citizen',
        initials: existing.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
        avatarColor: '#0891B2',
        permissions: ['complaints.submit', 'complaints.track'],
      },
      token: `mock-token-${existing.id}-${Date.now()}`,
    });
  }

  // Save profile to JSON
  const profile = {
    id: newId,
    fullName,
    fatherName: fatherName || '',
    mobile: `+91 ${phone}`,
    phone,
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
  };

  profiles.push(profile);
  writeProfiles(profiles);

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
