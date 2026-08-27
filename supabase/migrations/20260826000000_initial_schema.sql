-- Real Life RPG — initial schema
-- Tables, indexes, and Row Level Security policies for phase 1.
--
-- Every table is scoped to auth.uid(): a user can only read or write rows
-- they own. Run this in the Supabase SQL editor, or via
-- `supabase db push` / `supabase migration up` if you use the Supabase CLI.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  age integer check (age is null or (age between 13 and 100)),
  height_cm numeric check (height_cm is null or (height_cm between 50 and 300)),
  weight_kg numeric check (weight_kg is null or (weight_kg between 20 and 400)),
  goal text check (goal is null or goal in ('lose_weight', 'build_muscle', 'get_fit', 'improve_endurance')),
  fitness_level text check (fitness_level is null or fitness_level in ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per user, extends auth.users with app-specific profile data.';

-- ---------------------------------------------------------------------------
-- characters
-- ---------------------------------------------------------------------------
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  level integer not null default 1 check (level >= 1),
  total_xp integer not null default 0 check (total_xp >= 0),
  coins integer not null default 0 check (coins >= 0),
  streak integer not null default 0 check (streak >= 0),
  strength integer not null default 1 check (strength >= 1),
  endurance integer not null default 1 check (endurance >= 1),
  vitality integer not null default 1 check (vitality >= 1),
  recovery integer not null default 1 check (recovery >= 1),
  discipline integer not null default 1 check (discipline >= 1),
  nutrition integer not null default 1 check (nutrition >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.characters is 'One RPG character per user. Created at the end of onboarding.';

-- ---------------------------------------------------------------------------
-- daily_activity
-- ---------------------------------------------------------------------------
create table if not exists public.daily_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_date date not null default current_date,
  steps integer not null default 0 check (steps >= 0),
  active_calories integer not null default 0 check (active_calories >= 0),
  distance_meters numeric not null default 0 check (distance_meters >= 0),
  sleep_minutes integer not null default 0 check (sleep_minutes >= 0),
  workout_minutes integer not null default 0 check (workout_minutes >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, activity_date)
);

comment on table public.daily_activity is 'Per-day aggregated health data. Populated by HealthKit/Health Connect in a later phase.';

-- ---------------------------------------------------------------------------
-- quests
-- ---------------------------------------------------------------------------
create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard', 'epic')),
  xp_reward integer not null default 0 check (xp_reward >= 0),
  coin_reward integer not null default 0 check (coin_reward >= 0),
  quest_date date not null default current_date,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.quests is 'Daily quests assigned to a user. AI-generated quests will also live here in a later phase.';

-- ---------------------------------------------------------------------------
-- quest_completions
-- ---------------------------------------------------------------------------
create table if not exists public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid not null unique references public.quests (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  completed_at timestamptz not null default now()
);

comment on table public.quest_completions is
  'Append-only completion record. The unique constraint on quest_id is a hard '
  'backstop against double-rewarding a quest even if the client is misbehaving.';

-- ---------------------------------------------------------------------------
-- nutrition_entries
-- ---------------------------------------------------------------------------
create table if not exists public.nutrition_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null default current_date,
  food_name text not null,
  calories integer not null default 0 check (calories >= 0),
  protein_g numeric not null default 0 check (protein_g >= 0),
  carbs_g numeric not null default 0 check (carbs_g >= 0),
  fat_g numeric not null default 0 check (fat_g >= 0),
  ai_estimated boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.nutrition_entries is 'Logged food entries. AI-estimated macros will be added in a later phase.';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_daily_activity_user_date on public.daily_activity (user_id, activity_date desc);
create index if not exists idx_quests_user_date on public.quests (user_id, quest_date desc);
create index if not exists idx_quest_completions_user_id on public.quest_completions (user_id);
create index if not exists idx_nutrition_entries_user_date on public.nutrition_entries (user_id, entry_date desc);

-- ---------------------------------------------------------------------------
-- updated_at maintenance trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.characters;
create trigger set_updated_at
  before update on public.characters
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.daily_activity;
create trigger set_updated_at
  before update on public.daily_activity
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.daily_activity enable row level security;
alter table public.quests enable row level security;
alter table public.quest_completions enable row level security;
alter table public.nutrition_entries enable row level security;

-- Every policy is dropped first so this script can be re-run safely
-- (e.g. after a partial failure) without "policy already exists" errors.

-- profiles: id *is* the user id
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- characters
drop policy if exists "characters_select_own" on public.characters;
create policy "characters_select_own" on public.characters
  for select using (auth.uid() = user_id);
drop policy if exists "characters_insert_own" on public.characters;
create policy "characters_insert_own" on public.characters
  for insert with check (auth.uid() = user_id);
drop policy if exists "characters_update_own" on public.characters;
create policy "characters_update_own" on public.characters
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "characters_delete_own" on public.characters;
create policy "characters_delete_own" on public.characters
  for delete using (auth.uid() = user_id);

-- daily_activity
drop policy if exists "daily_activity_select_own" on public.daily_activity;
create policy "daily_activity_select_own" on public.daily_activity
  for select using (auth.uid() = user_id);
drop policy if exists "daily_activity_insert_own" on public.daily_activity;
create policy "daily_activity_insert_own" on public.daily_activity
  for insert with check (auth.uid() = user_id);
drop policy if exists "daily_activity_update_own" on public.daily_activity;
create policy "daily_activity_update_own" on public.daily_activity
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "daily_activity_delete_own" on public.daily_activity;
create policy "daily_activity_delete_own" on public.daily_activity
  for delete using (auth.uid() = user_id);

-- quests
drop policy if exists "quests_select_own" on public.quests;
create policy "quests_select_own" on public.quests
  for select using (auth.uid() = user_id);
drop policy if exists "quests_insert_own" on public.quests;
create policy "quests_insert_own" on public.quests
  for insert with check (auth.uid() = user_id);
drop policy if exists "quests_update_own" on public.quests;
create policy "quests_update_own" on public.quests
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "quests_delete_own" on public.quests;
create policy "quests_delete_own" on public.quests
  for delete using (auth.uid() = user_id);

-- quest_completions: also verify the referenced quest actually belongs to
-- the caller, so a user can't log a completion against someone else's quest.
drop policy if exists "quest_completions_select_own" on public.quest_completions;
create policy "quest_completions_select_own" on public.quest_completions
  for select using (auth.uid() = user_id);
drop policy if exists "quest_completions_insert_own" on public.quest_completions;
create policy "quest_completions_insert_own" on public.quest_completions
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.quests q
      where q.id = quest_id and q.user_id = auth.uid()
    )
  );

-- nutrition_entries
drop policy if exists "nutrition_entries_select_own" on public.nutrition_entries;
create policy "nutrition_entries_select_own" on public.nutrition_entries
  for select using (auth.uid() = user_id);
drop policy if exists "nutrition_entries_insert_own" on public.nutrition_entries;
create policy "nutrition_entries_insert_own" on public.nutrition_entries
  for insert with check (auth.uid() = user_id);
drop policy if exists "nutrition_entries_update_own" on public.nutrition_entries;
create policy "nutrition_entries_update_own" on public.nutrition_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "nutrition_entries_delete_own" on public.nutrition_entries;
create policy "nutrition_entries_delete_own" on public.nutrition_entries
  for delete using (auth.uid() = user_id);
