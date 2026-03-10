export const TOPIC_OPTIONS = [
  { value: 'mixed', label: 'Mixed (Adaptive)', desc: 'Difficulty adjusts to your performance' },
  { value: 'easy', label: 'Easy', desc: 'Beginner level questions' },
  { value: 'medium', label: 'Medium', desc: 'Intermediate level' },
  { value: 'hard', label: 'Hard', desc: 'Advanced challenge' },
] as const;

export const TIMER_OPTIONS = [
  { value: 0, label: 'No timer', desc: 'Take your time' },
  { value: 5, label: '5 min', desc: 'Quick practice' },
  { value: 10, label: '10 min', desc: 'Short exam' },
  { value: 15, label: '15 min', desc: 'Standard test' },
  { value: 30, label: '30 min', desc: 'Full exam mode' },
] as const;
