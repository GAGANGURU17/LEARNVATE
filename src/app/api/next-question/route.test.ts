import { describe, it, expect } from 'vitest';
import { POST } from './route';
import type { NextRequest } from 'next/server';

describe('POST /api/next-question', () => {
  it('returns 400 when category is missing', async () => {
    const req = new Request('http://localhost/api/next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentDifficulty: 'easy' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(400);
  });

  it('returns 400 when currentDifficulty is missing', async () => {
    const req = new Request('http://localhost/api/next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Mathematics' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(400);
  });

  it('returns 404 when no more questions', async () => {
    const req = new Request('http://localhost/api/next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Mathematics',
        currentDifficulty: 'easy',
        wasCorrect: false,
        streak: 0,
        answeredIds: ['m1', 'm2', 'm3', 'm4', 'm5', 's1', 's2', 's3', 's4', 's5'],
      }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid JSON', async () => {
    const req = new Request('http://localhost/api/next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json',
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(400);
  });

  it('returns 200 with question for valid body', async () => {
    const req = new Request('http://localhost/api/next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Mathematics',
        currentDifficulty: 'easy',
        wasCorrect: true,
        streak: 2,
      }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.question).toBeDefined();
    expect(data.nextDifficulty).toBeDefined();
    expect(data.question.category).toBe('Mathematics');
  });
});
