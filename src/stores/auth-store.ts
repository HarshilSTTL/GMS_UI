'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials } from '@/types';

interface RegisterData {
  firstName: string; fatherName: string; lastName: string;
  phone: string; email?: string; aadhaar?: string;
  district?: string; taluka?: string; city?: string;
  state?: string; pincode?: string; address?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          const result = await res.json();
          if (result.error) {
            set({ isLoading: false, error: result.error });
            return false;
          }
          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch {
          set({ isLoading: false, error: 'Login failed. Please try again.' });
          return false;
        }
      },

      loginWithPhone: async (phone, otp) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/auth/phone-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, otp }),
          });
          const result = await res.json();
          if (result.error) {
            set({ isLoading: false, error: result.error });
            return false;
          }
          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch {
          set({ isLoading: false, error: 'Phone login failed. Please try again.' });
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          const result = await res.json();
          if (result.error) {
            set({ isLoading: false, error: result.error });
            return false;
          }
          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch {
          set({ isLoading: false, error: 'Registration failed. Please try again.' });
          return false;
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch {}
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),

      checkSession: async () => {
        try {
          const res = await fetch('/api/auth/session');
          if (res.ok) {
            const result = await res.json();
            set({
              user: result.user,
              token: result.token,
              isAuthenticated: true,
            });
            return true;
          }
          set({ user: null, token: null, isAuthenticated: false });
          return false;
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: 'gms-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
