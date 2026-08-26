import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import { calculateLevel } from '@/utils/xp';

const SETTINGS_ROWS = ['Notifications', 'Units', 'Connected Health Apps', 'Subscription'];

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const character = useGameStore((state) => state.character);
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await signOut();
          } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Unable to log out.');
          } finally {
            setSigningOut(false);
          }
        },
      },
    ]);
  };

  const level = character ? calculateLevel(character.total_xp).level : 1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.identityCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase() ?? '?'}</Text>
        </View>
        <Text style={styles.email} numberOfLines={1}>
          {user?.email}
        </Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Level {level}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🔥 {character?.streak ?? 0} day streak</Text>
          </View>
        </View>
      </Card>

      <View>
        <SectionHeader title="Settings" />
        <Card style={styles.settingsCard}>
          {SETTINGS_ROWS.map((row, index) => (
            <View
              key={row}
              style={[styles.settingsRow, index < SETTINGS_ROWS.length - 1 && styles.settingsRowBorder]}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`${row}, coming soon`}
            >
              <Text style={styles.settingsLabel}>{row}</Text>
              <Text style={styles.settingsValue}>Coming soon</Text>
            </View>
          ))}
        </Card>
      </View>

      <Button label="Log Out" variant="danger" onPress={handleLogout} loading={signingOut} />
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
  identityCard: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
  },
  email: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 999,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  settingsLabel: {
    color: Colors.text,
    fontSize: FontSize.md,
  },
  settingsValue: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
});
