'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredStats } from '@/lib/user-stats';
import type { UserStats } from '@/lib/user-stats';

export default function StatsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    getStoredStats(user?.id ?? null).then(setStats);
  }, [user?.id]);

  if (!stats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  const accuracy =
    stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;

  const categories = Object.entries(stats.byCategory).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Your statistics</h1>
        <p className="mt-1 text-slate-600">
          Track your progress across categories and difficulty levels
        </p>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2 text-slate-600">
            <BarChart3 className="h-5 w-5" />
            <span className="text-sm font-medium">Total questions</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalQuestions}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2 text-slate-600">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Accuracy</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-primary-600">{accuracy}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="text-sm font-medium text-slate-600">Sessions</span>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.sessionsCompleted}</p>
        </div>
      </div>

      {/* By category */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">By category</h2>
        {categories.length > 0 ? (
          <div className="mt-4 space-y-4">
            {categories.map(([cat, data]) => {
              const catAccuracy =
                data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-800">{cat}</span>
                    <span className="text-slate-600">
                      {data.correct}/{data.total} ({catAccuracy}%)
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: `${catAccuracy}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-slate-500">Complete quizzes to see category stats.</p>
        )}
      </div>

      {/* By difficulty */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">By difficulty</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {(['easy', 'medium', 'hard'] as const).map((d) => {
            const dStats = stats.byDifficulty[d];
            const dAccuracy =
              dStats.total > 0 ? Math.round((dStats.correct / dStats.total) * 100) : 0;
            return (
              <div key={d} className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-medium capitalize text-slate-600">{d}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {dStats.correct}/{dStats.total}
                </p>
                <p className="text-sm text-primary-600">{dAccuracy}% accuracy</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
