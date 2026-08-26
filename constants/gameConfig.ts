import type { QuestDifficulty } from '@/types/game';

/**
 * Central tuning values for the XP / leveling / reward economy.
 * Keep this as the single source of truth so client and future
 * server-side functions compute identical results.
 */
export const XP_CONFIG = {
  baseXP: 100,
  growthMultiplier: 1.25,
  perThousandSteps: 5,
  workout: 50,
  longWorkout: 75,
  sleepGoal: 30,
  nutritionGoal: 20,
  dailyCompletionBonus: 25,
} as const;

export const QUEST_DIFFICULTY_XP: Record<QuestDifficulty, number> = {
  easy: 25,
  medium: 50,
  hard: 75,
  epic: 100,
};

export const QUEST_DIFFICULTY_COINS: Record<QuestDifficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 15,
  epic: 25,
};

export const STARTING_STATS = {
  strength: 1,
  endurance: 1,
  vitality: 1,
  recovery: 1,
  discipline: 1,
  nutrition: 1,
} as const;

export const GOAL_OPTIONS = [
  { id: 'lose_weight', label: 'Lose Weight' },
  { id: 'build_muscle', label: 'Build Muscle' },
  { id: 'get_fit', label: 'Get Fit' },
  { id: 'improve_endurance', label: 'Improve Endurance' },
] as const;

export const DEFAULT_DAILY_QUESTS = [
  {
    title: 'Begin Your Journey',
    description: 'Take your first 1,000 steps.',
    difficulty: 'easy' as QuestDifficulty,
    xp_reward: 5,
    coin_reward: QUEST_DIFFICULTY_COINS.easy,
  },
  {
    title: 'Train',
    description: 'Complete a workout.',
    difficulty: 'medium' as QuestDifficulty,
    xp_reward: 50,
    coin_reward: QUEST_DIFFICULTY_COINS.medium,
  },
  {
    title: 'Fuel Your Hero',
    description: 'Track your first meal.',
    difficulty: 'easy' as QuestDifficulty,
    xp_reward: 20,
    coin_reward: QUEST_DIFFICULTY_COINS.easy,
  },
];

export const WEEKLY_CHALLENGE = {
  title: 'The Iron Week',
  description: 'Complete 3 workouts and walk 30,000 steps this week.',
  goals: [
    { id: 'workouts', label: 'Workouts', target: 3, unit: 'sessions' },
    { id: 'steps', label: 'Steps', target: 30000, unit: 'steps' },
  ],
  xpReward: 500,
} as const;
