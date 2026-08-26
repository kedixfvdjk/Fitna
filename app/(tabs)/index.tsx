import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CharacterHeader } from '@/components/character/CharacterHeader';
import { QuestCard } from '@/components/quests/QuestCard';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Colors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import type { DailyActivity } from '@/types/game';

export default function DashboardScreen() {
  const userId = useAuthStore((state) => state.user?.id);
  const character = useGameStore((state) => state.character);
  const quests = useGameStore((state) => state.quests);
  const loadQuests = useGameStore((state) => state.loadQuests);
  const completeQuest = useGameStore((state) => state.completeQuest);

  const [activity, setActivity] = useState<DailyActivity | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadActivity = async () => {
    if (!userId) return;
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from('daily_activity')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_date', today)
      .maybeSingle<DailyActivity>();
    setActivity(data);
  };

  useEffect(() => {
    if (!userId) return;
    loadQuests(userId);
    loadActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleRefresh = async () => {
    if (!userId) return;
    setRefreshing(true);
    await Promise.all([loadQuests(userId), loadActivity()]);
    setRefreshing(false);
  };

  if (!character) return null;

  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />}
    >
      <Card>
        <CharacterHeader character={character} />
      </Card>

      <View>
        <SectionHeader title="Today's Activity" subtitle="Synced from your device (coming soon)" />
        <View style={styles.statsGrid}>
          <StatCard label="Steps" value={activity?.steps ?? 0} icon="👟" />
          <StatCard label="Calories" value={activity?.active_calories ?? 0} icon="🔥" accentColor={Colors.gold} />
          <StatCard label="Workout (min)" value={activity?.workout_minutes ?? 0} icon="💪" accentColor={Colors.green} />
          <StatCard
            label="Sleep (min)"
            value={activity?.sleep_minutes ?? 0}
            icon="😴"
            accentColor={Colors.primary}
          />
        </View>
      </View>

      <View>
        <SectionHeader
          title="Daily Quests"
          subtitle={`${completedCount}/${quests.length} completed`}
        />
        <View style={styles.questList}>
          {quests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={(questId) => {
                if (userId) return completeQuest(userId, questId);
              }}
            />
          ))}
          {quests.length === 0 ? (
            <Text style={styles.emptyText}>No quests yet today. Pull to refresh.</Text>
          ) : null}
        </View>
      </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  questList: {
    gap: Spacing.sm,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
});
