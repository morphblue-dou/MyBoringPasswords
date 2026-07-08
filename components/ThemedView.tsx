import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useAppTheme } from '../hooks/useTheme';

interface ThemedViewProps extends ViewProps {
  variant?: 'background' | 'surface' | 'surfaceSecondary' | 'card';
}

export function ThemedView({ variant = 'background', style, children, ...props }: ThemedViewProps) {
  const { colors } = useAppTheme();
  
  const bgColor = {
    background: colors.background,
    surface: colors.surface,
    surfaceSecondary: colors.surfaceSecondary,
    card: colors.card,
  }[variant];

  return (
    <View style={[{ backgroundColor: bgColor }, style]} {...props}>
      {children}
    </View>
  );
}
