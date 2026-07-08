import React, { useState } from 'react';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { PasswordItem } from '../../components/PasswordItem';
import { SearchBar } from '../../components/SearchBar';
import { FilterChips } from '../../components/FilterChips';
import { EmptyState } from '../../components/EmptyState';
import { useAppTheme } from '../../hooks/useTheme';
import { usePasswordStore } from '../../stores/passwordStore';
import { PasswordEntry, FilterType } from '../../types';
import * as Haptics from 'expo-haptics';

export default function VaultScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const passwords = usePasswordStore((s) => s.passwords);
  const searchQuery = usePasswordStore((s) => s.searchQuery);
  const activeFilter = usePasswordStore((s) => s.activeFilter);
  const setSearchQuery = usePasswordStore((s) => s.setSearchQuery);
  const setActiveFilter = usePasswordStore((s) => s.setActiveFilter);
  const toggleFavorite = usePasswordStore((s) => s.toggleFavorite);
  const getFilteredPasswords = usePasswordStore((s) => s.getFilteredPasswords);

  const filteredPasswords = getFilteredPasswords();

  const handlePress = (entry: PasswordEntry) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/(vault)/${entry.id}`);
  };

  return (
    <ThemedView variant="background" style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerRow}>
          <View>
            <ThemedText variant="h2">My Vault</ThemedText>
            <ThemedText variant="bodySmall" color="secondary">{passwords.length} items</ThemedText>
          </View>
          <Pressable
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(vault)/add')}
          >
            <MaterialCommunityIcons name="plus" size={22} color="#FFFFFF" />
            <ThemedText variant="button" style={{ color: '#FFFFFF' }}>Add</ThemedText>
          </Pressable>
        </View>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </View>

      {filteredPasswords.length === 0 ? (
        <EmptyState
          icon={searchQuery ? 'magnify' : 'shield-lock-outline'}
          title={searchQuery ? 'No results found' : 'Your vault is empty'}
          subtitle={searchQuery ? 'Try a different search term' : 'Tap + to add your first password'}
        />
      ) : (
        <FlatList
          data={filteredPasswords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PasswordItem entry={item} onPress={handlePress} onToggleFavorite={toggleFavorite} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 },
  addButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 4 },
  list: { paddingTop: 4, paddingBottom: 20 },
});
