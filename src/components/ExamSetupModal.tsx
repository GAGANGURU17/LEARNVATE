'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Target, Shield, Clock, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { Difficulty, ExamMode } from '@/lib/types';

interface ExamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  onStart: (mode: ExamMode, level: Difficulty, timing: number, questionCount: number, topic: string) => void;
}

export function ExamSetupModal({ isOpen, onClose, category, onStart }: ExamSetupModalProps) {
  const [mode, setMode] = useState<ExamMode>('practice');
  const [level, setLevel] = useState<Difficulty>('preliminary');
  const [timing, setTiming] = useState(15);
  const [questionCount, setQuestionCount] = useState(20);
  const [topic, setTopic] = useState('mixed');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  const modes: { id: ExamMode; label: string; desc: string; icon: any; color: string }[] = [
    { id: 'practice', label: 'Practice Mode', desc: 'No time pressure. Get explanations after every answer.', icon: BookOpen, color: 'text-navy-600' },
    { id: 'time-trial', label: 'Time Trial', desc: 'Race against the clock. Difficulty adjusts rapidly.', icon: Clock, color: 'text-saffron-600' },
    { id: 'mock-exam', label: 'Mock Exam', desc: 'Full exam simulation. No explanations until the end.', icon: Shield, color: 'text-igreen-600' },
  ];

  const levels: { id: Difficulty; label: string }[] = [
    { id: 'preliminary', label: 'Preliminary / Level 1' },
    { id: 'mains', label: 'Mains / Level 2' },
    { id: 'advanced', label: 'Advanced / Interview' },
  ];

  const timingOptions = [5, 10, 15, 30, 45, 60];
  const countOptions = [10, 20, 30, 50, 100];
  const topicOptions = [
    { id: 'mixed', label: 'Mixed Subjects' },
    { id: 'easy', label: 'Focus: Foundational' },
    { id: 'medium', label: 'Focus: Intermediate' },
    { id: 'hard', label: 'Focus: Expert' },
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-scale-in border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header - Fixed to top */}
        <div className="p-6 sm:p-8 shrink-0 flex items-start justify-between bg-white z-10 border-b border-gray-50/50">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex flex-wrap items-center gap-x-2 gap-y-1">
              Prepare for <span className="gradient-text">{category}</span>
            </h2>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-500">Configure your examination session</p>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 shrink-0 ml-4 rounded-full bg-gray-100 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto custom-scrollbar">
          {/* Difficulty Level */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Target Level</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {levels.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`px-4 py-3 rounded-2xl border transition-all duration-200 text-sm font-bold ${
                    level === l.id 
                      ? 'border-saffron-400 bg-saffron-50 text-saffron-700 shadow-sm' 
                      : 'border-gray-200 bg-gray-50 text-slate-500 hover:border-saffron-200 hover:bg-saffron-50/50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </section>

          {/* Exam Mode */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Choose Mode</h3>
            <div className="grid gap-4">
              {modes.map((m) => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                      active 
                        ? 'border-saffron-300 bg-saffron-50 shadow-sm' 
                        : 'border-gray-200 bg-gray-50 hover:border-saffron-200'
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${active ? 'bg-saffron-100 ' + m.color : 'bg-gray-100 text-slate-400'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${active ? 'text-slate-900' : 'text-slate-600'}`}>{m.label}</p>
                      <p className="text-xs mt-0.5 text-slate-500 leading-relaxed">{m.desc}</p>
                    </div>
                    {active && <Sparkles className="h-5 w-5 text-saffron-500 animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Extra Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Timing (Minutes)
              </h3>
              <div className="flex flex-wrap gap-2">
                {timingOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTiming(t)}
                    className={`h-10 px-4 rounded-xl border text-sm font-bold transition-all ${
                      timing === t
                        ? 'border-saffron-400 bg-saffron-50 text-saffron-700 shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-slate-500 hover:border-saffron-100'
                    }`}
                  >
                    {t}m
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target className="h-4 w-4" /> Questions
              </h3>
              <div className="flex flex-wrap gap-2">
                {countOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setQuestionCount(c)}
                    className={`h-10 px-4 rounded-xl border text-sm font-bold transition-all ${
                      questionCount === c
                        ? 'border-saffron-400 bg-saffron-50 text-saffron-700 shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-slate-500 hover:border-saffron-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Syllabus / Topic
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {topicOptions.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setTopic(o.id)}
                  className={`px-4 py-3 rounded-2xl border transition-all duration-200 text-sm font-bold text-left ${
                    topic === o.id
                      ? 'border-saffron-400 bg-saffron-50 text-saffron-700 shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-slate-500 hover:border-saffron-100'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </section>

          <button
            onClick={() => onStart(mode, level, timing, questionCount, topic)}
            className="btn-primary w-full py-5 rounded-3xl text-lg font-bold animate-fade-in-up sticky bottom-0 shadow-lg"
          >
            <Play className="h-5 w-5 fill-current" />
            Launch Live Exam Session
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
