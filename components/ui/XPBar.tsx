import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import type { LevelProgress } from '@/types/game';

import { ProgressBar } from './ProgressBar';

interface XPBarProps {
  progress: LevelProgress;
}

export function XPBar({ progress }: XPBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.levelLabel}>Level {progress.level}</Text>
        <Text style={styles.xpLabel}>
          {progress.xpIntoLevel} / {progress.xpForNextLevel} XP
        </Text>
      </View>
      <ProgressBar
        progress={progress.progress}
        color={Colors.primary}
        height={12}
        accessibilityLabel={`Level ${progress.level} progress, ${Math.round(progress.progress * 100)} percent to next level`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  levelLabel: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  xpLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
