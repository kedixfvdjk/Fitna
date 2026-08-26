import { create } from 'zustand';

import type { FitnessLevel, Goal } from '@/types/game';

interface OnboardingDraft {
  goal: Goal | null;
  username: string;
  age: string;
  heightCm: string;
  weightKg: string;
  fitnessLevel: FitnessLevel;
}

interface OnboardingState extends OnboardingDraft {
  setGoal: (goal: Goal) => void;
  setProfileField: (field: keyof Omit<OnboardingDraft, 'goal'>, value: string) => void;
  reset: () => void;
}

const initialDraft: OnboardingDraft = {
  goal: null,
  username: '',
  age: '',
  heightCm: '',
  weightKg: '',
  fitnessLevel: 'beginner',
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialDraft,
  setGoal: (goal) => set({ goal }),
  setProfileField: (field, value) => set({ [field]: value } as Partial<OnboardingState>),
  reset: () => set({ ...initialDraft }),
}));
