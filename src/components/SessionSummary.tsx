'use client';

interface SessionSummaryProps {
  total: number;
  correct: number;
  timeUp?: boolean;
  onRestart: () => void;
  onHome: () => void;
}

export function SessionSummary({
  total,
  correct,
  timeUp,
  onRestart,
  onHome,
}: SessionSummaryProps) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-slate-800">Session Complete!</h2>
      {timeUp && (
        <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Time&apos;s up! Your exam ended when the timer reached zero.
        </p>
      )}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-primary-50 p-4">
          <p className="text-sm text-primary-600">Correct</p>
          <p className="text-2xl font-bold text-primary-800">{correct}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Total</p>
          <p className="text-2xl font-bold text-slate-800">{total}</p>
        </div>
        <div className="col-span-2 rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Accuracy</p>
          <p className="text-2xl font-bold text-slate-800">{accuracy}%</p>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 rounded-lg bg-primary-600 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={onHome}
          className="flex-1 rounded-lg border border-slate-300 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
