import type { Difficulty } from './types';
import { getFirebaseFirestore } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  sessionsCompleted: number;
  byCategory: Record<string, { correct: number; total: number }>;
  byDifficulty: Record<Difficulty, { correct: number; total: number }>;
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
    },
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

  (['easy', 'medium', 'hard'] as Difficulty[]).forEach((d) => {
    stats.byDifficulty[d].correct += byDifficulty[d].correct;
    stats.byDifficulty[d].total += byDifficulty[d].total;
  });

  await saveStats(userId, stats);
  return stats;
}
