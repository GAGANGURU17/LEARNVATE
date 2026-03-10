import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SessionSummary } from './SessionSummary';

describe('SessionSummary', () => {
  it('displays total and correct counts', () => {
    render(<SessionSummary total={10} correct={8} onRestart={vi.fn()} onHome={vi.fn()} />);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('displays accuracy percentage', () => {
    render(<SessionSummary total={10} correct={8} onRestart={vi.fn()} onHome={vi.fn()} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('calls onRestart when Try Again clicked', () => {
    const onRestart = vi.fn();
    render(<SessionSummary total={10} correct={8} onRestart={onRestart} onHome={vi.fn()} />);
    fireEvent.click(screen.getByText('Try Again'));
    expect(onRestart).toHaveBeenCalled();
  });

  it('calls onHome when Back to Home clicked', () => {
    const onHome = vi.fn();
    render(<SessionSummary total={10} correct={8} onRestart={vi.fn()} onHome={onHome} />);
    fireEvent.click(screen.getByText('Back to Home'));
    expect(onHome).toHaveBeenCalled();
  });
});
