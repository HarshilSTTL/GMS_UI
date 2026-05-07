export type UserRole = 'admin' | 'nodal_officer' | 'clerk' | 'cm' | 'citizen';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  avatar?: string;
  initials: string;
  avatarColor: string;
  permissions: string[];
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
