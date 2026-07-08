import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { useAppTheme } from '../../hooks/useTheme';
import { useClipboard } from '../../hooks/useClipboard';
import { usePasswordStore } from '../../stores/passwordStore';
import { CATEGORY_LABELS } from '../../types';
import { getPasswordStrength, formatDate } from '../../utils/helpers';
import * as Haptics from 'expo-haptics';

export default function PasswordDetailScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { copyToClipboard } = useClipboard();
  const passwords = usePasswordStore((s) => s.passwords);
  const toggleFavorite = usePasswordStore((s) => s.toggleFavorite);
  const deletePassword = usePasswordStore((s) => s.deletePassword);
  const [showPassword, setShowPassword] = useState(false);
  
  const entry = passwords.find((p) => p.id === id);
  if (!entry) return <ThemedView variant="background" style={styles.container}><ThemedText>Password not found</ThemedText></ThemedView>;

  const strength = getPasswordStrength(entry.password);

  const CopyRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <Pressable
      style={[styles.copyRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); copyToClipboard(value); }}
    >
      <View style={[styles.copyIcon, { backgroundColor: colors.primaryLight }]}>
        <MaterialCommunityIcons name={icon as any} size={18} color={colors.primary} />
      </View>
      <View style={styles.copyContent}>
        <ThemedText variant="caption" color="secondary">{label}</ThemedText>
        <ThemedText variant="body" numberOfLines={1}>{value}</ThemedText>
      </View>
      <MaterialCommunityIcons name="content-copy" size={18} color={colors.textTertiary} />
    </Pressable>
  );

  return (
    <ThemedView variant="background" style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={() => toggleFavorite(entry.id)}>
            <MaterialCommunityIcons name={entry.isFavorite ? 'star' : 'star-outline'} size={24} color={entry.isFavorite ? colors.warning : colors.textTertiary} />
          </Pressable>
          <Pressable onPress={() => {
            Alert.alert('Delete Password', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => { deletePassword(entry.id); router.back(); } },
            ]);
          }}>
            <MaterialCommunityIcons name="delete-outline" size={24} color={colors.danger} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.titleCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.titleIcon, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name="key" size={32} color={colors.primary} />
          </View>
          <ThemedText variant="h2">{entry.title}</ThemedText>
          <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
            <ThemedText variant="caption" color="accent">{CATEGORY_LABELS[entry.category]}</ThemedText>
          </View>
          {entry.isBreached && (
            <View style={[styles.breachBadge, { backgroundColor: colors.dangerLight }]}>
              <MaterialCommunityIcons name="alert" size={14} color={colors.danger} />
              <ThemedText variant="caption" color="danger">Found in breach</ThemedText>
            </View>
          )}
        </View>

        <CopyRow icon="account" label="Username" value={entry.username} />
        
        <Pressable
          style={[styles.copyRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => { copyToClipboard(entry.password); }}
        >
          <View style={[styles.copyIcon, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name="lock" size={18} color={colors.primary} />
          </View>
          <View style={styles.copyContent}>
            <ThemedText variant="caption" color="secondary">Password</ThemedText>
            <ThemedText variant="body" numberOfLines={1}>{showPassword ? entry.password : '•'.repeat(12)}</ThemedText>
          </View>
          <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
            <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.textTertiary} />
          </Pressable>
          <MaterialCommunityIcons name="content-copy" size={18} color={colors.textTertiary} />
        </Pressable>

        <View style={[styles.strengthCard, { backgroundColor: colors.surface }]}>
          <ThemedText variant="caption" color="secondary">Password Strength</ThemedText>
          <View style={styles.strengthRow}>
            {[1, 2, 3, 4].map((level) => (
              <View key={level} style={[styles.strengthSegment, { backgroundColor: level <= strength.score ? strength.color : colors.border }]} />
            ))}
            <ThemedText variant="caption" style={{ color: strength.color }}>{strength.label}</ThemedText>
          </View>
        </View>

        {entry.url ? <CopyRow icon="web" label="Website" value={entry.url} /> : null}
        {entry.notes ? (
          <View style={[styles.notesCard, { backgroundColor: colors.surface }]}>
            <ThemedText variant="caption" color="secondary">Notes</ThemedText>
            <ThemedText variant="body">{entry.notes}</ThemedText>
          </View>
        ) : null}

        <View style={styles.metaRow}>
          <ThemedText variant="caption" color="tertiary">Created: {formatDate(entry.createdAt)}</ThemedText>
          <ThemedText variant="caption" color="tertiary">Updated: {formatDate(entry.updatedAt)}</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 },
  backBtn: { padding: 8 },
  headerActions: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40, gap: 10 },
  titleCard: { padding: 20, borderRadius: 14, alignItems: 'center', gap: 8 },
  titleIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  breachBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  copyRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, gap: 10 },
  copyIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  copyContent: { flex: 1 },
  strengthCard: { padding: 14, borderRadius: 12, gap: 8 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  strengthSegment: { flex: 1, height: 4, borderRadius: 2 },
  notesCard: { padding: 14, borderRadius: 12, gap: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});
