import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryCard } from './CategoryCard';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('CategoryCard', () => {
  it('renders category name', () => {
    render(<CategoryCard category="UPSC (IAS/IPS)" />);
    expect(screen.getByText('UPSC (IAS/IPS)')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<CategoryCard category="GATE (Engineering)" description="Test your engineering knowledge" />);
    expect(screen.getByText('Test your engineering knowledge')).toBeInTheDocument();
  });

  it('opens exam setup modal when clicked', () => {
    render(<CategoryCard category="SSC (CGL/CHSL)" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText(/Configure your examination session/)).toBeInTheDocument();
    expect(screen.getByText(/Launch Live Exam Session/)).toBeInTheDocument();
  });
});
