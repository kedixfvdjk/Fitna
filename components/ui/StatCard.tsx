import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  accentColor?: string;
  icon?: string;
}

export function StatCard({ label, value, accentColor = Colors.primary, icon }: StatCardProps) {
  return (
    <View
      style={styles.card}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={styles.topRow}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={[styles.value, { color: accentColor }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    gap: Spacing.xs,
    minWidth: 100,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  icon: {
    fontSize: FontSize.md,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
  },
});
