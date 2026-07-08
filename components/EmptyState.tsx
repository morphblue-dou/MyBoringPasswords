import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useTheme';
import { ThemedText } from './ThemedText';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon as any} size={64} color={colors.textTertiary} />
      <ThemedText variant="h3" color="secondary" style={styles.title}>{title}</ThemedText>
      {subtitle && <ThemedText variant="bodySmall" color="tertiary" style={styles.subtitle}>{subtitle}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  title: { marginTop: 16, textAlign: 'center' },
  subtitle: { marginTop: 8, textAlign: 'center' },
});
