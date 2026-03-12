'use client';

import { useState } from 'react';
import { Search, Filter, X, ChevronDown, Calendar } from 'lucide-react';

interface HistoryFilterProps {
  categories: string[];
  onFilterChange: (filters: { category: string; timeframe: string; search: string }) => void;
}

export function HistoryFilter({ categories, onFilterChange }: HistoryFilterProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [timeframe, setTimeframe] = useState('All Time');
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = (newCategory = category, newTimeframe = timeframe, newSearch = search) => {
    onFilterChange({ category: newCategory, timeframe: newTimeframe, search: newSearch });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
        <input
          type="text"
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleUpdate(category, timeframe, e.target.value);
          }}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-saffron-100 focus:border-saffron-300 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      <div className="flex gap-2">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            handleUpdate(e.target.value, timeframe, search);
          }}
          className="px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-saffron-100 text-sm font-medium text-slate-600 appearance-none cursor-pointer hover:bg-gray-50 transition-all min-w-[140px]"
        >
          <option>All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <select
          value={timeframe}
          onChange={(e) => {
            setTimeframe(e.target.value);
            handleUpdate(category, e.target.value, search);
          }}
          className="px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-saffron-100 text-sm font-medium text-slate-600 appearance-none cursor-pointer hover:bg-gray-50 transition-all min-w-[120px]"
        >
          <option>All Time</option>
          <option>Today</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
        </select>
      </div>
    </div>
  );
}
