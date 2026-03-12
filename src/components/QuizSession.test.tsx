import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QuizSession } from './QuizSession';

const mockFetch = vi.fn();

describe('QuizSession', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  it('shows loading initially', () => {
    mockFetch.mockImplementation(
      () => new Promise(() => {}) // never resolves
    );
    render(<QuizSession category="UPSC (IAS/IPS)" onComplete={vi.fn()} />);
    expect(screen.getByText(/AI is crafting your exam/i)).toBeInTheDocument();
  });

  it('fetches first question on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'upsc-1',
        category: 'UPSC (IAS/IPS)',
        question: 'What is 2+2?',
        options: ['3', '4', '5'],
        correctIndex: 1,
        difficulty: 'preliminary',
      }),
    });
    render(<QuizSession category="UPSC (IAS/IPS)" onComplete={vi.fn()} />);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/questions?'));
    });
  });

  it('shows error when fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Failed to fetch' }) });
    render(<QuizSession category="UPSC (IAS/IPS)" onComplete={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
    });
  });
});
