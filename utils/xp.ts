import { XP_CONFIG } from '@/constants/gameConfig';
import type { LevelProgress } from '@/types/game';

/**
 * XP required to advance from `level` to `level + 1`.
 * Grows geometrically so higher levels take meaningfully longer.
 */
export function xpForNextLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  return Math.round(XP_CONFIG.baseXP * Math.pow(XP_CONFIG.growthMultiplier, safeLevel - 1));
}

/**
 * Total cumulative XP required to reach the start of `level`.
 */
export function totalXPForLevel(level: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) {
    total += xpForNextLevel(l);
  }
  return total;
}

/**
 * Derive full level/progress info from a lifetime total XP value.
 */
export function calculateLevel(totalXP: number): LevelProgress {
  const safeTotalXP = Math.max(0, Math.floor(totalXP));

  let level = 1;
  let cumulativeXP = 0;

  while (true) {
    const needed = xpForNextLevel(level);
    if (cumulativeXP + needed > safeTotalXP) break;
    cumulativeXP += needed;
    level += 1;
  }

  const nextLevelXP = xpForNextLevel(level);
  const xpIntoLevel = safeTotalXP - cumulativeXP;

  return {
    level,
    currentLevelXP: cumulativeXP,
    xpIntoLevel,
    xpForNextLevel: nextLevelXP,
    progress: nextLevelXP > 0 ? xpIntoLevel / nextLevelXP : 0,
  };
}

export interface AddXPResult {
  totalXP: number;
  previousLevel: number;
  level: number;
  leveledUp: boolean;
  levelsGained: number;
  progress: LevelProgress;
}

/**
 * Pure function that applies an XP gain to a running total and reports
 * whether the character leveled up. Keeping this side-effect free means
 * the same logic can later run unchanged inside a Supabase Edge Function.
 */
export function addXP(currentTotalXP: number, amount: number): AddXPResult {
  if (amount < 0) {
    throw new Error('XP amount cannot be negative');
  }

  const previousLevel = calculateLevel(currentTotalXP).level;
  const totalXP = Math.max(0, Math.floor(currentTotalXP)) + Math.floor(amount);
  const progress = calculateLevel(totalXP);

  return {
    totalXP,
    previousLevel,
    level: progress.level,
    leveledUp: progress.level > previousLevel,
    levelsGained: progress.level - previousLevel,
    progress,
  };
}

export function xpForSteps(steps: number): number {
  return Math.floor(steps / 1000) * XP_CONFIG.perThousandSteps;
}
