import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useTheme';

export default function RootLayout() {
  const { isDark } = useAppTheme();

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: isDark ? '#0F0F1A' : '#F8F9FA' },
        }}
      >
        <Stack.Screen name="(auth)/unlock" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(vault)/[id]" />
        <Stack.Screen name="(vault)/add" />
        <Stack.Screen name="(vault)/generator" />
        <Stack.Screen name="(vault)/breaches" />
        <Stack.Screen name="settings" />
      </Stack>
    </SafeAreaProvider>
  );
}
