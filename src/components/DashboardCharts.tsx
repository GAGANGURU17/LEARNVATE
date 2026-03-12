'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricWidgetProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  gradient: string;
  delay?: string;
}

export function MetricWidget({ label, value, change, icon: Icon, gradient, delay = '' }: MetricWidgetProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className={`relative group p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden animate-fade-in-up ${delay}`}>
      {/* Decorative gradient background */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${gradient} opacity-[0.03] group-hover:scale-150 transition-transform duration-700`} />
      
      <div className="relative flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${gradient} text-white shadow-lg`}>
          <Icon className="h-6 w-6" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
            isPositive ? 'bg-green-50 text-green-600' : 
            isNegative ? 'bg-red-50 text-red-600' : 
            'bg-gray-50 text-gray-500'
          }`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : 
             isNegative ? <TrendingDown className="h-3 w-3" /> : 
             <Minus className="h-3 w-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</h3>
        <p className="mt-1 text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>

      {/* Progress bar for aesthetic */}
      <div className="mt-6 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
        <div className={`h-full ${gradient} opacity-20 w-2/3 group-hover:w-full transition-all duration-1000`} />
      </div>
    </div>
  );
}

export function PerformanceChart({ history }: { history: any[] }) {
  // Simple SVG chart representation since we don't have recharts
  const maxPoints = 7;
  const recentHistory = history.slice(0, maxPoints).reverse();
  const points = recentHistory.map((h, i) => {
    const x = (i / (maxPoints - 1)) * 100;
    const y = 100 - (h.correct / h.total) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative h-32 w-full mt-4">
      {recentHistory.length > 1 ? (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9933" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            fill="url(#chartGradient)"
            stroke="none"
            points={`0,100 ${points} 100,100`}
          />
          <polyline
            fill="none"
            stroke="#FF9933"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="animate-draw"
          />
          {recentHistory.map((h, i) => (
            <circle
              key={i}
              cx={(i / (maxPoints - 1)) * 100}
              cy={100 - (h.correct / h.total) * 100}
              r="3"
              fill="#fff"
              stroke="#FF9933"
              strokeWidth="2"
            />
          ))}
        </svg>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400 text-xs italic">
          Not enough data for performance trend
        </div>
      )}
    </div>
  );
}
