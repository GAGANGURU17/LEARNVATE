export type Difficulty = 'easy' | 'medium' | 'hard';

export interface McqQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: Difficulty;
  explanation?: string;
}

export interface AnswerResult {
  questionId: string;
  correct: boolean;
  selectedIndex: number;
  timeSpentMs: number;
}

export interface SessionState {
  sessionId: string;
  category: string;
  currentDifficulty: Difficulty;
  answers: AnswerResult[];
  streak: number;
  startTime: number;
}

export interface ProgressStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTimeMs: number;
  byDifficulty: Record<Difficulty, { correct: number; total: number }>;
}
