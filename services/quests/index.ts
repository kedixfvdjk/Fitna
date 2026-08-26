import { DEFAULT_DAILY_QUESTS } from '@/constants/gameConfig';
import { supabase } from '@/lib/supabase';
import type { Character, Quest } from '@/types/game';
import { addXP, type AddXPResult } from '@/utils/xp';

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Fetches today's quests for a user, seeding the default quest set on
 * their very first visit of the day if none exist yet.
 */
export async function getTodaysQuests(userId: string): Promise<Quest[]> {
  const questDate = todayDateString();

  const { data: existing, error: fetchError } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', userId)
    .eq('quest_date', questDate)
    .order('created_at', { ascending: true });

  if (fetchError) throw fetchError;
  if (existing && existing.length > 0) return existing as Quest[];

  const { data: seeded, error: insertError } = await supabase
    .from('quests')
    .insert(
      DEFAULT_DAILY_QUESTS.map((quest) => ({
        user_id: userId,
        quest_date: questDate,
        completed: false,
        ...quest,
      }))
    )
    .select('*');

  if (insertError) throw insertError;
  return (seeded ?? []) as Quest[];
}

export class QuestAlreadyCompletedError extends Error {
  constructor() {
    super('This quest has already been completed.');
    this.name = 'QuestAlreadyCompletedError';
  }
}

export interface CompleteQuestResult {
  quest: Quest;
  character: Character;
  xpResult: AddXPResult;
  coinsAwarded: number;
  dailyBonusAwarded: boolean;
}

/**
 * Marks a quest complete and grants its rewards.
 *
 * The `.eq('completed', false)` guard makes the update atomic at the
 * database level: only the first request for a given quest can flip it
 * to completed, so rapid repeat taps (or two devices racing) cannot pay
 * out twice. This same check-and-set logic is what should move into a
 * Supabase Edge Function / RPC once XP transactions go server-side —
 * nothing here depends on client trust for the reward math itself.
 */
export async function completeQuest(
  userId: string,
  quest: Quest,
  character: Character
): Promise<CompleteQuestResult> {
  if (quest.completed) {
    throw new QuestAlreadyCompletedError();
  }

  const { data: updatedQuest, error: updateError } = await supabase
    .from('quests')
    .update({ completed: true })
    .eq('id', quest.id)
    .eq('user_id', userId)
    .eq('completed', false)
    .select('*')
    .single();

  if (updateError || !updatedQuest) {
    throw new QuestAlreadyCompletedError();
  }

  const { error: completionError } = await supabase.from('quest_completions').insert({
    quest_id: quest.id,
    user_id: userId,
  });

  if (completionError) throw completionError;

  const { data: remainingQuests, error: remainingError } = await supabase
    .from('quests')
    .select('completed')
    .eq('user_id', userId)
    .eq('quest_date', quest.quest_date);

  if (remainingError) throw remainingError;

  const dailyBonusAwarded = (remainingQuests ?? []).every((q) => q.completed);
  const coinsAwarded = quest.coin_reward;
  const xpToAward = quest.xp_reward + (dailyBonusAwarded ? 25 : 0);

  const xpResult = addXP(character.total_xp, xpToAward);

  const { data: updatedCharacter, error: characterError } = await supabase
    .from('characters')
    .update({
      total_xp: xpResult.totalXP,
      level: xpResult.level,
      coins: character.coins + coinsAwarded,
    })
    .eq('id', character.id)
    .select('*')
    .single();

  if (characterError || !updatedCharacter) throw characterError ?? new Error('Character update failed');

  return {
    quest: updatedQuest as Quest,
    character: updatedCharacter as Character,
    xpResult,
    coinsAwarded,
    dailyBonusAwarded,
  };
}
