// Fallback auth for Vercel (when file I/O fails)
// This allows the app to work as a demo without database

import type { User } from '@/types/auth';

export const DEMO_USERS: User[] = [
  {
    id: 'u1',
    name: 'Ravi Varma',
    email: 'ravi.varma@gujarat.gov.in',
    phone: '9876543210',
    password: 'officer123',
    role: 'nodal_officer',
    department: 'Water Supply',
    designation: 'Nodal Officer',
    initials: 'RV',
    avatarColor: '#3B82F6',
    permissions: ['complaints.view', 'complaints.assign', 'complaints.resolve'],
    status: 'active',
    district: 'Ahmedabad',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u2',
    name: 'Anita Sharma',
    email: 'anita.sharma@gujarat.gov.in',
    phone: '9876543211',
    password: 'clerk123',
    role: 'clerk',
    department: 'Power',
    designation: 'Clerk',
    initials: 'AS',
    avatarColor: '#10B981',
    permissions: ['complaints.view', 'complaints.assign'],
    status: 'active',
    district: 'Vadodara',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u3',
    name: 'Bhupesh Patel',
    email: 'bhupesh.patel@gujarat.gov.in',
    phone: '9876543212',
    password: 'admin123',
    role: 'admin',
    department: 'Administration',
    designation: 'Admin',
    initials: 'BP',
    avatarColor: '#F59E0B',
    permissions: ['all'],
    status: 'active',
    district: 'Surat',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u4',
    name: 'CM Office',
    email: 'cm.office@gujarat.gov.in',
    phone: '9876543213',
    password: 'cm123',
    role: 'cm',
    department: 'CM Office',
    designation: 'CM',
    initials: 'CM',
    avatarColor: '#EF4444',
    permissions: ['all'],
    status: 'active',
    district: 'Gandhinagar',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u5',
    name: 'Demo Citizen',
    email: 'demo.citizen@example.com',
    phone: '9123456789',
    password: 'demo123',
    role: 'citizen',
    department: 'N/A',
    designation: 'Citizen',
    initials: 'DC',
    avatarColor: '#0891B2',
    permissions: ['complaints.submit', 'complaints.track'],
    status: 'active',
    district: 'Ahmedabad',
    createdAt: new Date().toISOString()
  }
];

export function findUserByEmail(email: string, password: string): User | null {
  const user = DEMO_USERS.find(u => u.email === email && u.password === password);
  return user || null;
}

export function findUserByPhone(phone: string): User | null {
  const user = DEMO_USERS.find(u => u.phone === phone);
  return user || null;
}

export function findUserById(id: string): User | null {
  const user = DEMO_USERS.find(u => u.id === id);
  return user || null;
}
