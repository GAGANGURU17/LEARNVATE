import { describe, it, expect } from 'vitest';
import {
  QUESTION_CATEGORIES,
  SAMPLE_QUESTIONS,
  getQuestionsByCategoryAndDifficulty,
  getQuestionById,
} from './questions';

describe('QUESTION_CATEGORIES', () => {
  it('contains expected categories', () => {
    expect(QUESTION_CATEGORIES).toContain('UPSC (IAS/IPS)');
    expect(QUESTION_CATEGORIES).toContain('GATE (Engineering)');
    expect(QUESTION_CATEGORIES).toContain('SSC (CGL/CHSL)');
    expect(QUESTION_CATEGORIES).toContain('Central Govt Exams');
    expect(QUESTION_CATEGORIES).toContain('State Govt Exams');
    expect(QUESTION_CATEGORIES).toContain('University Entrances');
    expect(QUESTION_CATEGORIES).toHaveLength(6);
  });
});

describe('SAMPLE_QUESTIONS', () => {
  it('has questions for each category', () => {
    const categories = new Set(SAMPLE_QUESTIONS.map((q) => q.category));
    expect(categories.size).toBe(10); 
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
      expect(['easy', 'medium', 'hard', 'preliminary', 'mains', 'advanced']).toContain(q.difficulty);
    });
  });
});

describe('getQuestionsByCategoryAndDifficulty', () => {
  it('returns matching questions', () => {
    const result = getQuestionsByCategoryAndDifficulty('UPSC (IAS/IPS)', 'preliminary', []);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((q) => {
      expect(q.category).toBe('UPSC (IAS/IPS)');
      expect(q.difficulty).toBe('preliminary');
    });
  });

  it('excludes specified ids', () => {
    const all = getQuestionsByCategoryAndDifficulty('UPSC (IAS/IPS)', 'preliminary', []);
    const firstId = all[0]?.id;
    expect(firstId).toBeTruthy();
    const excluded = getQuestionsByCategoryAndDifficulty('UPSC (IAS/IPS)', 'preliminary', [
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
    const q = getQuestionById('upsc-1');
    expect(q).toBeDefined();
    expect(q?.id).toBe('upsc-1');
  });

  it('returns undefined when id does not exist', () => {
    expect(getQuestionById('nonexistent')).toBeUndefined();
  });
});
