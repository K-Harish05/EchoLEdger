"use client";

import { useState, useEffect } from "react";

export interface FilterState {
  search: string;
  category: string;
}

export default function ExpenseFilters({ onFilterChange }: { onFilterChange: (f: FilterState) => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      onFilterChange({ search, category });
    }, 300); // 300ms debounce to prevent rapid rerenders on keystroke
    return () => clearTimeout(delay);
  }, [search, category, onFilterChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="flex-1 relative">
        <svg className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
        <input 
          type="text"
          placeholder="Search vendors or notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] py-2 pl-9 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)]/50 outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] shadow-sm"
        />
      </div>
      <div className="sm:w-48">
        <select 
          value={category} 
          onChange={e => setCategory(e.target.value)}
          className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] shadow-sm appearance-none"
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="General">General</option>
        </select>
      </div>
    </div>
  );
}
