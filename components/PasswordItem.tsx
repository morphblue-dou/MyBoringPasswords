import React from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useTheme';
import { ThemedText } from './ThemedText';
import { PasswordEntry, CATEGORY_ICONS } from '../types';
import { maskPassword, formatDate, getFaviconUrl } from '../utils/helpers';
import * as Haptics from 'expo-haptics';

interface PasswordItemProps {
  entry: PasswordEntry;
  onPress: (entry: PasswordEntry) => void;
  onToggleFavorite: (id: string) => void;
}

export function PasswordItem({ entry, onPress, onToggleFavorite }: PasswordItemProps) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(entry);
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
        {entry.url ? (
          <MaterialCommunityIcons name={CATEGORY_ICONS[entry.category] as any} size={22} color={colors.primary} />
        ) : (
          <MaterialCommunityIcons name={CATEGORY_ICONS[entry.category] as any} size={22} color={colors.primary} />
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.row}>
          <ThemedText variant="h4" numberOfLines={1} style={styles.title}>{entry.title}</ThemedText>
          {entry.isBreached && (
            <View style={[styles.badge, { backgroundColor: colors.dangerLight }]}>
              <ThemedText variant="caption" color="danger" style={styles.badgeText}>Breached</ThemedText>
            </View>
          )}
        </View>
        <ThemedText variant="bodySmall" color="secondary" numberOfLines={1}>{entry.username}</ThemedText>
        <ThemedText variant="caption" color="tertiary">{maskPassword(entry.password)}</ThemedText>
      </View>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggleFavorite(entry.id);
        }}
        hitSlop={12}
      >
        <MaterialCommunityIcons
          name={entry.isFavorite ? 'star' : 'star-outline'}
          size={22}
          color={entry.isFavorite ? colors.warning : colors.textTertiary}
        />
      </Pressable>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
  },
});
