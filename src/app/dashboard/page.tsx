'use client';

import Link from 'next/link';
import {
  BookOpen,
  TrendingUp,
  Award,
  ChevronRight,
  Zap,
  Sparkles,
  Trophy,
  Star,
  Brain,
  ArrowUpRight,
  Clock,
  Play,
  Target,
  BarChart3,
  Flame,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredStats } from '@/lib/user-stats';
import { QUESTION_CATEGORIES } from '@/lib/questions';
import { useEffect, useState } from 'react';
import type { UserStats } from '@/lib/user-stats';

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; emoji: string }> = {
  Mathematics:  { color: 'text-primary-400',  bg: 'bg-primary-500/15',  emoji: '🔢' },
  Science:      { color: 'text-cyan-400',      bg: 'bg-cyan-500/15',      emoji: '🔬' },
  History:      { color: 'text-amber-400',     bg: 'bg-amber-500/15',     emoji: '📜' },
  Geography:    { color: 'text-rose-400',      bg: 'bg-rose-500/15',      emoji: '🌍' },
  Literature:   { color: 'text-violet-400',    bg: 'bg-violet-500/15',    emoji: '📚' },
  Technology:   { color: 'text-indigo-400',    bg: 'bg-indigo-500/15',    emoji: '💻' },
};

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  orbColor,
  delay = '',
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  orbColor: string;
  delay?: string;
}) {
  return (
    <div className={`stat-card rounded-2xl animate-fade-in-up ${delay}`} style={{ color: 'transparent' }}>
      {/* Top gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl ${gradient}`} />
      {/* Glow orb */}
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${orbColor} blur-2xl opacity-20`} />
      <div className="relative">
        <div className={`inline-flex rounded-xl p-2.5 ${gradient} bg-opacity-10`}>
          <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
        </div>
        <p className="mt-4 text-3xl font-extrabold text-white">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    getStoredStats(user?.id ?? null).then(setStats);
  }, [user?.id]);

  const accuracy =
    stats && stats.totalQuestions > 0
      ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
      : 0;

  const topCategory =
    stats && Object.keys(stats.byCategory).length > 0
      ? Object.entries(stats.byCategory).sort(
          (a, b) => b[1].correct / (b[1].total || 1) - a[1].correct / (a[1].total || 1)
        )[0]
      : null;

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] ?? 'Learner'}</span>! 👋
            </h1>
            <p className="mt-1.5 text-slate-400">
              Continue your learning journey. Your progress is saved.
            </p>
          </div>
          <Link
            href="/dashboard/learn"
            className="btn-primary w-fit text-sm px-5 py-2.5"
          >
            <Play className="h-4 w-4" />
            Start Quiz
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Questions Answered"
          value={stats?.totalQuestions ?? 0}
          icon={BookOpen}
          gradient="bg-gradient-to-br from-cyan-400 to-primary-600"
          orbColor="bg-cyan-400"
          delay="delay-100"
        />
        <StatCard
          label="Correct Answers"
          value={stats?.correctAnswers ?? 0}
          icon={Target}
          gradient="bg-gradient-to-br from-primary-400 to-emerald-600"
          orbColor="bg-primary-400"
          delay="delay-200"
        />
        <StatCard
          label="Accuracy Rate"
          value={`${accuracy}%`}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-violet-400 to-indigo-600"
          orbColor="bg-violet-400"
          delay="delay-300"
        />
        <StatCard
          label="Sessions Completed"
          value={stats?.sessionsCompleted ?? 0}
          icon={Award}
          gradient="bg-gradient-to-br from-amber-400 to-rose-500"
          orbColor="bg-amber-400"
          delay="delay-400"
        />
      </div>

      {/* Quick actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Start learning */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group animate-fade-in-up delay-100">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-500 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-cyan-600 text-white shadow-glow">
                <Sparkles className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <span className="badge-green">Active</span>
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">Start Learning</h2>
            <p className="mt-2 text-slate-400 text-sm leading-relaxed">
              Pick a category and begin your adaptive quiz. AI adjusts difficulty to your level.
            </p>
            <Link
              href="/dashboard/learn"
              className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors group/link"
            >
              Choose category
              <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Progress */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group animate-fade-in-up delay-200">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-600 text-white shadow-glow-violet">
                <BarChart3 className="h-6 w-6" strokeWidth={1.8} />
              </div>
              {accuracy > 0 && (
                <span className="badge-violet">{accuracy}% avg</span>
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">Your Progress</h2>
            {topCategory ? (
              <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                Strongest in{' '}
                <span className="text-white font-semibold">{topCategory[0]}</span> with{' '}
                <span className="text-violet-400 font-semibold">
                  {Math.round((topCategory[1].correct / topCategory[1].total) * 100)}%
                </span>{' '}
                accuracy.
              </p>
            ) : (
              <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                Complete a quiz to see your category breakdown and performance insights.
              </p>
            )}
            <Link
              href="/dashboard/stats"
              className="mt-5 flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors group/link"
            >
              View statistics
              <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group animate-fade-in-up delay-300">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-glow-amber">
                <Trophy className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <span className="badge-amber">Competitive</span>
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">Global Ranking</h2>
            <p className="mt-2 text-slate-400 text-sm leading-relaxed">
              See how you stack up against the best learners globally. Compete for the top spot.
            </p>
            <Link
              href="/dashboard/leaderboard"
              className="mt-5 flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group/link"
            >
              Check ranking
              <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="glass-card rounded-3xl p-6 animate-fade-in-up delay-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Practice Categories</h2>
            <p className="mt-0.5 text-slate-400 text-sm">6 subjects to master</p>
          </div>
          <Trophy className="h-5 w-5 text-amber-400" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUESTION_CATEGORIES.slice(0, 6).map((cat, i) => {
            const slug = cat.toLowerCase().replace(/\s+/g, '-');
            const catStats = stats?.byCategory[cat];
            const catAccuracy =
              catStats && catStats.total > 0
                ? Math.round((catStats.correct / catStats.total) * 100)
                : null;
            const config = CATEGORY_CONFIG[cat] ?? { color: 'text-slate-400', bg: 'bg-white/5', emoji: '📖' };

            return (
              <Link
                key={cat}
                href={`/quiz/${slug}`}
                className={`flex items-center justify-between rounded-2xl ${config.bg} border border-white/6 px-4 py-3.5 transition-all duration-200 hover:border-white/15 hover:scale-[1.02] group animate-fade-in-up`}
                style={{ animationDelay: `${300 + i * 80}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{config.emoji}</span>
                  <span className={`font-semibold text-sm ${config.color}`}>{cat}</span>
                </div>
                {catAccuracy !== null ? (
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    <span className={`text-sm font-bold ${config.color}`}>{catAccuracy}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-slate-600 group-hover:text-slate-400 transition-colors">
                    <Zap className="h-3.5 w-3.5" />
                    <span className="text-xs">Start</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
