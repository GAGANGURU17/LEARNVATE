'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Play, Clock, BookOpen } from 'lucide-react';
import { TOPIC_OPTIONS, TIMER_OPTIONS } from '@/lib/exam-options';

interface ExamSetupModalProps {
  category: string;
  categorySlug: string;
  onClose: () => void;
}

export function ExamSetupModal({ category, categorySlug, onClose }: ExamSetupModalProps) {
  const router = useRouter();
  const [topic, setTopic] = useState<string>('mixed');
  const [timer, setTimer] = useState<number>(0);

  const handleStart = () => {
    const params = new URLSearchParams();
    if (topic !== 'mixed') params.set('topic', topic);
    if (timer > 0) params.set('timer', String(timer));
    const query = params.toString();
    router.push(`/quiz/${categorySlug}${query ? `?${query}` : ''}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close"
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Exam Setup — {category}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <BookOpen className="h-4 w-4 text-primary-600" />
              Select topic
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {TOPIC_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTopic(opt.value)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    topic === opt.value
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/30'
                      : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-medium text-slate-800">{opt.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Clock className="h-4 w-4 text-primary-600" />
              Set timer
            </h3>
            <div className="flex flex-wrap gap-2">
              {TIMER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTimer(opt.value)}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                    timer === opt.value
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 py-3 font-semibold text-white shadow-lg transition-all hover:from-primary-600 hover:to-primary-700"
        >
          <Play className="h-5 w-5" />
          Start Exam
        </button>
      </div>
    </div>
  );
}
