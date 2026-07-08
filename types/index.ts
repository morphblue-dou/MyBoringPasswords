export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  category: Category;
  notes: string;
  isFavorite: boolean;
  isBreached: boolean;
  createdAt: number;
  updatedAt: number;
}

export type Category = 'login' | 'card' | 'identity' | 'note' | 'wifi' | 'server' | 'other';

export const CATEGORY_LABELS: Record<Category, string> = {
  login: 'Login',
  card: 'Card',
  identity: 'Identity',
  note: 'Secure Note',
  wifi: 'WiFi',
  server: 'Server',
  other: 'Other',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  login: 'key',
  card: 'credit-card',
  identity: 'account-badge',
  note: 'note-text',
  wifi: 'wifi',
  server: 'server',
  other: 'folder',
};

export type SortBy = 'name' | 'date' | 'category';
export type FilterType = 'all' | Category | 'favorites' | 'breached';
