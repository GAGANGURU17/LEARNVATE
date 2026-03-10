'use client';

import { useState } from 'react';
import { Clock, Zap, ChevronRight } from 'lucide-react';
import type { McqQuestion } from '@/lib/types';

interface QuizQuestionProps {
  question: McqQuestion;
  onAnswer: (selectedIndex: number, timeSpentMs: number) => void;
  questionNumber: number;
  totalQuestions: number;
  secondsLeft?: number | null;
  onTimeUp?: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

const DIFFICULTY_STYLES: Record<string, { badge: string; dot: string }> = {
  easy:   { badge: 'badge-green',  dot: 'bg-primary-400' },
  medium: { badge: 'badge-cyan',   dot: 'bg-cyan-400' },
  hard:   { badge: 'badge-rose',   dot: 'bg-rose-400' },
};

export function QuizQuestion({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
  secondsLeft = null,
}: QuizQuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [startTime] = useState(() => Date.now());

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    const timeSpentMs = Date.now() - startTime;
    onAnswer(selectedIndex, timeSpentMs);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const diffStyle = DIFFICULTY_STYLES[question.difficulty] ?? DIFFICULTY_STYLES.medium;
  const progress = (questionNumber / totalQuestions) * 100;
  const isUrgent = secondsLeft !== null && secondsLeft <= 60;

  return (
    <div className="glass-card rounded-3xl p-7 animate-scale-in">
      {/* Progress & meta bar */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 font-medium">
            Q<span className="text-white font-bold">{questionNumber}</span>
            <span className="text-slate-600">/{totalQuestions}</span>
          </span>
          {/* Progress bar */}
          <div className="h-1.5 w-24 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {secondsLeft !== null && (
            <span
              className={`flex items-center gap-1.5 rounded-2xl px-3 py-1 text-sm font-bold transition-all ${
                isUrgent
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                  : 'glass text-slate-300'
              }`}
            >
              <Clock className={`h-3.5 w-3.5 ${isUrgent ? 'text-rose-400' : 'text-slate-400'}`} />
              {formatTime(secondsLeft)}
            </span>
          )}
          <span className={`${diffStyle.badge} capitalize`}>
            <span className={`h-1.5 w-1.5 rounded-full ${diffStyle.dot}`} />
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Question text */}
      <h2 className="mb-7 text-xl font-bold text-white leading-relaxed">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-primary-500/60 bg-primary-500/15 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                  : 'border-white/8 glass hover:border-white/16 hover:bg-white/6'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/8 text-slate-400 group-hover:bg-white/12 group-hover:text-slate-200'
                  }`}
                >
                  {OPTION_LABELS[index]}
                </span>
                <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={selectedIndex === null}
        className="btn-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Zap className="h-5 w-5" />
        Submit Answer
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
