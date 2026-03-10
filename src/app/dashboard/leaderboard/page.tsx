'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Star, Target, TrendingUp, Users, Loader2, ArrowLeft } from 'lucide-react';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/user-stats';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(20).then((data) => {
      setLeaderboard(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="bg-scene" />
      <div className="bg-grid" />
      <Navbar />

      <main className="container-max py-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="animate-fade-in-up">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Dashboard
            </Link>
            <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Global <span className="gradient-text">Hall of Fame</span>
              <Trophy className="h-8 w-8 text-amber-400 animate-bounce" />
            </h1>
            <p className="mt-2 text-slate-400 max-w-xl text-lg">
              Compete with the world's brightest minds. Your rank is based on your total correct answers.
            </p>
          </div>
          
          <div className="flex gap-4 animate-fade-in-up delay-100">
            <div className="glass-card px-6 py-4 rounded-3xl flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{leaderboard.length}+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Active Players</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="grid gap-10">
            {/* Top 3 Podium */}
            <div className="grid md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto w-full">
              {/* Silver - Rank 2 */}
              {leaderboard[1] && (
                <div className="order-2 md:order-1 animate-fade-in-up delay-200">
                  <PodiumCard entry={leaderboard[1]} rank={2} color="slate-400" />
                </div>
              )}
              
              {/* Gold - Rank 1 */}
              {leaderboard[0] && (
                <div className="order-1 md:order-2 animate-fade-in-up">
                  <PodiumCard entry={leaderboard[0]} rank={1} color="amber-400" isMain />
                </div>
              )}

              {/* Bronze - Rank 3 */}
              {leaderboard[2] && (
                <div className="order-3 md:order-3 animate-fade-in-up delay-300">
                  <PodiumCard entry={leaderboard[2]} rank={3} color="orange-400" />
                </div>
              )}
            </div>

            {/* Rest of the List */}
            <div className="glass-card rounded-[2.5rem] overflow-hidden animate-fade-in-up delay-400">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-white/3 border-b border-white/8 text-slate-400 text-xs uppercase tracking-widest font-bold">
                      <th className="px-8 py-6 text-left w-20">Rank</th>
                      <th className="px-6 py-6 text-left">Learner</th>
                      <th className="px-6 py-6 text-right">Accuracy</th>
                      <th className="px-6 py-6 text-right">Correct</th>
                      <th className="px-8 py-6 text-right w-32">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leaderboard.slice(3).map((user, idx) => (
                      <tr key={user.id} className="group hover:bg-white/2 transition-colors">
                        <td className="px-8 py-5">
                          <span className="text-lg font-bold text-slate-500 group-hover:text-white transition-colors font-mono">
                            #{(idx + 4).toString().padStart(2, '0')}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                              {user.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-white text-base">{user.name}</p>
                              <p className="text-xs text-slate-500">Global Scholar</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`badge-${user.accuracy > 80 ? 'green' : 'cyan'}`}>
                            {user.accuracy}%
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-white italic">
                          {user.correctAnswers}
                        </td>
                        <td className="px-8 py-5 text-right text-slate-400 text-sm">
                          {user.totalQuestions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {leaderboard.length === 0 && (
                <div className="p-20 text-center text-slate-500">
                   No explorers have been ranked yet. Be the first!
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PodiumCard({ entry, rank, color, isMain = false }: { entry: LeaderboardEntry; rank: number; color: string; isMain?: boolean }) {
  const rankColors: Record<number, string> = {
    1: 'from-amber-400 to-yellow-600 shadow-glow-amber',
    2: 'from-slate-300 to-slate-500 shadow-glow',
    3: 'from-orange-500 to-amber-700 shadow-glow'
  };

  return (
    <div className={`relative group ${isMain ? 'mb-8 scale-110' : ''}`}>
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${rankColors[rank]} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl`} />
      <div className={`glass-card rounded-3xl p-6 text-center border ${isMain ? 'border-amber-400/40' : 'border-white/10'} relative z-10 overflow-hidden`}>
        {isMain && <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />}
        
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl mx-auto mb-4 bg-gradient-to-br ${rankColors[rank]} text-white shadow-xl`}>
          {rank === 1 ? <Trophy className="h-7 w-7" /> : <Medal className="h-7 w-7" />}
        </div>
        
        <h3 className="text-xl font-extrabold text-white truncate px-2">{entry.name}</h3>
        <p className={`text-sm font-bold mt-1 tracking-widest uppercase text-${color}`}>Rank #{rank}</p>
        
        <div className="mt-6 pt-6 border-t border-white/8 grid grid-cols-2 gap-2">
          <div>
            <p className="text-lg font-bold text-white italic">{entry.correctAnswers}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Solved</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{entry.accuracy}%</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
