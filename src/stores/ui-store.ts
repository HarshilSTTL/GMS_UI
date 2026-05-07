'use client';
import { create } from 'zustand';

interface UIStore {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  activeNavId: string;
  searchQuery: string;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarMobileOpen: (v: boolean) => void;
  setActiveNavId: (id: string) => void;
  setSearchQuery: (q: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  activeNavId: 'dashboard',
  searchQuery: '',

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarMobileOpen: (v) => set({ sidebarMobileOpen: v }),
  setActiveNavId: (id) => set({ activeNavId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
