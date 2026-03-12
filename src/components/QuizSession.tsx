'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  maxQuestions?: number;
}

type Phase = 'question' | 'result';

export function QuizSession({
  category,
  topic = 'mixed',
  mode = 'practice',
  initialLevel = 'preliminary',
  timerMinutes = 0,
  onComplete,
  maxQuestions = 20,
}: QuizSessionProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('question');
  const [currentQuestion, setCurrentQuestion] = useState<McqQuestion | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialLevel);
  const fixedDifficulty = mode === 'mock-exam' ? initialLevel : (topic !== 'mixed' ? topic : undefined);
  
  const [examLocked, setExamLocked] = useState(false);
  const [lockWarnings, setLockWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
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

  // Fullscreen management
  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        setExamLocked(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Exit Exam
  const handleExitExam = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    router.push('/dashboard');
  }, [router]);

  // Exam Locking logic
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull && mode !== 'practice' && phase === 'question') {
        setExamLocked(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && mode !== 'practice' && phase === 'question') {
        setLockWarnings((prev) => prev + 1);
        setExamLocked(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Request fullscreen on mount if not practice
    if (mode !== 'practice') {
      enterFullscreen().catch(console.error);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mode, enterFullscreen, phase]);

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
  }, [secondsRemaining, onComplete, questionCount, stats, totalSeconds]);

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
        if (res.status === 404 && data.error === 'No more questions available' || (maxQuestions > 0 && questionCount + 1 >= maxQuestions)) {
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

  if (error && !currentQuestion) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center max-w-md mx-auto animate-fade-in">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-500 mb-4">
          <X className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary w-full py-3 rounded-xl">
          Retry Connection
        </button>
      </div>
    );
  }

  if (loading || !currentQuestion) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-saffron-200" />
          <div className="absolute inset-0 rounded-full border-4 border-saffron-500 border-t-transparent animate-spin" />
          <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-saffron-500 animate-pulse" />
        </div>
        <h3 className="mt-8 text-2xl font-bold text-slate-900 tracking-tight">AI is crafting your exam...</h3>
        <p className="mt-2 text-slate-500 max-w-xs mx-auto">
          Generating a live, syllabus-accurate question for <span className="text-saffron-600 font-semibold">{category}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Assessment Header */}
      <header className="sticky top-0 z-[80] w-full bg-white border-b border-slate-200 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-saffron-500 to-igreen-500 flex items-center justify-center text-white shadow-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">{category}</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">Assessment Phase</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Progress</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700">{questionCount + 1}</span>
                <div className="h-1.5 w-32 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-saffron-500 transition-all duration-500" 
                    style={{ width: `${( (questionCount + 1) / maxQuestions ) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-400">{maxQuestions}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {secondsRemaining !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                secondsRemaining < 60 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-700'
              }`}>
                <Clock className="h-4 w-4" />
                <span className="text-lg font-mono font-bold">
                  {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
            <button
              onClick={handleExitExam}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 transition-all text-sm border border-slate-200"
            >
              Exit Assessment
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12 relative">
        {examLocked && (
          <div className="fixed inset-0 z-[110] bg-white/95 backdrop-blur-xl flex items-center justify-center p-6 text-center animate-fade-in">
            <div className="max-w-md space-y-6">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-red-50 text-red-500 border-2 border-red-100 animate-bounce shadow-inner">
                <Shield className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Security Protocol Violation</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Window switching detected. To maintain assessment integrity, your session has been synchronized and paused.
                <br />
                <span className="text-red-600 font-black mt-4 inline-block px-4 py-1 bg-red-50 rounded-full border border-red-100">Attempt {lockWarnings}/3</span>
              </p>
              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={enterFullscreen}
                  className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-lg"
                >
                  <Sparkles className="h-5 w-5" />
                  Restore Integrity & Resume
                </button>
                <button
                  onClick={handleExitExam}
                  className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Terminate Session
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === 'result' && lastAnswer ? (
          <div className="max-w-4xl mx-auto">
            <QuizResult
              question={currentQuestion}
              selectedIndex={lastAnswer.selectedIndex}
              correct={lastAnswer.correct}
              onNext={() => handleNext()}
            />
          </div>
        ) : (
          <QuizQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={questionCount + 1}
            totalQuestions={maxQuestions}
            secondsLeft={secondsRemaining}
          />
        )}
      </main>
    </div>
  );
}
