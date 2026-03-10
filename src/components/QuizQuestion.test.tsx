import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizQuestion } from './QuizQuestion';

const mockQuestion = {
  id: 'q1',
  category: 'Mathematics',
  question: 'What is 2 + 2?',
  options: ['3', '4', '5', '6'],
  correctIndex: 1,
  difficulty: 'easy' as const,
};

describe('QuizQuestion', () => {
  it('renders question text', () => {
    const onAnswer = vi.fn();
    render(
      <QuizQuestion
        question={mockQuestion}
        onAnswer={onAnswer}
        questionNumber={1}
        totalQuestions={10}
      />
    );
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
  });

  it('renders all options', () => {
    const onAnswer = vi.fn();
    render(
      <QuizQuestion
        question={mockQuestion}
        onAnswer={onAnswer}
        questionNumber={1}
        totalQuestions={10}
      />
    );
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('calls onAnswer when option selected and submit clicked', () => {
    const onAnswer = vi.fn();
    render(
      <QuizQuestion
        question={mockQuestion}
        onAnswer={onAnswer}
        questionNumber={1}
        totalQuestions={10}
      />
    );
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Submit Answer'));
    expect(onAnswer).toHaveBeenCalledWith(1, expect.any(Number));
  });

  it('disables submit when no option selected', () => {
    const onAnswer = vi.fn();
    render(
      <QuizQuestion
        question={mockQuestion}
        onAnswer={onAnswer}
        questionNumber={1}
        totalQuestions={10}
      />
    );
    const submit = screen.getByText('Submit Answer');
    expect(submit).toBeDisabled();
  });
});
