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
import { ExamSetupModal } from '@/components/ExamSetupModal';
import { useRouter } from 'next/navigation';
import { Difficulty, ExamMode } from '@/lib/types';
import { MetricWidget, PerformanceChart } from '@/components/DashboardCharts';
import { HistoryFilter } from '@/components/HistoryFilter';

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; emoji: string }> = {
  'UPSC (IAS/IPS)':        { color: 'text-saffron-700',   bg: 'bg-saffron-50',   emoji: '🏛️' },
  'GATE (Engineering)':    { color: 'text-navy-600',      bg: 'bg-navy-50',      emoji: '⚙️' },
  'SSC (CGL/CHSL)':        { color: 'text-igreen-700',    bg: 'bg-igreen-50',    emoji: '📊' },
  'Central Govt Exams':    { color: 'text-saffron-600',   bg: 'bg-saffron-50',   emoji: '🇮🇳' },
  'State Govt Exams':      { color: 'text-igreen-600',    bg: 'bg-igreen-50',    emoji: '🚩' },
  'University Entrances':  { color: 'text-navy-500',      bg: 'bg-navy-50',      emoji: '🎓' },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ category: 'All Categories', timeframe: 'All Time', search: '' });

  useEffect(() => {
    getStoredStats(user?.id ?? null).then(setStats);
  }, [user?.id]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleStartExam = (mode: ExamMode, level: Difficulty, timing: number, questionCount: number, topic: string) => {
    if (!selectedCategory) return;
    const slug = selectedCategory.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/\//g, '-');
    router.push(`/quiz/${slug}?mode=${mode}&level=${level}&timer=${timing}&count=${questionCount}&topic=${topic}`);
  };

  const accuracy =
    stats && stats.totalQuestions > 0
      ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
      : 0;

  const filteredHistory = (stats?.history || []).filter(session => {
    const matchesCategory = filters.category === 'All Categories' || session.category === filters.category;
    const matchesSearch = filters.search === '' || session.category.toLowerCase().includes(filters.search.toLowerCase());
    
    let matchesTime = true;
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    if (filters.timeframe === 'Today') matchesTime = now - session.timestamp < day;
    else if (filters.timeframe === 'Last 7 Days') matchesTime = now - session.timestamp < 7 * day;
    else if (filters.timeframe === 'This Month') matchesTime = now - session.timestamp < 30 * day;

    return matchesCategory && matchesSearch && matchesTime;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 reveal-up">
      {/* Premium Welcome Hero */}
      <div className="relative p-8 rounded-[2.5rem] bg-navy-900 overflow-hidden group shadow-2xl edu-glow reveal-up">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800/80 via-navy-900/40 to-slate-950/80 animate-pulse-slow" />
        {/* Abstract shapes */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-saffron-500/10 rounded-full blur-[80px] group-hover:bg-saffron-500/20 transition-all duration-1000" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-igreen-500/10 rounded-full blur-[100px] group-hover:bg-igreen-500/20 transition-all duration-1000" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-saffron-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Syllabus Powered by AI
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              Ready to crush your <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-igreen-400">Exams</span>, {user?.name?.split(' ')[0]}?
            </h1>
            <p className="mt-4 text-slate-400 text-lg leading-relaxed">
              You&apos;ve answered <span className="text-white font-bold">{stats?.totalQuestions ?? 0}</span> questions with <span className="text-white font-bold">{accuracy}%</span> accuracy. Your next milestone is 1000 points.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard/learn" className="btn-primary py-4 px-8 rounded-2xl text-base shadow-glow-saffron">
              <Play className="h-5 w-5 fill-current" />
              Start New Test
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Realistic Metric Dashboard */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricWidget
          label="Total Questions"
          value={stats?.totalQuestions ?? 0}
          change={12}
          icon={BookOpen}
          gradient="bg-gradient-to-br from-saffron-500 to-saffron-600"
          delay="delay-100"
        />
        <MetricWidget
          label="Accuracy"
          value={`${accuracy}%`}
          change={accuracy > 0 ? 5 : 0}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-igreen-500 to-igreen-600"
          delay="delay-200"
        />
        <MetricWidget
          label="Sessions"
          value={stats?.sessionsCompleted ?? 0}
          icon={Clock}
          gradient="bg-gradient-to-br from-navy-400 to-navy-600"
          delay="delay-300"
        />
        <div className="p-6 rounded-[2rem] border border-gray-100 shadow-sm reveal-up edu-glass delay-400">
          <PerformanceChart history={stats?.history || []} />
          <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Performance Trend</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed: Recent Activity with Filtering */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
            <Link href="/dashboard/stats" className="text-sm font-bold text-saffron-600 hover:text-saffron-700 flex items-center gap-1">
              Deep Analytics <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <HistoryFilter 
            categories={QUESTION_CATEGORIES as unknown as string[]} 
            onFilterChange={setFilters} 
          />

          <div className="space-y-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((session, i) => (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all reveal-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl grayscale-[0.5] group-hover:grayscale-0">
                      {CATEGORY_CONFIG[session.category]?.emoji || '📝'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{session.category}</h4>
                      <p className="text-xs text-slate-400 uppercase font-black tracking-widest">{session.difficulty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                       <span className="text-lg font-black text-slate-900">{session.correct}/{session.total}</span>
                       <div className="h-8 w-8 rounded-full border-2 border-igreen-100 flex items-center justify-center text-[10px] font-black text-igreen-600">
                         {Math.round((session.correct/session.total)*100)}%
                       </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(session.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
                <Brain className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No sessions found matching your filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Recommended & Insights */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-igreen-500 to-igreen-700 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-xl font-black mb-4">AI Study Insights</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                <p className="text-xs text-igreen-100 uppercase font-black tracking-tighter mb-1">Focus Area</p>
                <p className="text-sm font-bold">You&apos;re improving in Logic, but keep an eye on History facts.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                <p className="text-xs text-igreen-100 uppercase font-black tracking-tighter mb-1">Weekly Streak</p>
                <div className="flex items-center gap-1 mt-2">
                  {[0,1,2,3,4,5,6].map(d => (
                    <div key={d} className={`h-8 flex-1 rounded-lg ${d < 3 ? 'bg-saffron-400' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            </div>
            <Link href="/dashboard/leaderboard" className="mt-6 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white text-igreen-700 font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
              <Trophy className="h-4 w-4" />
              View Global Ranking
            </Link>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Quick Practice</h3>
            <div className="grid gap-3">
              {Object.entries(CATEGORY_CONFIG).slice(0, 4).map(([name, conf]) => (
                <button 
                  key={name}
                  onClick={() => handleCategoryClick(name)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                >
                  <span className="text-xl">{conf.emoji}</span>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-saffron-600 transition-colors">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ExamSetupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory || ''}
        onStart={handleStartExam}
      />
    </div>
  );
}
