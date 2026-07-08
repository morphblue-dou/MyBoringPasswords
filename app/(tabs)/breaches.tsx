import React from 'react';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { EmptyState } from '../../components/EmptyState';
import { useAppTheme } from '../../hooks/useTheme';
import { usePasswordStore } from '../../stores/passwordStore';
import { PasswordEntry } from '../../types';
import * as Haptics from 'expo-haptics';

const MOCK_BREACHES = [
  { name: 'Adobe', date: 'Oct 2013', count: '153M', severity: 'high' },
  { name: 'LinkedIn', date: 'May 2016', count: '164M', severity: 'high' },
  { name: 'Dropbox', date: 'Aug 2016', count: '68M', severity: 'medium' },
  { name: 'MyFitnessPal', date: 'Feb 2018', count: '150M', severity: 'medium' },
  { name: ' Marriott', date: 'Nov 2018', count: '500M', severity: 'high' },
];

export default function BreachesScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const passwords = usePasswordStore((s) => s.passwords);
  const breachedPasswords = passwords.filter((p) => p.isBreached);

  return (
    <ThemedView variant="background" style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h2">Breach Monitor</ThemedText>
        <ThemedText variant="bodySmall" color="secondary">Check if your passwords have been compromised</ThemedText>
      </View>

      {breachedPasswords.length > 0 && (
        <View style={[styles.alertCard, { backgroundColor: colors.dangerLight, borderColor: colors.danger }]}>
          <View style={styles.alertRow}>
            <MaterialCommunityIcons name="alert-circle" size={28} color={colors.danger} />
            <View style={styles.alertContent}>
              <ThemedText variant="h4" color="danger">{breachedPasswords.length} Password{breachedPasswords.length > 1 ? 's' : ''} Found in Breaches</ThemedText>
              <ThemedText variant="bodySmall" color="secondary">Change these passwords immediately</ThemedText>
            </View>
          </View>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <ThemedText variant="h4">Affected Passwords</ThemedText>
      </View>

      {breachedPasswords.length === 0 ? (
        <EmptyState icon="shield-check" title="All Clear!" subtitle="None of your passwords appear in known data breaches" />
      ) : (
        breachedPasswords.map((entry) => (
          <Pressable
            key={entry.id}
            style={[styles.breachItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(`/(vault)/${entry.id}`)}
          >
            <View style={[styles.breachIcon, { backgroundColor: colors.dangerLight }]}>
              <MaterialCommunityIcons name="alert" size={20} color={colors.danger} />
            </View>
            <View style={styles.breachContent}>
              <ThemedText variant="h4">{entry.title}</ThemedText>
              <ThemedText variant="caption" color="danger">Password exposed in data breach</ThemedText>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textTertiary} />
          </Pressable>
        ))
      )}

      <View style={styles.sectionHeader}>
        <ThemedText variant="h4">Recent Breaches</ThemedText>
      </View>

      {MOCK_BREACHES.filter(b => b.severity === 'high').map((breach, i) => (
        <View key={i} style={[styles.breachInfo, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.breachInfoIcon, { backgroundColor: colors.warningLight }]}>
            <MaterialCommunityIcons name="web" size={18} color={colors.warning} />
          </View>
          <View style={styles.breachInfoContent}>
            <ThemedText variant="body">{breach.name}</ThemedText>
            <ThemedText variant="caption" color="secondary">{breach.date} • {breach.count} accounts</ThemedText>
          </View>
          <View style={[styles.severityBadge, { backgroundColor: colors.dangerLight }]}>
            <ThemedText variant="caption" color="danger">{breach.severity}</ThemedText>
          </View>
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 16, marginBottom: 16 },
  alertCard: { marginHorizontal: 16, padding: 16, borderRadius: 14, borderWidth: 1 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  alertContent: { flex: 1 },
  sectionHeader: { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  breachItem: { flexDirection: 'row', alignItems: 'center', padding: 14, marginHorizontal: 16, marginVertical: 3, borderRadius: 12, borderWidth: 1, gap: 12 },
  breachIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  breachContent: { flex: 1 },
  breachInfo: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 16, marginVertical: 3, borderRadius: 10, borderWidth: 1, gap: 10 },
  breachInfoIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  breachInfoContent: { flex: 1 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
});
