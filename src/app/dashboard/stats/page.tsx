'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp, BookOpen, Target, Clock, Filter, Search, Download, Calendar, Flame, GraduationCap, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredStats } from '@/lib/user-stats';
import type { UserStats } from '@/lib/user-stats';
import { MetricWidget, PerformanceChart } from '@/components/DashboardCharts';
import { HistoryFilter } from '@/components/HistoryFilter';
import { QUESTION_CATEGORIES } from '@/lib/questions';

export default function StatsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filters, setFilters] = useState({ category: 'All Categories', timeframe: 'All Time', search: '' });

  useEffect(() => {
    getStoredStats(user?.id ?? null).then(setStats);
  }, [user?.id]);

  if (!stats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-saffron-500 border-t-transparent" />
      </div>
    );
  }

  const accuracy =
    stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;

  const categories = Object.entries(stats.byCategory).sort((a, b) => b[1].total - a[1].total);

  const filteredHistory = (stats.history || []).filter(session => {
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
    <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-saffron-600 transition-colors group mb-4"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Return to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Performance Analytics</h1>
          <p className="mt-2 text-slate-500 text-lg">Detailed breakdown of your learning journey & mastery.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold text-slate-600 hover:bg-gray-50 transition-all">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricWidget
          label="Total Questions"
          value={stats.totalQuestions}
          icon={BookOpen}
          gradient="bg-gradient-to-br from-saffron-500 to-saffron-600"
        />
        <MetricWidget
          label="Overall Accuracy"
          value={`${accuracy}%`}
          icon={Target}
          gradient="bg-gradient-to-br from-igreen-500 to-igreen-600"
        />
        <MetricWidget
          label="Mastery Points"
          value={stats.correctAnswers * 10}
          icon={GraduationCap}
          gradient="bg-gradient-to-br from-navy-400 to-navy-600"
        />
        <div className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm">
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Performance Trend</p>
           <PerformanceChart history={stats.history || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Category Mastery */}
         <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-saffron-500" />
                Category Breakdown
              </h2>
              {categories.length > 0 ? (
                <div className="grid gap-6">
                  {categories.map(([cat, data]) => {
                    const catAccuracy =
                      data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                    return (
                      <div key={cat} className="group">
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <span className="text-sm font-black text-slate-900 block">{cat}</span>
                            <span className="text-xs text-slate-400 uppercase tracking-tighter font-bold">{data.total} Questions Attempted</span>
                          </div>
                          <span className="text-lg font-black text-saffron-600">
                            {catAccuracy}%
                          </span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-50 border border-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-saffron-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left to-igreen-500"
                            style={{ width: `${catAccuracy}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center">
                   <p className="text-slate-400 italic">No category data yet. Start your first session!</p>
                </div>
              )}
            </div>

            {/* Session History Table */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Session History</h2>
                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <Filter className="h-3.5 w-3.5" />
                  Filter results
                </div>
              </div>

              <HistoryFilter 
                categories={QUESTION_CATEGORIES as unknown as string[]} 
                onFilterChange={setFilters} 
              />

              <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Difficulty</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((session) => (
                        <tr key={session.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900">{session.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                               {session.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                               <span className="font-black text-slate-900">{session.correct}/{session.total}</span>
                               <span className={`text-[10px] font-bold ${session.correct/session.total > 0.7 ? 'text-green-500' : 'text-saffron-500'}`}>
                                 ({Math.round((session.correct/session.total)*100)}%)
                               </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <span className="text-xs text-slate-500 font-medium">{new Date(session.timestamp).toLocaleDateString()}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No sessions matching filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-navy-950 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/10 rounded-full blur-3xl" />
               <h3 className="text-xl font-black mb-6">Difficulty Mastery</h3>
               <div className="space-y-6">
                 {(['preliminary', 'mains', 'advanced'] as const).map((d) => {
                    const dStats = stats.byDifficulty[d];
                    const dAccuracy = dStats.total > 0 ? Math.round((dStats.correct / dStats.total) * 100) : 0;
                    return (
                      <div key={d}>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-black uppercase tracking-widest text-slate-400">{d}</span>
                           <span className="text-sm font-bold text-white">{dAccuracy}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                           <div 
                             className="h-full bg-gradient-to-r from-saffron-500 to-saffron-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"
                             style={{ width: `${dAccuracy}%` }}
                           />
                        </div>
                      </div>
                    );
                 })}
               </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-igreen-50 border border-igreen-100 shadow-sm overflow-hidden group">
               <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-igreen-500 text-white flex items-center justify-center shadow-lg">
                    <Flame className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Learning Streak</h3>
               </div>
               <p className="text-slate-500 text-sm leading-relaxed mb-6">
                 You have been active for <span className="text-igreen-600 font-black">4 days</span> this week. Keep going to unlock the consistency badge!
               </p>
               <div className="flex justify-between gap-1">
                 {['S','M','T','W','T','F','S'].map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                       <div className={`h-10 w-full min-w-[32px] rounded-xl border-2 flex items-center justify-center transition-all duration-500 ${
                         i < 4 ? 'bg-igreen-500 border-igreen-600 text-white shadow-glow-green scale-110' : 'bg-white border-gray-100 text-slate-300'
                       }`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${i < 4 ? 'bg-white animate-pulse' : 'bg-transparent'}`} />
                       </div>
                       <span className="text-[10px] font-black text-slate-400 uppercase">{day}</span>
                    </div>
                 ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
