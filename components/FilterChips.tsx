import React from 'react';
import { ScrollView, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useTheme';
import { ThemedText } from './ThemedText';
import { FilterType, Category, CATEGORY_LABELS } from '../types';

const FILTERS: { key: FilterType; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: 'view-grid' },
  { key: 'favorites', label: 'Favorites', icon: 'star' },
  { key: 'login', label: 'Logins', icon: 'key' },
  { key: 'card', label: 'Cards', icon: 'credit-card' },
  { key: 'identity', label: 'Identity', icon: 'account-badge' },
  { key: 'wifi', label: 'WiFi', icon: 'wifi' },
  { key: 'server', label: 'Server', icon: 'server' },
  { key: 'breached', label: 'Breached', icon: 'shield-alert' },
];

interface FilterChipsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterChips({ activeFilter, onFilterChange }: FilterChipsProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <Pressable
              key={filter.key}
              onPress={() => onFilterChange(filter.key)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? colors.primary : colors.surfaceSecondary,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={filter.icon as any}
                size={16}
                color={isActive ? '#FFFFFF' : colors.textSecondary}
              />
              <ThemedText
                variant="caption"
                color={isActive ? 'accent' : 'secondary'}
                style={{ color: isActive ? '#FFFFFF' : colors.textSecondary }}
              >
                {filter.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingVertical: 4 },
  scrollContent: { paddingHorizontal: 16, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
});
