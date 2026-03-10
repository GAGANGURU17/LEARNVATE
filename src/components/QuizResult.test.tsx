import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizResult } from './QuizResult';

const mockQuestion = {
  id: 'q1',
  category: 'Mathematics',
  question: 'What is 2 + 2?',
  options: ['3', '4', '5', '6'],
  correctIndex: 1,
  difficulty: 'easy' as const,
  explanation: 'Basic addition',
};

describe('QuizResult', () => {
  it('shows Correct when answer was correct', () => {
    const onNext = vi.fn();
    render(<QuizResult question={mockQuestion} selectedIndex={1} correct={true} onNext={onNext} />);
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('shows Incorrect when answer was wrong', () => {
    const onNext = vi.fn();
    render(
      <QuizResult question={mockQuestion} selectedIndex={0} correct={false} onNext={onNext} />
    );
    expect(screen.getByText('Incorrect')).toBeInTheDocument();
  });

  it('shows explanation when provided', () => {
    const onNext = vi.fn();
    render(<QuizResult question={mockQuestion} selectedIndex={1} correct={true} onNext={onNext} />);
    expect(screen.getByText('Basic addition')).toBeInTheDocument();
  });

  it('calls onNext when Next Question clicked', () => {
    const onNext = vi.fn();
    render(<QuizResult question={mockQuestion} selectedIndex={1} correct={true} onNext={onNext} />);
    fireEvent.click(screen.getByText('Next Question'));
    expect(onNext).toHaveBeenCalled();
  });
});
