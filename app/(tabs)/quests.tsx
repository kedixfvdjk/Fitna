import { useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { QuestCard } from '@/components/quests/QuestCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import type { Quest } from '@/types/game';

export default function QuestsScreen() {
  const userId = useAuthStore((state) => state.user?.id);
  const quests = useGameStore((state) => state.quests);
  const loading = useGameStore((state) => state.loading);
  const loadQuests = useGameStore((state) => state.loadQuests);
  const completeQuest = useGameStore((state) => state.completeQuest);

  useEffect(() => {
    if (userId) loadQuests(userId);
  }, [userId, loadQuests]);

  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SectionHeader
          title="Daily Quests"
          subtitle={`${completedCount}/${quests.length} completed today`}
        />
      </View>
      <FlatList
        data={quests}
        keyExtractor={(item: Quest) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              if (userId) loadQuests(userId);
            }}
            tintColor={Colors.primary}
          />
        }
        renderItem={({ item }) => (
          <QuestCard
            quest={item}
            onComplete={(questId) => {
              if (userId) return completeQuest(userId, questId);
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyText}>No quests yet today. Pull to refresh.</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
});
