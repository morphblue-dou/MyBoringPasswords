import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useTheme';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { generatePassword, getPasswordStrength } from '../utils/helpers';
import * as Haptics from 'expo-haptics';

interface PasswordGeneratorProps {
  onUsePassword: (password: string) => void;
  visible: boolean;
}

export function PasswordGenerator({ onUsePassword, visible }: PasswordGeneratorProps) {
  const { colors } = useAppTheme();
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [generatedPassword, setGeneratedPassword] = useState(() => generatePassword(16));
  const strength = getPasswordStrength(generatedPassword);

  const regenerate = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const pw = generatePassword(length, options);
    setGeneratedPassword(pw);
  }, [length, options]);

  if (!visible) return null;

  const Toggle = ({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) => (
    <Pressable
      style={[styles.toggleRow, { borderColor: colors.border }]}
      onPress={() => { onToggle(); }}
    >
      <ThemedText variant="bodySmall">{label}</ThemedText>
      <View style={[styles.toggle, { backgroundColor: value ? colors.primary : colors.disabled, borderColor: colors.border }]}>
        <View style={[styles.toggleKnob, { backgroundColor: '#fff' }]} />
      </View>
    </Pressable>
  );

  return (
    <ThemedView variant="surface" style={styles.container}>
      <View style={[styles.passwordBox, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
        <ThemedText variant="h4" style={{ fontFamily: 'monospace', flex: 1 }}>{generatedPassword}</ThemedText>
        <Pressable onPress={regenerate}>
          <MaterialCommunityIcons name="refresh" size={22} color={colors.primary} />
        </Pressable>
      </View>
      
      <View style={styles.strengthBar}>
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[styles.strengthSegment, { backgroundColor: level <= strength.score ? strength.color : colors.border }]}
          />
        ))}
        <ThemedText variant="caption" color={strength.color === '#4F46E5' ? 'accent' : strength.color === '#10B981' ? undefined : undefined} style={{ color: strength.color }}>
          {strength.label}
        </ThemedText>
      </View>

      <View style={styles.lengthRow}>
        <ThemedText variant="bodySmall">Length: {length}</ThemedText>
        <View style={styles.lengthButtons}>
          {[8, 12, 16, 24, 32].map((len) => (
            <Pressable
              key={len}
              style={[styles.lengthBtn, { backgroundColor: length === len ? colors.primary : colors.surfaceSecondary }]}
              onPress={() => { setLength(len); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <ThemedText variant="caption" style={{ color: length === len ? '#fff' : colors.textSecondary }}>{len}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <Toggle label="Uppercase (A-Z)" value={options.uppercase} onToggle={() => setOptions({ ...options, uppercase: !options.uppercase })} />
      <Toggle label="Lowercase (a-z)" value={options.lowercase} onToggle={() => setOptions({ ...options, lowercase: !options.lowercase })} />
      <Toggle label="Numbers (0-9)" value={options.numbers} onToggle={() => setOptions({ ...options, numbers: !options.numbers })} />
      <Toggle label="Symbols (!@#$)" value={options.symbols} onToggle={() => setOptions({ ...options, symbols: !options.symbols })} />

      <Pressable
        style={[styles.useButton, { backgroundColor: colors.primary }]}
        onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onUsePassword(generatedPassword); }}
      >
        <ThemedText variant="button" style={{ color: '#FFFFFF' }}>Use This Password</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 14, marginHorizontal: 16, marginVertical: 8, gap: 12 },
  passwordBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, gap: 8 },
  strengthBar: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  strengthSegment: { flex: 1, height: 4, borderRadius: 2 },
  lengthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lengthButtons: { flexDirection: 'row', gap: 6 },
  lengthBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1 },
  toggle: { width: 44, height: 24, borderRadius: 12, justifyContent: 'center', paddingRight: 2 },
  toggleKnob: { width: 20, height: 20, borderRadius: 10, marginLeft: 2 },
  useButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 4 },
});
