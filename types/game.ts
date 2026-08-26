export type Goal = 'lose_weight' | 'build_muscle' | 'get_fit' | 'improve_endurance';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'epic';

export type Profile = {
  id: string;
  username: string;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  goal: Goal | null;
  fitness_level: FitnessLevel | null;
  created_at: string;
  updated_at: string;
};

export type CharacterStats = {
  strength: number;
  endurance: number;
  vitality: number;
  recovery: number;
  discipline: number;
  nutrition: number;
};

export type Character = CharacterStats & {
  id: string;
  user_id: string;
  level: number;
  total_xp: number;
  coins: number;
  streak: number;
  created_at: string;
  updated_at: string;
};

export type Quest = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  xp_reward: number;
  coin_reward: number;
  quest_date: string;
  completed: boolean;
  created_at: string;
};

export type QuestCompletion = {
  id: string;
  quest_id: string;
  user_id: string;
  completed_at: string;
};

export type DailyActivity = {
  id: string;
  user_id: string;
  activity_date: string;
  steps: number;
  active_calories: number;
  distance_meters: number;
  sleep_minutes: number;
  workout_minutes: number;
  created_at: string;
  updated_at: string;
};

export type NutritionEntry = {
  id: string;
  user_id: string;
  entry_date: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ai_estimated: boolean;
  created_at: string;
};

export type ChallengeGoalProgress = {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
};

export type WeeklyChallenge = {
  title: string;
  description: string;
  goals: ChallengeGoalProgress[];
  xpReward: number;
  startsAt: string;
  endsAt: string;
};

export type LevelProgress = {
  level: number;
  currentLevelXP: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
};
