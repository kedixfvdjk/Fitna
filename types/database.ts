/**
 * Hand-written shape of the Supabase schema.
 * Replace with `supabase gen types typescript` output once the project is linked.
 */
import type {
  Character,
  DailyActivity,
  NutritionEntry,
  Profile,
  Quest,
  QuestCompletion,
} from './game';

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: '12';
  };
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      characters: {
        Row: Character;
        Insert: Partial<Character> & { user_id: string };
        Update: Partial<Character>;
        Relationships: [];
      };
      daily_activity: {
        Row: DailyActivity;
        Insert: Partial<DailyActivity> & { user_id: string; activity_date: string };
        Update: Partial<DailyActivity>;
        Relationships: [];
      };
      quests: {
        Row: Quest;
        Insert: Partial<Quest> & { user_id: string; title: string };
        Update: Partial<Quest>;
        Relationships: [];
      };
      quest_completions: {
        Row: QuestCompletion;
        Insert: Partial<QuestCompletion> & { quest_id: string; user_id: string };
        Update: Partial<QuestCompletion>;
        Relationships: [];
      };
      nutrition_entries: {
        Row: NutritionEntry;
        Insert: Partial<NutritionEntry> & { user_id: string; food_name: string };
        Update: Partial<NutritionEntry>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
