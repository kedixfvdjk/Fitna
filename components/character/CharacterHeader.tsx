import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import type { Character } from '@/types/game';
import { calculateLevel } from '@/utils/xp';

import { XPBar } from '../ui/XPBar';

interface CharacterHeaderProps {
  character: Character;
}

export function CharacterHeader({ character }: CharacterHeaderProps) {
  const progress = calculateLevel(character.total_xp);

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{progress.level}</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>LV</Text>
        </View>
      </View>

      <View style={styles.info}>
        <XPBar progress={progress} />
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🪙</Text>
            <Text style={styles.metaValue}>{character.coins}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🔥</Text>
            <Text style={styles.metaValue}>{character.streak} day streak</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
  },
  levelBadgeText: {
    color: Colors.text,
    fontSize: 10,
    fontWeight: FontWeight.extrabold,
  },
  info: {
    flex: 1,
    gap: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: FontSize.sm,
  },
  metaValue: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
});
