import { create } from 'zustand';
import type { User } from 'firebase/auth';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: TransactionType;
  userId: string;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
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
