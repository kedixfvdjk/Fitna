import { Redirect, Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';

import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';

const TAB_ICONS: Record<string, string> = {
  index: '🏠',
  quests: '📜',
  character: '🛡️',
  challenges: '🏆',
  profile: '👤',
};

function TabIcon({ name, color }: { name: string; color: ColorValue }) {
  return <Text style={{ fontSize: 20, color }}>{TAB_ICONS[name]}</Text>;
}

export default function TabsLayout() {
  const session = useAuthStore((state) => state.session);
  const character = useGameStore((state) => state.character);

  if (!session) return <Redirect href="/(auth)/login" />;
  if (!character) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.surfaceLight,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="index" color={color} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color }) => <TabIcon name="quests" color={color} />,
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: 'Character',
          tabBarIcon: ({ color }) => <TabIcon name="character" color={color} />,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Challenges',
          tabBarIcon: ({ color }) => <TabIcon name="challenges" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon name="profile" color={color} />,
        }}
      />
    </Tabs>
  );
}
