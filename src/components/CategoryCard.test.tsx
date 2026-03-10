import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryCard } from './CategoryCard';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('CategoryCard', () => {
  it('renders category name', () => {
    render(<CategoryCard category="Mathematics" />);
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<CategoryCard category="Science" description="Test your science knowledge" />);
    expect(screen.getByText('Test your science knowledge')).toBeInTheDocument();
  });

  it('opens exam setup modal when clicked', () => {
    render(<CategoryCard category="General Knowledge" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText(/Exam Setup/)).toBeInTheDocument();
    expect(screen.getByText(/Start Exam/)).toBeInTheDocument();
  });
});
