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
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-elevated animate-scale-in">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-igreen-500 rounded-t-3xl" />
      <h2 className="mb-6 text-2xl font-bold text-slate-900">🎉 Session Complete!</h2>
      {timeUp && (
        <p className="mb-4 rounded-lg bg-saffron-50 border border-saffron-200 p-3 text-sm text-saffron-700">
          Time&apos;s up! Your exam ended when the timer reached zero.
        </p>
      )}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-igreen-50 border border-igreen-100 p-4">
          <p className="text-sm text-igreen-600 font-medium">Correct</p>
          <p className="text-2xl font-bold text-igreen-700">{correct}</p>
        </div>
        <div className="rounded-xl bg-saffron-50 border border-saffron-100 p-4">
          <p className="text-sm text-saffron-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-saffron-700">{total}</p>
        </div>
        <div className="col-span-2 rounded-xl bg-navy-50 border border-navy-100 p-4">
          <p className="text-sm text-navy-600 font-medium">Accuracy</p>
          <p className="text-2xl font-bold text-navy-700">{accuracy}%</p>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onRestart}
          className="btn-primary flex-1 py-3"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={onHome}
          className="btn-secondary flex-1 py-3"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
