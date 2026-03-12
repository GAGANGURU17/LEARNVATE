import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/categories', () => {
  it('returns categories list', async () => {
    const req = new Request('http://localhost/api/categories');
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.categories).toBeDefined();
    expect(Array.isArray(data.categories)).toBe(true);
    expect(data.categories).toContain('UPSC (IAS/IPS)');
    expect(data.categories).toContain('GATE (Engineering)');
  });
});
