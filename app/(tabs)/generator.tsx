import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { PasswordGenerator } from '../../components/PasswordGenerator';
import { useAppTheme } from '../../hooks/useTheme';
import { useClipboard } from '../../hooks/useClipboard';
import { generatePassword, getPasswordStrength } from '../../utils/helpers';
import * as Haptics from 'expo-haptics';

export default function GeneratorScreen() {
  const { colors } = useAppTheme();
  const { copyToClipboard } = useClipboard();
  const [showGenerator, setShowGenerator] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const handleGenerated = useCallback((pw: string) => {
    setHistory((prev) => [pw, ...prev.slice(0, 9)]);
  }, []);

  return (
    <ThemedView variant="background" style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h2">Password Generator</ThemedText>
        <ThemedText variant="bodySmall" color="secondary">Create strong, unique passwords</ThemedText>
      </View>

      <PasswordGenerator onUsePassword={handleGenerated} visible={showGenerator} />

      {history.length > 0 && (
        <View style={styles.historySection}>
          <ThemedText variant="h4" style={styles.historyTitle}>Recent Passwords</ThemedText>
          {history.map((pw, i) => {
            const strength = getPasswordStrength(pw);
            return (
              <Pressable
                key={i}
                style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  copyToClipboard(pw);
                }}
              >
                <ThemedText variant="bodySmall" style={{ fontFamily: 'monospace' }} numberOfLines={1}>
                  {pw}
                </ThemedText>
                <View style={styles.strengthDot}>
                  <View style={[styles.dot, { backgroundColor: strength.color }]} />
                </View>
                <MaterialCommunityIcons name="content-copy" size={16} color={colors.textTertiary} />
              </Pressable>
            );
          })}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 16, marginBottom: 8 },
  strengthBar: { flexDirection: 'row', gap: 4, marginBottom: 16 },
  strengthSegment: { flex: 1, height: 4, borderRadius: 2 },
  historySection: { paddingHorizontal: 16, marginTop: 16 },
  historyTitle: { marginBottom: 8 },
  historyItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 6, gap: 8 },
  strengthDot: { flexDirection: 'row', marginLeft: 'auto' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
