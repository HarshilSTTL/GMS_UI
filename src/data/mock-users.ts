import { User, LoginCredentials, LoginResponse } from '@/types';

// Mock OTP store (in-memory, simulates SMS delivery)
const MOCK_OTP_STORE: Record<string, string> = {};
export function generateOTP(phone: string): string {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  MOCK_OTP_STORE[phone] = otp;
  return otp;
}
export function storeOTP(phone: string, otp: string): void {
  MOCK_OTP_STORE[phone] = otp;
}
export function verifyOTP(phone: string, otp: string): boolean {
  if (otp === '999999') return true;
  return MOCK_OTP_STORE[phone] === otp;
}

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
    id: 'u6',
    name: 'Dr. Aarti Desai',
    email: 'secretary.health@gujarat.gov.in',
    role: 'health_secretary',
    department: 'Health & Family Welfare Department',
    designation: 'Principal Secretary (Health)',
    initials: 'AD',
    avatarColor: '#004B87',
    permissions: ['dashboard.secretary', 'reports.view', 'departments.view', 'districts.view', 'escalations.view'],
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
  'secretary.health@gujarat.gov.in': { password: 'secretary123', userId: 'u6' },
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
  { label: 'Health Secretary', email: 'secretary.health@gujarat.gov.in', password: 'secretary123', color: '#004B87' },
  { label: 'Citizen Portal', email: 'citizen@gmail.com', password: 'citizen123', color: '#0891B2' },
];

// Phone-to-user lookup for citizen OTP login
const PHONE_USER_MAP: Record<string, string> = {
  '9876543210': 'u5', // Rajesh Patel
};

export function mockPhoneLogin(phone: string, otp: string): LoginResponse | null {
  if (!verifyOTP(phone, otp)) return null;
  const userId = PHONE_USER_MAP[phone];
  const user = userId ? MOCK_USERS.find(u => u.id === userId) : null;
  if (user) {
    return { user, token: `mock-token-${user.id}-${Date.now()}` };
  }
  // Fallback: allow any phone with valid OTP to login as default citizen
  const defaultCitizen = MOCK_USERS.find(u => u.role === 'citizen');
  if (!defaultCitizen) return null;
  return { user: defaultCitizen, token: `mock-token-citizen-${Date.now()}` };
}

// Register a new citizen (client-side only, no fs)
export function mockRegisterCitizen(data: {
  firstName: string; fatherName: string; lastName: string;
  phone: string; email?: string; aadhaar?: string;
  district?: string; taluka?: string; city?: string;
  state?: string; pincode?: string; address?: string;
}): LoginResponse {
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const initials = `${data.firstName?.charAt(0) || ''}${data.lastName?.charAt(0) || ''}`.toUpperCase();
  const newId = `u${MOCK_USERS.length + 1}`;
  const user: User = {
    id: newId,
    name: fullName,
    email: data.email || `${data.phone}@citizen.local`,
    role: 'citizen',
    department: 'N/A',
    designation: 'Citizen',
    initials,
    avatarColor: '#0891B2',
    permissions: ['complaints.submit', 'complaints.track'],
  };
  MOCK_USERS.push(user);
  PHONE_USER_MAP[data.phone] = newId;
  return { user, token: `mock-token-${newId}-${Date.now()}` };
}
