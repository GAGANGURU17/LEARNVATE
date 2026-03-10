import type { Difficulty } from './types';

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard'];

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
export function getRecommendedDifficulty(stats: {
  easy: { correct: number; total: number };
  medium: { correct: number; total: number };
  hard: { correct: number; total: number };
}): Difficulty {
  const totalAnswered = stats.easy.total + stats.medium.total + stats.hard.total;
  if (totalAnswered < 5) return 'easy';

  const easyAccuracy = stats.easy.total > 0 ? stats.easy.correct / stats.easy.total : 0;
  const mediumAccuracy = stats.medium.total > 0 ? stats.medium.correct / stats.medium.total : 0;

  if (mediumAccuracy >= 0.8 && stats.medium.total >= 3) return 'hard';
  if (easyAccuracy >= 0.8 && stats.easy.total >= 3) {
    if (mediumAccuracy >= 0.7 || stats.medium.total === 0) return 'medium';
  }
  return 'easy';
}
