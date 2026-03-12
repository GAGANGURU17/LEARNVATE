import type { Difficulty } from './types';
import { getFirebaseFirestore } from './firebase';
import { doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export interface SessionEntry {
  id: string;
  category: string;
  correct: number;
  total: number;
  difficulty: Difficulty;
  timestamp: number;
}

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  sessionsCompleted: number;
  byCategory: Record<string, { correct: number; total: number }>;
  byDifficulty: Record<Difficulty, { correct: number; total: number }>;
  history: SessionEntry[];
  lastActive: number;
}

const STATS_KEY = 'learnvate_user_stats';

function getEmptyStats(): UserStats {
  return {
    totalQuestions: 0,
    correctAnswers: 0,
    sessionsCompleted: 0,
    byCategory: {},
    byDifficulty: {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 },
      preliminary: { correct: 0, total: 0 },
      mains: { correct: 0, total: 0 },
      advanced: { correct: 0, total: 0 },
    },
    history: [],
    lastActive: 0,
  };
}

function getStoredStatsLocal(): UserStats {
  if (typeof window === 'undefined') return getEmptyStats();
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) return { ...getEmptyStats(), ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return getEmptyStats();
}

export async function getStoredStats(userId: string | null): Promise<UserStats> {
  if (userId) {
    const db = getFirebaseFirestore();
    if (db) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists() && userDoc.data()?.stats) {
          return { ...getEmptyStats(), ...userDoc.data().stats } as UserStats;
        }
      } catch {
        // fallback to local
      }
    }
  }
  return getStoredStatsLocal();
}

export function getStoredStatsSync(): UserStats {
  return getStoredStatsLocal();
}

function saveStatsLocal(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export async function saveStats(userId: string | null, stats: UserStats): Promise<void> {
  if (userId) {
    const db = getFirebaseFirestore();
    if (db) {
      try {
        await setDoc(doc(db, 'users', userId), { stats, updatedAt: Date.now() }, { merge: true });
        return;
      } catch {
        // fallback to local
      }
    }
  }
  saveStatsLocal(stats);
}

export async function updateStatsFromSession(
  userId: string | null,
  category: string,
  correct: number,
  total: number,
  byDifficulty: Record<Difficulty, { correct: number; total: number }>
): Promise<UserStats> {
  const stats = userId ? await getStoredStats(userId) : getStoredStatsLocal();

  stats.totalQuestions += total;
  stats.correctAnswers += correct;
  stats.sessionsCompleted += 1;
  stats.lastActive = Date.now();

  if (!stats.byCategory[category]) {
    stats.byCategory[category] = { correct: 0, total: 0 };
  }
  stats.byCategory[category].correct += correct;
  stats.byCategory[category].total += total;

  (['easy', 'medium', 'hard', 'preliminary', 'mains', 'advanced'] as Difficulty[]).forEach((d) => {
    if (byDifficulty[d]) {
      stats.byDifficulty[d].correct += byDifficulty[d].correct;
      stats.byDifficulty[d].total += byDifficulty[d].total;
    }
  });

  stats.history = [
    {
      id: Math.random().toString(36).substring(2, 9),
      category,
      correct,
      total,
      difficulty: (Object.entries(byDifficulty).sort((a,b) => b[1].total - a[1].total)[0]?.[0] as Difficulty) || 'preliminary',
      timestamp: Date.now(),
    },
    ...(stats.history || []),
  ].slice(0, 50);

  await saveStats(userId, stats);
  return stats;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export async function getLeaderboard(limitCount = 10): Promise<LeaderboardEntry[]> {
  const db = getFirebaseFirestore();
  if (!db) return [];

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('stats.correctAnswers', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const stats = data.stats || {};
      const total = stats.totalQuestions || 0;
      const correct = stats.correctAnswers || 0;
      return {
        id: doc.id,
        name: data.name || 'Anonymous',
        totalQuestions: total,
        correctAnswers: correct,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}
