import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors } from '@/constants/colors';
import { WEEKLY_CHALLENGE } from '@/constants/gameConfig';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';

/**
 * Challenge progress currently has no data source (no HealthKit / Health
 * Connect integration yet), so every goal starts at zero. This is
 * intentionally a functional UI + data model only, per phase 1 scope.
 */
const CHALLENGE_PROGRESS: Record<string, number> = {
  workouts: 0,
  steps: 0,
};

export default function ChallengesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader title="Weekly Challenge" subtitle="Resets every Monday" />

      <Card style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>{WEEKLY_CHALLENGE.title}</Text>
          <View style={styles.rewardBadge}>
            <Text style={styles.rewardText}>+{WEEKLY_CHALLENGE.xpReward} XP</Text>
          </View>
        </View>
        <Text style={styles.challengeDescription}>{WEEKLY_CHALLENGE.description}</Text>

        <View style={styles.goals}>
          {WEEKLY_CHALLENGE.goals.map((goal) => {
            const current = CHALLENGE_PROGRESS[goal.id] ?? 0;
            const progress = goal.target > 0 ? current / goal.target : 0;
            return (
              <View key={goal.id} style={styles.goalRow}>
                <View style={styles.goalLabelRow}>
                  <Text style={styles.goalLabel}>{goal.label}</Text>
                  <Text style={styles.goalValue}>
                    {current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                  </Text>
                </View>
                <ProgressBar
                  progress={progress}
                  color={Colors.gold}
                  accessibilityLabel={`${goal.label} progress`}
                />
              </View>
            );
          })}
        </View>
      </Card>
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
    gap: Spacing.lg,
  },
  challengeCard: {
    gap: Spacing.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
  },
  rewardBadge: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 999,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  rewardText: {
    color: Colors.gold,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  challengeDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
  },
  goals: {
    gap: Spacing.md,
  },
  goalRow: {
    gap: Spacing.xs,
  },
  goalLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalLabel: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  goalValue: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
  },
});
