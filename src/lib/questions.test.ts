import { describe, it, expect } from 'vitest';
import {
  QUESTION_CATEGORIES,
  SAMPLE_QUESTIONS,
  getQuestionsByCategoryAndDifficulty,
  getQuestionById,
} from './questions';

describe('QUESTION_CATEGORIES', () => {
  it('contains expected categories', () => {
    expect(QUESTION_CATEGORIES).toContain('Mathematics');
    expect(QUESTION_CATEGORIES).toContain('Science');
    expect(QUESTION_CATEGORIES).toContain('History');
    expect(QUESTION_CATEGORIES).toContain('Geography');
    expect(QUESTION_CATEGORIES).toContain('English');
    expect(QUESTION_CATEGORIES).toContain('General Knowledge');
    expect(QUESTION_CATEGORIES).toHaveLength(6);
  });
});

describe('SAMPLE_QUESTIONS', () => {
  it('has questions for each category', () => {
    const categories = new Set(SAMPLE_QUESTIONS.map((q) => q.category));
    expect(categories.size).toBe(6);
  });

  it('each question has valid structure', () => {
    SAMPLE_QUESTIONS.forEach((q) => {
      expect(q.id).toBeTruthy();
      expect(q.category).toBeTruthy();
      expect(q.question).toBeTruthy();
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(['easy', 'medium', 'hard']).toContain(q.difficulty);
    });
  });
});

describe('getQuestionsByCategoryAndDifficulty', () => {
  it('returns matching questions', () => {
    const result = getQuestionsByCategoryAndDifficulty('Mathematics', 'easy', []);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((q) => {
      expect(q.category).toBe('Mathematics');
      expect(q.difficulty).toBe('easy');
    });
  });

  it('excludes specified ids', () => {
    const all = getQuestionsByCategoryAndDifficulty('Mathematics', 'easy', []);
    const firstId = all[0]?.id;
    expect(firstId).toBeTruthy();
    const excluded = getQuestionsByCategoryAndDifficulty('Mathematics', 'easy', [
      firstId as string,
    ]);
    expect(excluded.some((q) => q.id === firstId)).toBe(false);
  });

  it('returns empty array for non-existent category/difficulty combo', () => {
    const result = getQuestionsByCategoryAndDifficulty('NonExistent', 'easy', []);
    expect(result).toHaveLength(0);
  });
});

describe('getQuestionById', () => {
  it('returns question when id exists', () => {
    const q = getQuestionById('m1');
    expect(q).toBeDefined();
    expect(q?.id).toBe('m1');
  });

  it('returns undefined when id does not exist', () => {
    expect(getQuestionById('nonexistent')).toBeUndefined();
  });
});
