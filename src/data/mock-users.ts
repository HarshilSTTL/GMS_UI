import { User, LoginCredentials, LoginResponse } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Ravi Varma',
    email: 'ravi.varma@gujarat.gov.in',
    role: 'nodal_officer',
    department: 'GWSSB',
    designation: 'Nodal Officer',
    initials: 'RV',
    avatarColor: '#1A56C4',
    permissions: ['complaints.view', 'complaints.assign', 'complaints.reassign', 'team.view', 'reports.view', 'escalations.view'],
  },
  {
    id: 'u2',
    name: 'Anita Sharma',
    email: 'anita.sharma@gujarat.gov.in',
    role: 'clerk',
    department: 'Revenue Department',
    designation: 'Senior Clerk',
    initials: 'AS',
    avatarColor: '#16A34A',
    permissions: ['complaints.view', 'complaints.update', 'complaints.resolve'],
  },
  {
    id: 'u3',
    name: 'Bhupesh Patel',
    email: 'bhupesh.patel@gujarat.gov.in',
    role: 'admin',
    department: 'GMS Administration',
    designation: 'System Administrator',
    initials: 'BP',
    avatarColor: '#7C3AED',
    permissions: ['*'],
  },
  {
    id: 'u4',
    name: 'CM Office',
    email: 'cm.office@gujarat.gov.in',
    role: 'cm',
    department: "Chief Minister's Office",
    designation: "CM Intelligence View",
    initials: 'CM',
    avatarColor: '#C9A84C',
    permissions: ['dashboard.cm', 'reports.view', 'departments.view', 'districts.view'],
  },
  {
    id: 'u5',
    name: 'Rajesh Patel',
    email: 'citizen@gmail.com',
    role: 'citizen',
    department: 'N/A',
    designation: 'Citizen',
    initials: 'RP',
    avatarColor: '#0891B2',
    permissions: ['complaints.submit', 'complaints.track'],
  },
];

const MOCK_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  'ravi.varma@gujarat.gov.in': { password: 'officer123', userId: 'u1' },
  'anita.sharma@gujarat.gov.in': { password: 'clerk123', userId: 'u2' },
  'bhupesh.patel@gujarat.gov.in': { password: 'admin123', userId: 'u3' },
  'cm.office@gujarat.gov.in': { password: 'cm123', userId: 'u4' },
  'citizen@gmail.com': { password: 'citizen123', userId: 'u5' },
};

export function mockLogin(credentials: LoginCredentials): LoginResponse | null {
  const entry = MOCK_CREDENTIALS[credentials.email];
  if (!entry || entry.password !== credentials.password) return null;
  const user = MOCK_USERS.find(u => u.id === entry.userId);
  if (!user) return null;
  return { user, token: `mock-token-${user.id}-${Date.now()}` };
}

export const DEMO_ACCOUNTS = [
  { label: 'Nodal Officer', email: 'ravi.varma@gujarat.gov.in', password: 'officer123', color: '#1A56C4' },
  { label: 'Clerk / Task', email: 'anita.sharma@gujarat.gov.in', password: 'clerk123', color: '#16A34A' },
  { label: 'Admin Console', email: 'bhupesh.patel@gujarat.gov.in', password: 'admin123', color: '#7C3AED' },
  { label: 'CM Dashboard', email: 'cm.office@gujarat.gov.in', password: 'cm123', color: '#C9A84C' },
];
