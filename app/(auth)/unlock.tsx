import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { useAppTheme } from '../../hooks/useTheme';
import { usePasswordStore } from '../../stores/passwordStore';
import * as Haptics from 'expo-haptics';

export default function UnlockScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const unlock = usePasswordStore((s) => s.unlock);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const scale = React.useRef(new Animated.Value(1)).current;
  const lockScale = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(lockScale, { toValue: 1, useNativeDriver: true }).start();
  }, []);

  const handlePinPress = (digit: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        // Accept any PIN for demo
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        unlock();
        router.replace('/(tabs)');
      }
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleBiometric = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    unlock();
    router.replace('/(tabs)');
  };

  const pins = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <ThemedView variant="background" style={styles.container}>
      <Animated.View style={[styles.header, { transform: [{ scale: lockScale }] }]}>
        <View style={[styles.lockIcon, { backgroundColor: colors.primaryLight }]}>
          <MaterialCommunityIcons name="shield-lock" size={40} color={colors.primary} />
        </View>
        <ThemedText variant="h2" style={styles.title}>MyBoringPasswords</ThemedText>
        <ThemedText variant="body" color="secondary" style={styles.subtitle}>Enter your PIN to unlock</ThemedText>
      </Animated.View>

      <View style={styles.pinDots}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.pinDot,
              {
                backgroundColor: i < pin.length ? colors.primary : colors.border,
                borderColor: i < pin.length ? colors.primary : colors.textTertiary,
              },
            ]}
          />
        ))}
      </View>

      {error ? <ThemedText variant="caption" color="danger">{error}</ThemedText> : null}

      <View style={styles.keypad}>
        {pins.map((key, i) => {
          if (key === '') return <View key={i} style={styles.keypadKey} />;
          if (key === 'del') {
            return (
              <Pressable key={i} style={styles.keypadKey} onPress={handleDelete}>
                <MaterialCommunityIcons name="backspace" size={24} color={colors.textSecondary} />
              </Pressable>
            );
          }
          return (
            <Pressable
              key={i}
              style={[styles.keypadKey, { backgroundColor: colors.surface }]}
              onPress={() => handlePinPress(key)}
            >
              <ThemedText variant="h3" style={styles.keypadText}>{key}</ThemedText>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.biometricBtn} onPress={handleBiometric}>
        <MaterialCommunityIcons name="fingerprint" size={28} color={colors.primary} />
        <ThemedText variant="bodySmall" color="accent">Use Biometrics</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  lockIcon: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { marginTop: 8 },
  subtitle: { marginTop: 4 },
  pinDots: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  pinDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 280, justifyContent: 'center', gap: 8 },
  keypadKey: { width: 80, height: 64, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  keypadText: { textAlign: 'center' },
  biometricBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24, padding: 12 },
});
