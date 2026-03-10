import type { Difficulty } from './types';

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard', 'preliminary', 'mains', 'advanced'];

/**
 * Adaptive learning algorithm that adjusts question difficulty based on performance.
 * Uses a streak-based approach: correct answers increase difficulty, incorrect decrease.
 */
export function getNextDifficulty(
  currentDifficulty: Difficulty,
  wasCorrect: boolean,
  streak: number
): Difficulty {
  const currentIndex = DIFFICULTY_ORDER.indexOf(currentDifficulty);

  if (wasCorrect) {
    if (streak >= 2 && currentIndex < DIFFICULTY_ORDER.length - 1) {
      return DIFFICULTY_ORDER[currentIndex + 1];
    }
    return currentDifficulty;
  }

  if (currentIndex > 0) {
    return DIFFICULTY_ORDER[currentIndex - 1];
  }
  return currentDifficulty;
}

/**
 * Calculate accuracy from answer history for a given difficulty level.
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Get recommended starting difficulty based on historical performance.
 */
export function getRecommendedDifficulty(stats: Record<string, { correct: number; total: number }>): Difficulty {
  const easyStats = stats.easy || { correct: 0, total: 0 };
  const mediumStats = stats.medium || { correct: 0, total: 0 };
  
  const totalAnswered = Object.values(stats).reduce((acc, s) => acc + s.total, 0);
  if (totalAnswered < 5) return 'preliminary';

  const easyAccuracy = easyStats.total > 0 ? easyStats.correct / easyStats.total : 0;
  const mediumAccuracy = mediumStats.total > 0 ? mediumStats.correct / mediumStats.total : 0;

  if (mediumAccuracy >= 0.8 && mediumStats.total >= 3) return 'advanced';
  if (easyAccuracy >= 0.8 && easyStats.total >= 3) return 'mains';
  
  return 'preliminary';
}
