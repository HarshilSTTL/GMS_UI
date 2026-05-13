export type UserRole = 'admin' | 'nodal_officer' | 'clerk' | 'cm' | 'citizen';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  department: string;
  designation: string;
  avatar?: string;
  initials: string;
  avatarColor: string;
  permissions: string[];
  status?: string;
  district?: string;
  lastLogin?: string;
  createdAt?: string;
  // Citizen-specific fields
  fatherName?: string;
  aadhaar?: string;
  taluka?: string;
  city?: string;
  pincode?: string;
  address?: string;
  ward?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
