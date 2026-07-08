import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { PasswordGenerator } from '../../components/PasswordGenerator';
import { useAppTheme } from '../../hooks/useTheme';
import { usePasswordStore } from '../../stores/passwordStore';
import { Category, CATEGORY_LABELS } from '../../types';
import * as Haptics from 'expo-haptics';

const CATEGORIES: Category[] = ['login', 'card', 'identity', 'note', 'wifi', 'server', 'other'];

export default function AddPasswordScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const addPassword = usePasswordStore((s) => s.addPassword);
  const [showGenerator, setShowGenerator] = useState(false);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<Category>('login');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addPassword({
      title: title.trim(),
      username: username.trim(),
      password: password,
      url: url.trim(),
      category,
      notes: notes.trim(),
      isFavorite: false,
      isBreached: false,
    });
    router.back();
  };

  const InputField = ({ label, value, onChangeText, placeholder, icon, secureTextEntry = false }: any) => (
    <View style={[styles.inputGroup, { borderColor: colors.border }]}>
      <ThemedText variant="caption" color="secondary">{label}</ThemedText>
      <View style={[styles.inputRow, { backgroundColor: colors.surfaceSecondary }]}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.textTertiary} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  );

  return (
    <ThemedView variant="background" style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="close" size={24} color={colors.text} />
        </Pressable>
        <ThemedText variant="h3">Add Password</ThemedText>
        <Pressable style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <ThemedText variant="button" style={{ color: '#FFFFFF' }}>Save</ThemedText>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <InputField label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Google" icon="tag" />
        <InputField label="Username / Email" value={username} onChangeText={setUsername} placeholder="e.g. user@gmail.com" icon="account" />

        <View style={[styles.inputGroup, { borderColor: colors.border }]}>
          <ThemedText variant="caption" color="secondary">Password</ThemedText>
          <View style={[styles.inputRow, { backgroundColor: colors.surfaceSecondary }]}>
            <MaterialCommunityIcons name="lock" size={18} color={colors.textTertiary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter or generate password"
              placeholderTextColor={colors.textTertiary}
            />
            <Pressable onPress={() => setShowGenerator(!showGenerator)}>
              <MaterialCommunityIcons name="dice-multiple" size={20} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        {showGenerator && (
          <PasswordGenerator
            visible={showGenerator}
            onUsePassword={(pw) => { setPassword(pw); setShowGenerator(false); }}
          />
        )}

        <InputField label="Website URL" value={url} onChangeText={setUrl} placeholder="e.g. google.com" icon="web" />

        <View style={[styles.inputGroup, { borderColor: colors.border }]}>
          <ThemedText variant="caption" color="secondary">Category</ThemedText>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={[styles.categoryChip, { backgroundColor: category === cat ? colors.primary : colors.surfaceSecondary, borderColor: category === cat ? colors.primary : colors.border }]}
                onPress={() => setCategory(cat)}
              >
                <ThemedText variant="caption" style={{ color: category === cat ? '#FFFFFF' : colors.textSecondary }}>
                  {CATEGORY_LABELS[cat]}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <InputField label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional notes" icon="note-text" />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 },
  backBtn: { padding: 8 },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40, gap: 12 },
  inputGroup: { gap: 6, borderBottomWidth: 0 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, gap: 8 },
  input: { flex: 1, fontSize: 15, padding: 0 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
});
