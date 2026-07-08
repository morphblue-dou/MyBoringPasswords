import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, ThemeColors } from '../theme/colors';
import { useThemeStore } from '../stores/themeStore';

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const { mode } = useThemeStore();
  
  const isDark = useMemo(() => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return systemScheme === 'dark';
  }, [mode, systemScheme]);

  const colors: ThemeColors = isDark ? darkTheme : lightTheme;
  
  return { isDark, colors };
}
