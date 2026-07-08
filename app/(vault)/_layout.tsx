import React from 'react';
import { Stack } from 'expo-router';
import { useAppTheme } from '../../hooks/useTheme';

export default function VaultLayout() {
  const { colors } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
