'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { QuizSession } from '@/components/QuizSession';
import { SessionSummary } from '@/components/SessionSummary';
import { Navbar } from '@/components/ui/Navbar';
import { QUESTION_CATEGORIES } from '@/lib/questions';
import { useAuth } from '@/contexts/AuthContext';
import { updateStatsFromSession } from '@/lib/user-stats';
import type { Difficulty, ExamMode } from '@/lib/types';

const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  QUESTION_CATEGORIES.map((c) => [
    c.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/\//g, '-'), 
    c
  ])
);

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const slug = typeof params.category === 'string' ? params.category : '';
  const category = SLUG_TO_CATEGORY[slug] ?? slug;
  const topic = (searchParams.get('topic') as 'mixed' | 'easy' | 'medium' | 'hard') ?? 'mixed';
  const paramMode = (searchParams.get('mode') as ExamMode) ?? 'practice';
  const paramLevel = (searchParams.get('level') as Difficulty) ?? 'preliminary';
  const timerParam = searchParams.get('timer');
  const timerMinutes = timerParam ? parseInt(timerParam, 10) : 0;
  const countParam = searchParams.get('count');
  const questionCount = countParam ? parseInt(countParam, 10) : 20;

  const [completed, setCompleted] = useState(false);
  const [sessionStats, setSessionStats] = useState<{
    total: number;
    correct: number;
    byDifficulty: Record<Difficulty, { correct: number; total: number }>;
    timeUp?: boolean;
  } | null>(null);
  const [isExamActive, setIsExamActive] = useState(false);

  if (!QUESTION_CATEGORIES.includes(category as (typeof QUESTION_CATEGORIES)[number])) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-slate-600">Category not found.</p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mt-4 text-saffron-600 hover:underline"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (completed && sessionStats) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-12 reveal-up">
          <SessionSummary
            total={sessionStats.total}
            correct={sessionStats.correct}
            timeUp={sessionStats.timeUp}
            onRestart={() => {
              setCompleted(false);
              setSessionStats(null);
            }}
            onHome={() => router.push(isAuthenticated ? '/dashboard' : '/')}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {!isExamActive && <Navbar />}
      {!isExamActive && (
        <main className="mx-auto max-w-2xl px-4 py-12 reveal-up">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">{category}</h1>
            <p className="mt-1 text-slate-600">
              Adaptive MCQ — difficulty adjusts to your performance
            </p>
          </div>
          <button 
            onClick={() => setIsExamActive(true)}
            className="btn-primary w-full py-6 rounded-3xl text-xl font-bold transition-all hover:scale-[1.02] shadow-xl"
          >
            Start {category} Examination
          </button>
        </main>
      )}

      {isExamActive && (
        <QuizSession
          category={category}
          topic={topic}
          mode={paramMode}
          initialLevel={paramLevel}
          timerMinutes={timerMinutes}
          maxQuestions={questionCount}
          onComplete={async (stats: any) => {
            setIsExamActive(false);
            if (isAuthenticated && user?.id) {
              await updateStatsFromSession(
                user.id,
                category,
                stats.correct,
                stats.total,
                stats.byDifficulty
              );
            }
            setSessionStats({
              total: stats.total,
              correct: stats.correct,
              byDifficulty: stats.byDifficulty,
              timeUp: stats.timeUp,
            });
            setCompleted(true);
          }}
        />
      )}
    </div>
  );
}
