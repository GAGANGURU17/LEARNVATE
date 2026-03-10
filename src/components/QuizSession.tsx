'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';
import type { McqQuestion } from '@/lib/types';
import type { Difficulty } from '@/lib/types';

interface QuizSessionProps {
  category: string;
  topic?: 'mixed' | 'easy' | 'medium' | 'hard';
  timerMinutes?: number;
  onComplete: (stats: {
    total: number;
    correct: number;
    byDifficulty: Record<Difficulty, { correct: number; total: number }>;
    timeUp?: boolean;
  }) => void;
}

type Phase = 'question' | 'result';

export function QuizSession({
  category,
  topic = 'mixed',
  timerMinutes = 0,
  onComplete,
}: QuizSessionProps) {
  const [phase, setPhase] = useState<Phase>('question');
  const [currentQuestion, setCurrentQuestion] = useState<McqQuestion | null>(null);
  const initialDifficulty: Difficulty =
    topic === 'mixed' ? 'easy' : topic;
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const fixedDifficulty = topic !== 'mixed' ? topic : undefined;
  const totalSeconds = timerMinutes > 0 ? timerMinutes * 60 : 0;
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(
    totalSeconds > 0 ? totalSeconds : null
  );

  useEffect(() => {
    if (secondsRemaining === null || secondsRemaining <= 0) return;
    const id = setInterval(() => {
      setSecondsRemaining((s) => {
        if (s === null || s <= 1) return 0;
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [secondsRemaining]);

  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [lastAnswer, setLastAnswer] = useState<{
    selectedIndex: number;
    correct: boolean;
  } | null>(null);
  const [stats, setStats] = useState<Record<Difficulty, { correct: number; total: number }>>({
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = useCallback(
    async (nextDifficulty: Difficulty, exclude: string[]) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          category,
          difficulty: nextDifficulty,
          exclude: exclude.join(','),
        });
        const res = await fetch(`/api/questions?${params}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? 'Failed to fetch question');
        }
        const q = await res.json();
        setCurrentQuestion(q);
        setDifficulty(nextDifficulty);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  useEffect(() => {
    fetchQuestion(initialDifficulty, []);
  }, [fetchQuestion, initialDifficulty]);

  useEffect(() => {
    if (secondsRemaining === 0 && totalSeconds > 0) {
      onComplete({
        total: questionCount + 1,
        correct: Object.values(stats).reduce((acc, d) => acc + d.correct, 0),
        byDifficulty: stats,
        timeUp: true,
      });
    }
  }, [secondsRemaining]);

  const handleAnswer = (selectedIndex: number, _timeSpentMs: number) => {
    if (!currentQuestion) return;
    const correct = selectedIndex === currentQuestion.correctIndex;
    setLastAnswer({ selectedIndex, correct });

    const newStats = { ...stats };
    newStats[difficulty].total += 1;
    if (correct) newStats[difficulty].correct += 1;
    setStats(newStats);

    if (correct) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    setAnsweredIds((ids) => [...ids, currentQuestion.id]);
    setPhase('result');
  };

  const handleNext = async () => {
    setLastAnswer(null);
    setPhase('question');
    setQuestionCount((c) => c + 1);

    try {
      const res = await fetch('/api/next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          currentDifficulty: difficulty,
          wasCorrect: lastAnswer?.correct ?? false,
          streak,
          answeredIds: [...answeredIds, currentQuestion?.id].filter(Boolean),
          fixedDifficulty,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 404 && data.error === 'No more questions available') {
          onComplete({
            total: questionCount + 1,
            correct: Object.values(stats).reduce((acc, d) => acc + d.correct, 0),
            byDifficulty: stats,
            timeUp: false,
          });
          return;
        }
        throw new Error(data.error ?? 'Failed to fetch next question');
      }

      const { question: q, nextDifficulty } = await res.json();
      setCurrentQuestion(q);
      setDifficulty(nextDifficulty);
      setAnsweredIds((ids) => [...ids, currentQuestion?.id ?? '']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (loading && !currentQuestion) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-slate-500">Loading question...</div>
      </div>
    );
  }

  if (error && !currentQuestion) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-medium">Error: {error}</p>
      </div>
    );
  }

  if (phase === 'result' && currentQuestion && lastAnswer) {
    return (
      <QuizResult
        question={currentQuestion}
        selectedIndex={lastAnswer.selectedIndex}
        correct={lastAnswer.correct}
        onNext={handleNext}
      />
    );
  }

  if (currentQuestion) {
    return (
      <QuizQuestion
        question={currentQuestion}
        onAnswer={handleAnswer}
        questionNumber={questionCount + 1}
        totalQuestions={30}
        secondsLeft={secondsRemaining}
      />
    );
  }

  return null;
}
