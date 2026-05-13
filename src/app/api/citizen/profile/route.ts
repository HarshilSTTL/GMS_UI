import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import type { User } from '@/types/auth';
import { logData, logError } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('gms-session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user from session
    const sessions = readJson<any[]>('sessions.json');
    const session = sessions.find(s => s.token === token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const users = readJson<User[]>('users.json');
    const user = users.find(u => u.id === session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Count complaints for this citizen
    const complaints = readJson<any[]>('complaints.json');
    const totalComplaints = complaints.filter(c => c.citizenId === user.id).length;
    const resolvedComplaints = complaints.filter(c => c.citizenId === user.id && c.status === 'resolved').length;

    const profile = {
      id: user.id,
      fullName: user.name,
      email: user.email,
      mobile: user.phone || '',
      dob: '',
      gender: '',
      aadhaar: user.aadhaar || '',
      district: user.district || '',
      taluka: user.taluka || '',
      ward: user.ward || '',
      address: user.address || '',
      pincode: user.pincode || '',
      language: 'English',
      registeredAt: user.createdAt || new Date().toISOString(),
      totalComplaints,
      resolvedComplaints,
    };

    logData('READ', 'citizen-profile', user.id);
    return NextResponse.json(profile);
  } catch (error) {
    logError('Failed to fetch profile', 'citizen/profile');
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('gms-session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessions = readJson<any[]>('sessions.json');
    const session = sessions.find(s => s.token === token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const body = await request.json();
    const users = readJson<User[]>('users.json');
    const idx = users.findIndex(u => u.id === session.userId);
    if (idx === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user profile
    const updatedUser = {
      ...users[idx],
      name: body.fullName || users[idx].name,
      email: body.email || users[idx].email,
      phone: body.mobile || users[idx].phone,
      aadhaar: body.aadhaar || users[idx].aadhaar,
      ward: body.ward || users[idx].ward,
      address: body.address || users[idx].address,
      pincode: body.pincode || users[idx].pincode,
      taluka: body.taluka || users[idx].taluka,
      district: body.district || users[idx].district,
    };

    users[idx] = updatedUser;
    writeJson('users.json', users);
    logData('UPDATE', 'citizen-profile', session.userId);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    logError('Failed to update profile', 'citizen/profile');
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
