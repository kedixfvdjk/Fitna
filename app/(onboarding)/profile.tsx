import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useOnboardingStore } from '@/store/onboardingStore';

interface FormErrors {
  username?: string;
  age?: string;
  heightCm?: string;
  weightKg?: string;
}

export default function ProfileScreen() {
  const { username, age, heightCm, weightKg, setProfileField } = useOnboardingStore();
  const [errors, setErrors] = useState<FormErrors>({});

  const handleContinue = () => {
    const nextErrors: FormErrors = {};

    if (username.trim().length < 3) {
      nextErrors.username = 'Username must be at least 3 characters.';
    }

    const ageNum = Number(age);
    if (!age || Number.isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
      nextErrors.age = 'Enter an age between 13 and 100.';
    }

    const heightNum = Number(heightCm);
    if (!heightCm || Number.isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      nextErrors.heightCm = 'Enter a height between 100 and 250 cm.';
    }

    const weightNum = Number(weightKg);
    if (!weightKg || Number.isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      nextErrors.weightKg = 'Enter a weight between 30 and 300 kg.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    router.push('/(onboarding)/character');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Tell us about you</Text>
          <Text style={styles.subtitle}>
            Used to personalize your quests and track progress. Not medical advice.
          </Text>
        </View>

        <View style={styles.form}>
          <TextField
            label="Username"
            value={username}
            onChangeText={(text) => setProfileField('username', text)}
            autoCapitalize="none"
            error={errors.username}
          />
          <TextField
            label="Age"
            value={age}
            onChangeText={(text) => setProfileField('age', text)}
            keyboardType="number-pad"
            error={errors.age}
          />
          <TextField
            label="Height (cm)"
            value={heightCm}
            onChangeText={(text) => setProfileField('heightCm', text)}
            keyboardType="decimal-pad"
            error={errors.heightCm}
          />
          <TextField
            label="Weight (kg)"
            value={weightKg}
            onChangeText={(text) => setProfileField('weightKg', text)}
            keyboardType="decimal-pad"
            error={errors.weightKg}
          />
        </View>

        <Button label="Continue" onPress={handleContinue} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
    gap: Spacing.xl,
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
  form: {
    gap: Spacing.md,
  },
});
