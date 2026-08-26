import { Redirect, Stack } from 'expo-router';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout() {
  const session = useAuthStore((state) => state.session);
  const initialized = useAuthStore((state) => state.initialized);

  if (!initialized) return <LoadingScreen />;
  if (session) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
