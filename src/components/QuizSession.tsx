'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';
import { Sparkles, Shield, Clock, BookOpen, ChevronRight, X } from 'lucide-react';
import type { McqQuestion, Difficulty, ExamMode } from '@/lib/types';

interface QuizSessionProps {
  category: string;
  topic?: 'mixed' | 'easy' | 'medium' | 'hard';
  mode?: ExamMode;
  initialLevel?: Difficulty;
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
  mode = 'practice',
  initialLevel = 'preliminary',
  timerMinutes = 0,
  onComplete,
}: QuizSessionProps) {
  const [phase, setPhase] = useState<Phase>('question');
  const [currentQuestion, setCurrentQuestion] = useState<McqQuestion | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialLevel);
  const fixedDifficulty = mode === 'mock-exam' ? initialLevel : (topic !== 'mixed' ? topic : undefined);
  
  const [examLocked, setExamLocked] = useState(false);
  const [lockWarnings, setLockWarnings] = useState(0);
  
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

  // Exam Locking logic
  useEffect(() => {
    if (mode === 'practice') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setLockWarnings((prev) => prev + 1);
        setExamLocked(true);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [mode]);

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
    preliminary: { correct: 0, total: 0 },
    mains: { correct: 0, total: 0 },
    advanced: { correct: 0, total: 0 },
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
    fetchQuestion(initialLevel, []);
  }, [fetchQuestion, initialLevel]);

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

  const handleNext = async (wasCorrectOverride?: boolean) => {
    setLastAnswer(null);
    setPhase('question');
    setQuestionCount((c) => c + 1);
    
    const isCorrect = wasCorrectOverride ?? lastAnswer?.correct ?? false;

    try {
      const res = await fetch('/api/next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          currentDifficulty: difficulty,
          wasCorrect: isCorrect,
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

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
    
    if (mode === 'mock-exam') {
      handleNext(correct);
    } else {
      setPhase('result');
    }
  };

  if (loading || !currentQuestion) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-primary-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-primary-400 animate-pulse" />
        </div>
        <h3 className="mt-8 text-2xl font-bold text-white tracking-tight">AI is crafting your exam...</h3>
        <p className="mt-2 text-slate-400 max-w-xs mx-auto">
          Generating a live, syllabus-accurate question for <span className="text-primary-400 font-semibold">{category}</span>
        </p>
      </div>
    );
  }

  if (error && !currentQuestion) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center max-w-md mx-auto animate-fade-in">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400 mb-4">
          <X className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
        <p className="text-red-300/80 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 border-red-400">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {examLocked && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 text-center animate-fade-in">
          <div className="max-w-md space-y-6">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 shadow-glow-red animate-bounce">
              <Shield className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Exam Session Locked</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Detection: Window/Tab switch identified. To maintain integrity, this session has been paused.
              <br />
              <span className="text-red-400 font-bold mt-2 inline-block">Warning {lockWarnings}/3</span>
            </p>
            <button
              onClick={() => setExamLocked(false)}
              className="btn-primary w-full py-4 rounded-2xl bg-red-500 hover:bg-red-600 border-red-400"
            >
              Resume Examination
            </button>
          </div>
        </div>
      )}

      {phase === 'result' && lastAnswer ? (
        <QuizResult
          question={currentQuestion}
          selectedIndex={lastAnswer.selectedIndex}
          correct={lastAnswer.correct}
          onNext={() => handleNext()}
        />
      ) : (
        <QuizQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          questionNumber={questionCount + 1}
          totalQuestions={mode === 'mock-exam' ? 30 : 0}
          secondsLeft={secondsRemaining}
        />
      )}
    </div>
  );
}
