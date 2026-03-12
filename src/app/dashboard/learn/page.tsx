'use client';

import Link from 'next/link';
import { CategoryCard } from '@/components/CategoryCard';
import { QUESTION_CATEGORIES } from '@/lib/questions';
import { ArrowLeft, BookOpen, Clock, Settings2 } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-saffron-600 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to dashboard
      </Link>

      <div className="rounded-2xl border border-saffron-200 bg-gradient-to-br from-white to-saffron-50/40 p-6 shadow-card">
        <h1 className="text-2xl font-bold text-slate-900">Choose a category</h1>
        <p className="mt-2 text-slate-600">
          Select a subject to start your exam. You can set topic difficulty and timer before starting.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-saffron-500" />
            Topic-wise: Easy, Medium, Hard, or Mixed
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-saffron-500" />
            Timer: 5, 10, 15, or 30 min
          </span>
          <span className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-saffron-500" />
            Configure before starting
          </span>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Subjects</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUESTION_CATEGORIES.map((cat) => (
            <CategoryCard key={cat} category={cat} questionCount={15} />
          ))}
        </div>
      </div>
    </div>
  );
}
