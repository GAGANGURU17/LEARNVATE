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
  easy:   { badge: 'badge-green',  dot: 'bg-igreen-500' },
  medium: { badge: 'badge-amber',  dot: 'bg-saffron-500' },
  hard:   { badge: 'badge-rose',   dot: 'bg-red-500' },
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
    <div className="bg-white rounded-3xl p-8 animate-scale-in shadow-xl border border-gray-100 max-w-4xl mx-auto">
      {/* Question meta */}
      <div className="mb-6 flex justify-between items-center">
        <span className={`${diffStyle.badge} capitalize`}>
          <span className={`h-1.5 w-1.5 rounded-full ${diffStyle.dot}`} />
          {question.difficulty}
        </span>
      </div>

      {/* Question text */}
      <h2 className="mb-7 text-xl font-bold text-slate-900 leading-relaxed">
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
                  ? 'border-saffron-400 bg-saffron-50 shadow-sm'
                  : 'border-gray-200 bg-gray-50 hover:border-saffron-200 hover:bg-saffron-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-saffron-500 text-white'
                      : 'bg-gray-200 text-slate-500 group-hover:bg-saffron-200 group-hover:text-saffron-700'
                  }`}
                >
                  {OPTION_LABELS[index]}
                </span>
                <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
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
