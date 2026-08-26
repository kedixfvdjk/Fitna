import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { STARTING_STATS } from '@/constants/gameConfig';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import type { Character } from '@/types/game';

const STAT_LABELS: Record<keyof typeof STARTING_STATS, string> = {
  strength: 'Strength',
  endurance: 'Endurance',
  vitality: 'Vitality',
  recovery: 'Recovery',
  discipline: 'Discipline',
  nutrition: 'Nutrition',
};

export default function CharacterScreen() {
  const userId = useAuthStore((state) => state.user?.id);
  const setCharacter = useGameStore((state) => state.setCharacter);
  const { goal, username, age, heightCm, weightKg } = useOnboardingStore();
  const resetOnboarding = useOnboardingStore((state) => state.reset);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!userId) {
      setError('Your session expired. Please log in again.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        username: username.trim(),
        age: Number(age),
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        goal,
        fitness_level: 'beginner',
      });
      if (profileError) throw profileError;

      const { data: character, error: characterError } = await supabase
        .from('characters')
        .insert({
          user_id: userId,
          level: 1,
          total_xp: 0,
          coins: 0,
          streak: 0,
          ...STARTING_STATS,
        })
        .select('*')
        .single<Character>();
      if (characterError || !character) throw characterError ?? new Error('Character creation failed');

      setCharacter(character);
      resetOnboarding();
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong creating your character.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meet your hero</Text>
        <Text style={styles.subtitle}>
          Every stat starts at 1. Real-world activity will grow them over time.
        </Text>
      </View>

      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{username.trim().charAt(0).toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.username}>{username.trim() || 'Adventurer'}</Text>
        <Text style={styles.levelTag}>Level 1</Text>
      </View>

      <View style={styles.statsGrid}>
        {(Object.keys(STARTING_STATS) as (keyof typeof STARTING_STATS)[]).map((key) => (
          <StatCard key={key} label={STAT_LABELS[key]} value={STARTING_STATS[key]} />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button label="Begin Adventure" onPress={handleCreate} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
    justifyContent: 'space-between',
  },
  header: {
    gap: Spacing.xs,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
  },
  avatarWrapper: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.text,
    fontSize: FontSize.display,
    fontWeight: FontWeight.extrabold,
  },
  username: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginTop: Spacing.sm,
  },
  levelTag: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  error: {
    color: Colors.danger,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
});
