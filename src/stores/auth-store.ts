'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials } from '@/types';
import { mockLogin, mockPhoneLogin } from '@/data';

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
  logout: () => void;
  clearError: () => void;
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
        await new Promise(r => setTimeout(r, 600));
        const result = mockLogin(credentials);
        if (result) {
          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } else {
          set({ isLoading: false, error: 'Invalid email or password.' });
          return false;
        }
      },

      loginWithPhone: async (phone, otp) => {
        set({ isLoading: true, error: null });
        await new Promise(r => setTimeout(r, 600));
        const result = mockPhoneLogin(phone, otp);
        if (result) {
          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } else {
          set({ isLoading: false, error: 'Invalid OTP. Please try again.' });
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/citizen/register', {
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

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
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
