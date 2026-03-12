'use client';

import { useState } from 'react';
import { ChevronRight, BookOpen, Clock, Zap } from 'lucide-react';
import { ExamSetupModal } from './ExamSetupModal';
import { useRouter } from 'next/navigation';
import { Difficulty, ExamMode } from '@/lib/types';

interface CategoryCardProps {
  category: string;
  description?: string;
  questionCount?: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  Mathematics: '🔢',
  Science: '🔬',
  History: '📜',
  Geography: '🌍',
  English: '📚',
  Literature: '📖',
  Technology: '💻',
  'General Knowledge': '💡',
};

const CATEGORY_COLORS: Record<string, { border: string; iconBg: string; badge: string }> = {
  Mathematics:       { border: 'border-l-saffron-500', iconBg: 'bg-gradient-to-br from-saffron-500 to-saffron-600',   badge: 'badge-amber' },
  Science:           { border: 'border-l-navy-500',    iconBg: 'bg-gradient-to-br from-navy-400 to-navy-600',       badge: 'badge-cyan' },
  History:           { border: 'border-l-saffron-600', iconBg: 'bg-gradient-to-br from-saffron-500 to-saffron-700', badge: 'badge-rose' },
  Geography:         { border: 'border-l-igreen-500',  iconBg: 'bg-gradient-to-br from-igreen-500 to-igreen-600',  badge: 'badge-green' },
  English:           { border: 'border-l-navy-400',    iconBg: 'bg-gradient-to-br from-navy-400 to-navy-600',       badge: 'badge-violet' },
  Literature:        { border: 'border-l-navy-400',    iconBg: 'bg-gradient-to-br from-navy-400 to-navy-600',       badge: 'badge-violet' },
  Technology:        { border: 'border-l-navy-500',    iconBg: 'bg-gradient-to-br from-navy-500 to-navy-700',       badge: 'badge-cyan' },
  'General Knowledge':{ border: 'border-l-igreen-500', iconBg: 'bg-gradient-to-br from-igreen-500 to-saffron-500', badge: 'badge-green' },
};

export function CategoryCard({ category, description, questionCount = 15 }: CategoryCardProps) {
  const router = useRouter();
  const [showSetup, setShowSetup] = useState(false);
  const icon = CATEGORY_ICONS[category] ?? '📝';
  const handleStart = (mode: ExamMode, level: Difficulty) => {
    const slug = category.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/\//g, '-');
    router.push(`/quiz/${slug}?mode=${mode}&level=${level}`);
  };
  const colors = CATEGORY_COLORS[category] ?? {
    border: 'border-l-saffron-500',
    iconBg: 'bg-gradient-to-br from-saffron-500 to-igreen-500',
    badge: 'badge-green',
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowSetup(true)}
        className={`group relative block w-full rounded-3xl border border-gray-200 ${colors.border} border-l-4 bg-white p-6 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-saffron-300 shadow-card hover:shadow-card-hover hover:-translate-y-1`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${colors.iconBg} text-2xl shadow-md transition-transform group-hover:scale-110`}
              role="img"
              aria-label={category}
            >
              {icon}
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">{category}</h3>
              {description && (
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{description}</p>
              )}
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {questionCount} questions
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-saffron-500" />
                  Adaptive
                </span>
              </div>
            </div>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-slate-400 transition-all group-hover:bg-saffron-100 group-hover:text-saffron-600 group-hover:scale-110">
            <ChevronRight className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-saffron-50 border border-saffron-100 px-3 py-2 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5 text-saffron-500" />
          Set topic & timer before starting
        </div>
      </button>

      <ExamSetupModal
        isOpen={showSetup}
        category={category}
        onClose={() => setShowSetup(false)}
        onStart={handleStart}
      />
    </>
  );
}
