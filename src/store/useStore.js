import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
