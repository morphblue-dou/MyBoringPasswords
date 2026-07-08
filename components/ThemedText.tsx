import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useTheme';

interface ThemedTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption' | 'button';
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'danger' | 'warning';
}

export function ThemedText({ variant = 'body', color: colorType, style, children, ...props }: ThemedTextProps) {
  const { colors } = useAppTheme();
  
  const textColor = {
    primary: colors.text,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    accent: colors.primary,
    danger: colors.danger,
    warning: colors.warning,
  }[colorType || 'primary'];

  const fontStyles: Record<string, any> = {
    h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
    h2: { fontSize: 22, fontWeight: '600', lineHeight: 28 },
    h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    h4: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
    body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
    bodySmall: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
    caption: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
    button: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  };

  return (
    <Text style={[{ color: textColor }, fontStyles[variant], style]} {...props}>
      {children}
    </Text>
  );
}
