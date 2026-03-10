import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/questions', () => {
  it('returns 400 when category is missing', async () => {
    const req = new Request('http://localhost/api/questions?difficulty=easy');
    const res = await GET(req as unknown as Request);
    expect(res.status).toBe(400);
  });

  it('returns 400 when difficulty is missing', async () => {
    const req = new Request('http://localhost/api/questions?category=Mathematics');
    const res = await GET(req as unknown as Request);
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid category', async () => {
    const req = new Request('http://localhost/api/questions?category=Invalid&difficulty=easy');
    const res = await GET(req as unknown as Request);
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid difficulty', async () => {
    const req = new Request(
      'http://localhost/api/questions?category=Mathematics&difficulty=invalid'
    );
    const res = await GET(req as unknown as Request);
    expect(res.status).toBe(400);
  });

  it('returns 404 when no questions available', async () => {
    const req = new Request(
      'http://localhost/api/questions?category=Mathematics&difficulty=easy&exclude=m1,m2'
    );
    const res = await GET(req as unknown as NextRequest);
    expect(res.status).toBe(404);
  });

  it('returns 200 with question for valid params', async () => {
    const req = new Request('http://localhost/api/questions?category=Mathematics&difficulty=easy');
    const res = await GET(req as unknown as Request);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBeTruthy();
    expect(data.category).toBe('Mathematics');
    expect(data.difficulty).toBe('easy');
    expect(data.question).toBeTruthy();
    expect(Array.isArray(data.options)).toBe(true);
    expect(typeof data.correctIndex).toBe('number');
  });
});
