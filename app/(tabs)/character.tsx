import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { XPBar } from '@/components/ui/XPBar';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useGameStore } from '@/store/gameStore';
import type { CharacterStats } from '@/types/game';
import { calculateLevel } from '@/utils/xp';

const STAT_META: { key: keyof CharacterStats; label: string; icon: string }[] = [
  { key: 'strength', label: 'Strength', icon: '💪' },
  { key: 'endurance', label: 'Endurance', icon: '🏃' },
  { key: 'vitality', label: 'Vitality', icon: '❤️' },
  { key: 'recovery', label: 'Recovery', icon: '🌙' },
  { key: 'discipline', label: 'Discipline', icon: '🎯' },
  { key: 'nutrition', label: 'Nutrition', icon: '🥦' },
];

export default function CharacterScreen() {
  const character = useGameStore((state) => state.character);
  if (!character) return null;

  const progress = calculateLevel(character.total_xp);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{progress.level}</Text>
        </View>
        <Text style={styles.levelLabel}>Level {progress.level}</Text>
        <View style={styles.xpBarWrapper}>
          <XPBar progress={progress} />
        </View>
      </View>

      <View style={styles.metaRow}>
        <Card style={styles.metaCard}>
          <Text style={styles.metaIcon}>🪙</Text>
          <Text style={styles.metaValue}>{character.coins}</Text>
          <Text style={styles.metaLabel}>Coins</Text>
        </Card>
        <Card style={styles.metaCard}>
          <Text style={styles.metaIcon}>🔥</Text>
          <Text style={styles.metaValue}>{character.streak}</Text>
          <Text style={styles.metaLabel}>Day Streak</Text>
        </Card>
        <Card style={styles.metaCard}>
          <Text style={styles.metaIcon}>✨</Text>
          <Text style={styles.metaValue}>{character.total_xp}</Text>
          <Text style={styles.metaLabel}>Total XP</Text>
        </Card>
      </View>

      <View>
        <SectionHeader title="Stats" subtitle="Grow these through real-world activity" />
        <View style={styles.statsGrid}>
          {STAT_META.map(({ key, label, icon }) => (
            <StatCard key={key} label={label} value={character[key]} icon={icon} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.text,
    fontSize: 48,
    fontWeight: FontWeight.extrabold,
  },
  levelLabel: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  xpBarWrapper: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metaCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: FontSize.lg,
  },
  metaValue: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
  },
  metaLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});
