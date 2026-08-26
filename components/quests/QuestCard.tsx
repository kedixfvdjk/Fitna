import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import type { Quest, QuestDifficulty } from '@/types/game';

const DIFFICULTY_COLOR: Record<QuestDifficulty, string> = {
  easy: Colors.green,
  medium: Colors.primary,
  hard: Colors.gold,
  epic: Colors.danger,
};

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => Promise<void> | void;
}

export function QuestCard({ quest, onComplete }: QuestCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const accentColor = DIFFICULTY_COLOR[quest.difficulty];

  const handlePress = useCallback(async () => {
    if (quest.completed || isCompleting) return;
    setIsCompleting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await onComplete(quest.id);
    } finally {
      setIsCompleting(false);
    }
  }, [isCompleting, onComplete, quest.completed, quest.id]);

  return (
    <View style={[styles.card, quest.completed && styles.cardCompleted]}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <Text style={[styles.title, quest.completed && styles.textCompleted]} numberOfLines={1}>
          {quest.title}
        </Text>
        <Text style={[styles.description, quest.completed && styles.textCompleted]} numberOfLines={2}>
          {quest.description}
        </Text>
        <View style={styles.rewardRow}>
          <Text style={styles.reward}>+{quest.xp_reward} XP</Text>
          <Text style={styles.rewardDot}>·</Text>
          <Text style={[styles.reward, { color: Colors.gold }]}>+{quest.coin_reward} coins</Text>
        </View>
      </View>
      <Pressable
        onPress={handlePress}
        disabled={quest.completed || isCompleting}
        accessible
        accessibilityRole="button"
        accessibilityLabel={quest.completed ? `${quest.title}, completed` : `Complete ${quest.title}`}
        accessibilityState={{ disabled: quest.completed || isCompleting }}
        hitSlop={8}
        style={({ pressed }) => [
          styles.checkButton,
          quest.completed && styles.checkButtonCompleted,
          pressed && !quest.completed && styles.checkButtonPressed,
        ]}
      >
        {isCompleting ? (
          <ActivityIndicator size="small" color={Colors.text} />
        ) : (
          <Text style={styles.checkMark}>{quest.completed ? '✓' : ''}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardCompleted: {
    opacity: 0.6,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: 4,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  reward: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  rewardDot: {
    color: Colors.textSecondary,
  },
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  checkButtonCompleted: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  checkButtonPressed: {
    borderColor: Colors.primary,
  },
  checkMark: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
