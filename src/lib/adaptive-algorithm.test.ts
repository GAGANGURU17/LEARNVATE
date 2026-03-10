import { describe, it, expect } from 'vitest';
import {
  getNextDifficulty,
  calculateAccuracy,
  getRecommendedDifficulty,
} from './adaptive-algorithm';

describe('getNextDifficulty', () => {
  it('stays easy when correct with streak 0', () => {
    expect(getNextDifficulty('easy', true, 0)).toBe('easy');
  });

  it('stays easy when correct with streak 1', () => {
    expect(getNextDifficulty('easy', true, 1)).toBe('easy');
  });

  it('moves to medium when correct with streak 2', () => {
    expect(getNextDifficulty('easy', true, 2)).toBe('medium');
  });

  it('moves to hard when correct with streak 2 at medium', () => {
    expect(getNextDifficulty('medium', true, 2)).toBe('hard');
  });

  it('stays hard when correct at hard', () => {
    expect(getNextDifficulty('hard', true, 2)).toBe('hard');
  });

  it('drops from medium to easy when incorrect', () => {
    expect(getNextDifficulty('medium', false, 5)).toBe('easy');
  });

  it('drops from hard to medium when incorrect', () => {
    expect(getNextDifficulty('hard', false, 3)).toBe('medium');
  });

  it('stays easy when incorrect at easy', () => {
    expect(getNextDifficulty('easy', false, 0)).toBe('easy');
  });
});

describe('calculateAccuracy', () => {
  it('returns 0 when total is 0', () => {
    expect(calculateAccuracy(0, 0)).toBe(0);
  });

  it('returns 100 when all correct', () => {
    expect(calculateAccuracy(10, 10)).toBe(100);
  });

  it('returns 50 when half correct', () => {
    expect(calculateAccuracy(5, 10)).toBe(50);
  });

  it('rounds to nearest integer', () => {
    expect(calculateAccuracy(1, 3)).toBe(33);
  });
});

describe('getRecommendedDifficulty', () => {
  it('returns easy when fewer than 5 questions answered', () => {
    expect(
      getRecommendedDifficulty({
        easy: { correct: 3, total: 3 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 },
      })
    ).toBe('easy');
  });

  it('returns easy when easy accuracy is low', () => {
    expect(
      getRecommendedDifficulty({
        easy: { correct: 1, total: 5 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 },
      })
    ).toBe('easy');
  });

  it('returns medium when easy mastery achieved', () => {
    expect(
      getRecommendedDifficulty({
        easy: { correct: 4, total: 5 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 },
      })
    ).toBe('medium');
  });

  it('returns hard when medium mastery achieved', () => {
    expect(
      getRecommendedDifficulty({
        easy: { correct: 5, total: 5 },
        medium: { correct: 4, total: 5 },
        hard: { correct: 0, total: 0 },
      })
    ).toBe('hard');
  });
});
