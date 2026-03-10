'use client';

import type { McqQuestion } from '@/lib/types';
import { Check, X, ArrowRight, Lightbulb } from 'lucide-react';

interface QuizResultProps {
  question: McqQuestion;
  selectedIndex: number;
  correct: boolean;
  onNext: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

export function QuizResult({ question, selectedIndex, correct, onNext }: QuizResultProps) {
  return (
    <div className="glass-card rounded-3xl p-7 animate-scale-in">
      {/* Result header */}
      <div
        className={`mb-6 flex items-center gap-3 rounded-2xl p-4 border ${
          correct
            ? 'bg-primary-500/12 border-primary-500/25 text-primary-300'
            : 'bg-rose-500/12 border-rose-500/25 text-rose-300'
        }`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${
            correct ? 'bg-primary-500' : 'bg-rose-500'
          }`}
        >
          {correct ? <Check className="h-5 w-5" strokeWidth={2.5} /> : <X className="h-5 w-5" strokeWidth={2.5} />}
        </span>
        <div>
          <p className="font-bold">{correct ? '🎉 Correct!' : '😕 Incorrect'}</p>
          <p className="text-xs opacity-75">
            {correct ? 'Great job! Moving to a harder question.' : 'Keep practicing — you\'ll get it!'}
          </p>
        </div>
      </div>

      {/* Question text */}
      <h2 className="mb-6 text-lg font-bold text-white leading-relaxed">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-2.5 mb-6">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctIndex;
          const isSelected = index === selectedIndex;
          const isWrongSelected = isSelected && !correct;

          let containerClass = 'border border-white/6 bg-white/3';
          let labelClass = 'bg-white/8 text-slate-400';
          let textClass = 'text-slate-400';

          if (isCorrect) {
            containerClass = 'border border-primary-500/40 bg-primary-500/12';
            labelClass = 'bg-primary-500 text-white';
            textClass = 'text-primary-300 font-semibold';
          } else if (isWrongSelected) {
            containerClass = 'border border-rose-500/40 bg-rose-500/12';
            labelClass = 'bg-rose-500 text-white';
            textClass = 'text-rose-300';
          }

          return (
            <div key={index} className={`flex items-center gap-3 rounded-2xl border p-3.5 ${containerClass}`}>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${labelClass}`}>
                {OPTION_LABELS[index]}
              </span>
              <span className={`text-sm flex-1 ${textClass}`}>{option}</span>
              {isCorrect && (
                <Check className="h-4 w-4 text-primary-400 shrink-0" strokeWidth={2.5} />
              )}
              {isWrongSelected && (
                <X className="h-4 w-4 text-rose-400 shrink-0" strokeWidth={2.5} />
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <div className="mb-7 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-cyan-400" />
            <p className="text-sm font-semibold text-cyan-400">Explanation</p>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        className="btn-primary w-full py-3.5 text-base"
      >
        Next Question
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}
