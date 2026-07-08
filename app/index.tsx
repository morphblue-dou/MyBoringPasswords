import React from 'react';
import { Redirect } from 'expo-router';
import { usePasswordStore } from '../stores/passwordStore';

export default function Index() {
  const isUnlocked = usePasswordStore((s) => s.isUnlocked);
  return <Redirect href={isUnlocked ? '/(tabs)' : '/(auth)/unlock'} />;
}
