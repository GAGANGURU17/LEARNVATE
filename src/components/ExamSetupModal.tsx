'use client';

import { useState } from 'react';
import { X, Play, Target, Shield, Clock, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { Difficulty, ExamMode } from '@/lib/types';

interface ExamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  onStart: (mode: ExamMode, level: Difficulty) => void;
}

export function ExamSetupModal({ isOpen, onClose, category, onStart }: ExamSetupModalProps) {
  const [mode, setMode] = useState<ExamMode>('practice');
  const [level, setLevel] = useState<Difficulty>('preliminary');

  if (!isOpen) return null;

  const modes: { id: ExamMode; label: string; desc: string; icon: any; color: string }[] = [
    { id: 'practice', label: 'Practice Mode', desc: 'No time pressure. Get explanations after every answer.', icon: BookOpen, color: 'text-blue-400' },
    { id: 'time-trial', label: 'Time Trial', desc: 'Race against the clock. Difficulty adjusts rapidly.', icon: Clock, color: 'text-amber-400' },
    { id: 'mock-exam', label: 'Mock Exam', desc: 'Full exam simulation. No explanations until the end.', icon: Shield, color: 'text-primary-400' },
  ];

  const levels: { id: Difficulty; label: string }[] = [
    { id: 'preliminary', label: 'Preliminary / Level 1' },
    { id: 'mains', label: 'Mains / Level 2' },
    { id: 'advanced', label: 'Advanced / Interview' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-scale-in">
        <div className="p-8 pb-0 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Prepare for <span className="gradient-text">{category}</span>
            </h2>
            <p className="mt-2 text-slate-400">Configure your examination session</p>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Difficulty Level */}
          <section>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Select Target Level</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {levels.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`px-4 py-3 rounded-2xl border transition-all duration-200 text-sm font-bold ${
                    level === l.id 
                      ? 'border-primary-500 bg-primary-500/10 text-white shadow-glow-sm' 
                      : 'border-white/5 bg-white/3 text-slate-400 hover:border-white/10'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </section>

          {/* Exam Mode */}
          <section>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Choose Mode</h3>
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
                        ? 'border-white/20 bg-white/5 text-white shadow-xl' 
                        : 'border-white/5 bg-white/2 text-slate-500 hover:border-white/10'
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${active ? 'bg-white/10 ' + m.color : 'bg-white/5'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${active ? 'text-white' : 'text-slate-300'}`}>{m.label}</p>
                      <p className="text-xs mt-0.5 opacity-60 leading-relaxed">{m.desc}</p>
                    </div>
                    {active && <Sparkles className="h-5 w-5 text-primary-400 animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </section>

          <button
            onClick={() => onStart(mode, level)}
            className="btn-primary w-full py-5 rounded-3xl text-lg font-bold shadow-glow-lg animate-fade-in-up"
          >
            <Play className="h-5 w-5 fill-current" />
            Launch Live Exam Session
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
