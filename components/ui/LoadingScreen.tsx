import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
