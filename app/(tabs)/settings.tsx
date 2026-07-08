import React from 'react';
import { View, StyleSheet, Pressable, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { useAppTheme } from '../../hooks/useTheme';
import { useThemeStore } from '../../stores/themeStore';
import { usePasswordStore } from '../../stores/passwordStore';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { colors, isDark } = useAppTheme();
  const { mode, setMode } = useThemeStore();
  const lock = usePasswordStore((s) => s.lock);
  const passwords = usePasswordStore((s) => s.passwords);

  const settingItems = [
    { icon: 'theme-light-dark', label: 'Dark Mode', value: isDark, type: 'switch' as const, onToggle: () => setMode(isDark ? 'light' : 'dark') },
    { icon: 'fingerprint', label: 'Biometric Unlock', value: true, type: 'switch' as const, onToggle: () => {} },
    { icon: 'clipboard', label: 'Auto-Clear Clipboard', value: true, type: 'switch' as const, onToggle: () => {} },
    { icon: 'timer', label: 'Auto-Lock Timer', subtitle: '5 minutes', type: 'navigate' as const },
    { icon: 'cloud-sync', label: 'Cloud Sync', subtitle: 'Not configured', type: 'navigate' as const },
    { icon: 'import', label: 'Import Passwords', subtitle: 'CSV, JSON, 1Password', type: 'navigate' as const },
    { icon: 'export', label: 'Export Vault', subtitle: 'Encrypted backup', type: 'navigate' as const },
    { icon: 'bell', label: 'Notifications', subtitle: 'Breach alerts', type: 'navigate' as const },
    { icon: 'shield-check', label: 'Password Health', type: 'navigate' as const },
    { icon: 'information', label: 'About', subtitle: 'Version 1.0.0', type: 'navigate' as const },
  ];

  return (
    <ThemedView variant="background" style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h2">Settings</ThemedText>
      </View>

      <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
        <View style={styles.statItem}>
          <ThemedText variant="h2" style={{ color: colors.primary }}>{passwords.length}</ThemedText>
          <ThemedText variant="caption" color="secondary">Total Items</ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <ThemedText variant="h2" style={{ color: colors.primary }}>{passwords.filter(p => p.isFavorite).length}</ThemedText>
          <ThemedText variant="caption" color="secondary">Favorites</ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <ThemedText variant="h2" style={{ color: colors.danger }}>{passwords.filter(p => p.isBreached).length}</ThemedText>
          <ThemedText variant="caption" color="secondary">Breached</ThemedText>
        </View>
      </View>

      {settingItems.map((item, i) => (
        <Pressable
          key={i}
          style={[styles.settingItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name={item.icon as any} size={20} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <ThemedText variant="body">{item.label}</ThemedText>
            {item.subtitle && <ThemedText variant="caption" color="secondary">{item.subtitle}</ThemedText>}
          </View>
          {item.type === 'switch' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: colors.disabled, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          ) : (
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textTertiary} />
          )}
        </Pressable>
      ))}

      <Pressable
        style={[styles.lockButton, { backgroundColor: colors.danger }]}
        onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); lock(); }}
      >
        <MaterialCommunityIcons name="lock" size={20} color="#FFFFFF" />
        <ThemedText variant="button" style={{ color: '#FFFFFF' }}>Lock Vault</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 16, marginBottom: 16 },
  statsCard: { flexDirection: 'row', marginHorizontal: 16, padding: 16, borderRadius: 14, marginBottom: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 36 },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 14, marginHorizontal: 16, borderBottomWidth: 1, gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingContent: { flex: 1 },
  lockButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 24, padding: 14, borderRadius: 12, gap: 8 },
});
