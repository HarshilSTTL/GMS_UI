'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials } from '@/types';
import { mockLogin } from '@/data';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
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
