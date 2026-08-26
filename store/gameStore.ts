import { create } from 'zustand';

import { completeQuest as completeQuestRequest, getTodaysQuests } from '@/services/quests';
import type { Character, Quest } from '@/types/game';

interface GameState {
  character: Character | null;
  quests: Quest[];
  loading: boolean;
  error: string | null;
  lastLevelUp: number | null;
  setCharacter: (character: Character | null) => void;
  setQuests: (quests: Quest[]) => void;
  loadQuests: (userId: string) => Promise<void>;
  addXP: (amount: number) => void;
  completeQuest: (userId: string, questId: string) => Promise<void>;
  clearLevelUp: () => void;
  reset: () => void;
}

const initialState = {
  character: null as Character | null,
  quests: [] as Quest[],
  loading: false,
  error: null as string | null,
  lastLevelUp: null as number | null,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  setCharacter: (character) => set({ character }),
  setQuests: (quests) => set({ quests }),

  loadQuests: async (userId) => {
    set({ loading: true, error: null });
    try {
      const quests = await getTodaysQuests(userId);
      set({ quests, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'Failed to load quests' });
    }
  },

  /**
   * Optimistic local XP bump for UI feedback only. The authoritative value
   * always comes back from Supabase via completeQuest / character refetch.
   */
  addXP: (amount) => {
    const { character } = get();
    if (!character) return;
    set({ character: { ...character, total_xp: character.total_xp + amount } });
  },

  completeQuest: async (userId, questId) => {
    const { character, quests } = get();
    const quest = quests.find((q) => q.id === questId);
    if (!character || !quest) return;

    set({ error: null });
    try {
      const result = await completeQuestRequest(userId, quest, character);
      set({
        character: result.character,
        quests: get().quests.map((q) => (q.id === questId ? result.quest : q)),
        lastLevelUp: result.xpResult.leveledUp ? result.xpResult.level : null,
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to complete quest' });
    }
  },

  clearLevelUp: () => set({ lastLevelUp: null }),

  reset: () => set({ ...initialState }),
}));
