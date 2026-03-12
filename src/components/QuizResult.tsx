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
    <div className="bg-white rounded-3xl p-7 animate-scale-in shadow-card border border-gray-100">
      {/* Result header */}
      <div
        className={`mb-6 flex items-center gap-3 rounded-2xl p-4 border ${
          correct
            ? 'bg-igreen-50 border-igreen-200 text-igreen-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${
            correct ? 'bg-igreen-500' : 'bg-red-500'
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
      <h2 className="mb-6 text-lg font-bold text-slate-900 leading-relaxed">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-2.5 mb-6">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctIndex;
          const isSelected = index === selectedIndex;
          const isWrongSelected = isSelected && !correct;

          let containerClass = 'border border-gray-200 bg-gray-50';
          let labelClass = 'bg-gray-200 text-slate-500';
          let textClass = 'text-slate-500';

          if (isCorrect) {
            containerClass = 'border border-igreen-300 bg-igreen-50';
            labelClass = 'bg-igreen-500 text-white';
            textClass = 'text-igreen-700 font-semibold';
          } else if (isWrongSelected) {
            containerClass = 'border border-red-300 bg-red-50';
            labelClass = 'bg-red-500 text-white';
            textClass = 'text-red-700';
          }

          return (
            <div key={index} className={`flex items-center gap-3 rounded-2xl border p-3.5 ${containerClass}`}>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${labelClass}`}>
                {OPTION_LABELS[index]}
              </span>
              <span className={`text-sm flex-1 ${textClass}`}>{option}</span>
              {isCorrect && (
                <Check className="h-4 w-4 text-igreen-500 shrink-0" strokeWidth={2.5} />
              )}
              {isWrongSelected && (
                <X className="h-4 w-4 text-red-500 shrink-0" strokeWidth={2.5} />
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <div className="mb-7 rounded-2xl bg-navy-50 border border-navy-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-navy-500" />
            <p className="text-sm font-semibold text-navy-600">Explanation</p>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{question.explanation}</p>
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
