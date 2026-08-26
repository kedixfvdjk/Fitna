import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emblem}>⚔️</Text>
        <Text style={styles.title}>Your journey begins</Text>
        <Text style={styles.subtitle}>
          Real Life RPG turns your workouts, steps, sleep, and nutrition into experience for a
          character you build over time. Complete quests, level up, and keep your streak alive.
        </Text>
      </View>

      <Button label="Get Started" onPress={() => router.push('/(onboarding)/goal')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emblem: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});
