import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { GOAL_OPTIONS } from '@/constants/gameConfig';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function GoalScreen() {
  const goal = useOnboardingStore((state) => state.goal);
  const setGoal = useOnboardingStore((state) => state.setGoal);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What&apos;s your goal?</Text>
        <Text style={styles.subtitle}>This shapes the quests we build for you.</Text>
      </View>

      <View style={styles.options}>
        {GOAL_OPTIONS.map((option) => {
          const selected = goal === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => {
                Haptics.selectionAsync();
                setGoal(option.id);
              }}
              accessible
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button
        label="Continue"
        onPress={() => router.push('/(onboarding)/profile')}
        disabled={!goal}
      />
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
  options: {
    gap: Spacing.md,
    flex: 1,
    justifyContent: 'center',
  },
  option: {
    borderWidth: 1.5,
    borderColor: Colors.surfaceLight,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  optionText: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.primary,
  },
});
