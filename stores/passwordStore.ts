import { create } from 'zustand';
import { PasswordEntry, Category } from '../types';
import { generateId } from '../utils/helpers';

const MOCK_PASSWORDS: PasswordEntry[] = [
  {
    id: '1', title: 'Google', username: 'user@gmail.com', password: 'G00gl3$ecure!2024',
    url: 'google.com', category: 'login', notes: 'Main account', isFavorite: true, isBreached: false,
    createdAt: Date.now() - 86400000 * 30, updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: '2', title: 'GitHub', username: 'devuser', password: 'G1tHub!Pr0d#2024',
    url: 'github.com', category: 'login', notes: 'Work account', isFavorite: true, isBreached: false,
    createdAt: Date.now() - 86400000 * 25, updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: '3', title: 'Amazon', username: 'shopper@email.com', password: 'Amaz0n$h0p!',
    url: 'amazon.com', category: 'login', notes: '', isFavorite: false, isBreached: true,
    createdAt: Date.now() - 86400000 * 20, updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: '4', title: 'Visa •••• 4242', username: 'John Doe', password: '4242424242424242|12/28|123',
    url: '', category: 'card', notes: 'Visa credit card', isFavorite: false, isBreached: false,
    createdAt: Date.now() - 86400000 * 15, updatedAt: Date.now() - 86400000 * 15,
  },
  {
    id: '5', title: 'Home WiFi', username: 'admin', password: 'H0m3W1f1!Pass',
    url: '', category: 'wifi', notes: '5GHz network', isFavorite: false, isBreached: false,
    createdAt: Date.now() - 86400000 * 10, updatedAt: Date.now() - 86400000 * 10,
  },
  {
    id: '6', title: 'AWS Console', username: 'admin@company.com', password: 'AWS!C0ns0le$3cure',
    url: 'aws.amazon.com', category: 'server', notes: 'Production account', isFavorite: true, isBreached: false,
    createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: '7', title: 'Netflix', username: 'user@email.com', password: 'N3tf1ix!Str3am',
    url: 'netflix.com', category: 'login', notes: '', isFavorite: false, isBreached: false,
    createdAt: Date.now() - 86400000 * 45, updatedAt: Date.now() - 86400000 * 7,
  },
  {
    id: '8', title: 'Bank of America', username: 'john.doe', password: 'B0A$Bank1ng!!',
    url: 'bankofamerica.com', category: 'login', notes: 'Checking account', isFavorite: true, isBreached: true,
    createdAt: Date.now() - 86400000 * 60, updatedAt: Date.now() - 86400000 * 1,
  },
];

interface PasswordStore {
  passwords: PasswordEntry[];
  searchQuery: string;
  activeFilter: 'all' | Category | 'favorites' | 'breached';
  sortBy: 'name' | 'date' | 'category';
  isUnlocked: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: 'all' | Category | 'favorites' | 'breached') => void;
  setSortBy: (sort: 'name' | 'date' | 'category') => void;
  unlock: () => void;
  lock: () => void;
  addPassword: (entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePassword: (id: string, updates: Partial<PasswordEntry>) => void;
  deletePassword: (id: string) => void;
  toggleFavorite: (id: string) => void;
  
  // Computed
  getFilteredPasswords: () => PasswordEntry[];
}

export const usePasswordStore = create<PasswordStore>((set, get) => ({
  passwords: MOCK_PASSWORDS,
  searchQuery: '',
  activeFilter: 'all',
  sortBy: 'name',
  isUnlocked: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setSortBy: (sort) => set({ sortBy: sort }),
  unlock: () => set({ isUnlocked: true }),
  lock: () => set({ isUnlocked: false }),

  addPassword: (entry) => set((state) => ({
    passwords: [{
      ...entry,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }, ...state.passwords],
  })),

  updatePassword: (id, updates) => set((state) => ({
    passwords: state.passwords.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
    ),
  })),

  deletePassword: (id) => set((state) => ({
    passwords: state.passwords.filter((p) => p.id !== id),
  })),

  toggleFavorite: (id) => set((state) => ({
    passwords: state.passwords.map((p) =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ),
  })),

  getFilteredPasswords: () => {
    const { passwords, searchQuery, activeFilter, sortBy } = get();
    let filtered = [...passwords];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(q) || p.username.toLowerCase().includes(q) || p.url.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'favorites') {
      filtered = filtered.filter((p) => p.isFavorite);
    } else if (activeFilter === 'breached') {
      filtered = filtered.filter((p) => p.isBreached);
    } else if (activeFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === activeFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'date') return b.updatedAt - a.updatedAt;
      return a.category.localeCompare(b.category);
    });

    return filtered;
  },
}));
