import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

interface ProgressBarProps {
  progress: number;
  color?: string;
  trackColor?: string;
  height?: number;
  accessibilityLabel?: string;
}

export function ProgressBar({
  progress,
  color = Colors.primary,
  trackColor = Colors.surfaceLight,
  height = 10,
  accessibilityLabel,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: clamped,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped, widthAnim]);

  return (
    <View
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: trackColor }]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            borderRadius: height / 2,
            width: widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
