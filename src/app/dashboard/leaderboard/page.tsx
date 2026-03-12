'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Star, Target, TrendingUp, Users, Loader2, ArrowLeft, Crown } from 'lucide-react';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/user-stats';
import Link from 'next/link';

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
    <div className="max-w-[1400px] mx-auto space-y-12 reveal-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="reveal-up">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-saffron-600 transition-colors mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-igreen-500">Elite</span> Hall
            <Crown className="h-8 w-8 text-saffron-500 animate-bounce-soft" />
          </h1>
          <p className="mt-2 text-slate-500 max-w-xl text-lg">
            Compete with the world&apos;s brightest minds. Your rank is based on total points.
          </p>
        </div>
        
        <div className="flex gap-4 reveal-up delay-100">
          <div className="edu-glass px-8 py-5 rounded-[2rem] flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="h-12 w-12 rounded-2xl bg-igreen-50 flex items-center justify-center text-igreen-600 shadow-inner">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">{leaderboard.length}+</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">Active Scholars</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-saffron-500" />
        </div>
      ) : (
        <div className="grid gap-16">
          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto w-full px-4">
            {/* Silver - Rank 2 */}
            {leaderboard[1] && (
              <div className="order-2 md:order-1 animate-fade-in-up delay-200">
                <PodiumCard entry={leaderboard[1]} rank={2} color="text-slate-500" />
              </div>
            )}
            
            {/* Gold - Rank 1 */}
            {leaderboard[0] && (
              <div className="order-1 md:order-2 animate-fade-in-up">
                <PodiumCard entry={leaderboard[0]} rank={1} color="text-saffron-600" isMain />
              </div>
            )}

            {/* Bronze - Rank 3 */}
            {leaderboard[2] && (
              <div className="order-3 md:order-3 animate-fade-in-up delay-300">
                <PodiumCard entry={leaderboard[2]} rank={3} color="text-navy-600" />
              </div>
            )}
          </div>

          {/* Rest of the List */}
          <div className="edu-glass rounded-[3rem] overflow-hidden reveal-up delay-400 shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-gray-100">
                    <th className="px-10 py-6 text-left w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                    <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Scholar</th>
                    <th className="px-6 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Stats</th>
                    <th className="px-6 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy</th>
                    <th className="px-10 py-6 text-right w-32 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leaderboard.slice(3).map((user, idx) => (
                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <span className="text-xl font-black text-slate-300 group-hover:text-navy-900 transition-colors">
                          #{(idx + 4).toString().padStart(2, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 font-black text-lg shadow-sm">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-lg">{user.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Scholar Candidate</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="inline-flex flex-col items-center">
                           <span className="text-lg font-black text-slate-900">{user.correctAnswers * 10}</span>
                           <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Points</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-igreen-50 text-igreen-600 text-[10px] font-black border border-igreen-100">
                          {user.accuracy}% ACCURACY
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <div className="flex items-center justify-end gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-igreen-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified</span>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {leaderboard.length === 0 && (
              <div className="p-24 text-center">
                 <Trophy className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                 <p className="text-slate-400 font-bold italic">The Hall is empty. Claim your spot!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PodiumCard({ entry, rank, color, isMain = false }: { entry: LeaderboardEntry; rank: number; color: string; isMain?: boolean }) {
  const rankConfigs: Record<number, any> = {
    1: { grad: 'from-saffron-400 to-saffron-600', shadow: 'shadow-glow-saffron', icon: Crown },
    2: { grad: 'from-slate-400 to-slate-500', shadow: 'shadow-md', icon: Medal },
    3: { grad: 'from-navy-400 to-navy-600', shadow: 'shadow-md', icon: Target },
  };

  const config = rankConfigs[rank];

  return (
    <div className={`relative group ${isMain ? 'scale-110 -translate-y-6' : ''}`}>
      <div className={`edu-glass rounded-[2.5rem] p-8 text-center border-2 ${isMain ? 'border-saffron-100 ' + config.shadow : 'border-gray-50'} relative z-10 overflow-hidden hover:shadow-xl transition-all duration-500`}>
        {isMain && (
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-saffron-400 to-transparent" />
        )}
        
        <div className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] mx-auto mb-6 bg-gradient-to-br ${config.grad} text-white shadow-lg`}>
          <config.icon className="h-8 w-8" />
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 truncate mb-1">{entry.name}</h3>
        <p className={`text-xs font-black tracking-widest uppercase ${color}`}>RANK #{rank}</p>
        
        <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-black text-slate-900">{entry.correctAnswers * 10}</p>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Points</p>
          </div>
          <div>
            <p className="text-2xl font-black text-igreen-600">{entry.accuracy}%</p>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Acc</p>
          </div>
        </div>
      </div>
      {/* Visual pedestal */}
      <div className={`absolute -bottom-4 inset-x-8 h-4 bg-slate-100 rounded-b-3xl -z-10 group-hover:h-6 transition-all duration-500`} />
    </div>
  );
}
