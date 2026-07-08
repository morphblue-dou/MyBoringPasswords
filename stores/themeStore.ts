import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'system',
  isDark: false,
  setMode: (mode) => {
    AsyncStorage.setItem('theme_mode', mode);
    set({ mode });
  },
}));

// Initialize from storage
AsyncStorage.getItem('theme_mode').then((stored) => {
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    useThemeStore.setState({ mode: stored as ThemeMode });
  }
});
