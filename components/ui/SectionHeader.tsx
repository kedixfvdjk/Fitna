import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export function SectionHeader({ title, subtitle, right }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textGroup}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  textGroup: {
    gap: 2,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
});
