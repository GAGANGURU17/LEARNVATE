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

const CATEGORY_COLORS: Record<string, { glow: string; iconBg: string; badge: string }> = {
  Mathematics:       { glow: 'hover:shadow-glow',        iconBg: 'bg-gradient-to-br from-primary-400 to-cyan-600',   badge: 'badge-green' },
  Science:           { glow: 'hover:shadow-glow-cyan',    iconBg: 'bg-gradient-to-br from-cyan-400 to-indigo-600',    badge: 'badge-cyan' },
  History:           { glow: 'hover:shadow-glow-amber',   iconBg: 'bg-gradient-to-br from-amber-400 to-rose-500',     badge: 'badge-rose' },
  Geography:         { glow: 'hover:shadow-glow-rose',    iconBg: 'bg-gradient-to-br from-rose-400 to-accent-600',    badge: 'badge-rose' },
  English:           { glow: 'hover:shadow-glow-violet',  iconBg: 'bg-gradient-to-br from-violet-400 to-indigo-600',  badge: 'badge-violet' },
  Literature:        { glow: 'hover:shadow-glow-violet',  iconBg: 'bg-gradient-to-br from-violet-400 to-indigo-600',  badge: 'badge-violet' },
  Technology:        { glow: 'hover:shadow-glow-cyan',    iconBg: 'bg-gradient-to-br from-indigo-400 to-violet-600',  badge: 'badge-cyan' },
  'General Knowledge':{ glow: 'hover:shadow-glow-amber',  iconBg: 'bg-gradient-to-br from-amber-400 to-primary-600', badge: 'badge-green' },
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
    glow: 'hover:shadow-glow',
    iconBg: 'bg-gradient-to-br from-primary-400 to-cyan-600',
    badge: 'badge-green',
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowSetup(true)}
        className={`group relative block w-full rounded-3xl border border-white/8 glass-card p-6 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${colors.glow} hover:-translate-y-1`}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${colors.iconBg} text-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110`}
              role="img"
              aria-label={category}
            >
              {icon}
            </span>
            <div>
              <h3 className="text-base font-bold text-white">{category}</h3>
              {description && (
                <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">{description}</p>
              )}
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {questionCount} questions
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Adaptive
                </span>
              </div>
            </div>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-slate-400 transition-all group-hover:bg-primary-500/20 group-hover:text-primary-400 group-hover:scale-110">
            <ChevronRight className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl glass px-3 py-2 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5 text-slate-600" />
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
