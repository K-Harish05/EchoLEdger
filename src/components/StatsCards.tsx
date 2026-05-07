"use client";

import { useMemo, useState, useEffect } from "react";
import { useExpenses } from "@/lib/useExpenses";
import { useSettings } from "@/lib/useSettings";
import { motion } from "framer-motion";

export default function StatsCards() {
  const { expenses, loading } = useExpenses();
  const { currencySymbol } = useSettings();
  const [budget, setBudget] = useState(50000);

  useEffect(() => {
    const saved = localStorage.getItem("monthlyBudget");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBudget(Number(saved));
    }
  }, []);

  const handleBudgetChange = () => {
    const newBudgetStr = window.prompt("Set your new Monthly Budget (₹):", budget.toString());
    if (newBudgetStr !== null) {
      const parsed = parseInt(newBudgetStr.replace(/\D/g, ""), 10);
      if (!isNaN(parsed) && parsed > 0) {
        setBudget(parsed);
        localStorage.setItem("monthlyBudget", parsed.toString());
      }
    }
  };

  const stats = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return { total: 0, avgPerDay: 0, projectedTotal: 0, projectedPercent: 0, budgetUsed: 0 };
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Filter to strictly the current calendar month
    const thisMonthExpenses = expenses.filter((exp) => {
      if (!exp.date) return false;
      const d = new Date(exp.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const total = thisMonthExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    
    // Average per day calculation
    const currentDayOfMonth = Math.max(1, today.getDate());
    const avgPerDay = Math.round(total / currentDayOfMonth);

    // Prediction calculation
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const projectedTotal = avgPerDay * daysInMonth;
    const projectedPercent = budget > 0 ? Math.round((projectedTotal / budget) * 100) : 0;

    return {
      total,
      avgPerDay,
      projectedTotal,
      projectedPercent
    };
  }, [expenses, budget]);

  const percentUsed = budget > 0 ? Math.round((stats.total / budget) * 100) : 0;
  
  let budgetColor = "text-[var(--primary)]";
  let budgetBg = "bg-[var(--card)] border-[var(--card-border)]";
  let statusBadge = null;

  if (percentUsed > 100) {
    budgetColor = "text-red-500";
    budgetBg = "bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
    statusBadge = (
      <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span> OVER BUDGET
      </span>
    );
  } else if (percentUsed > 80) {
    budgetColor = "text-[var(--warning)]";
    budgetBg = "bg-[var(--warning)]/5 border-[var(--warning)]/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]";
    statusBadge = <span className="text-[10px] font-bold text-[var(--warning)] bg-[var(--warning)]/10 px-2 py-0.5 rounded-full border border-[var(--warning)]/20">WARNING</span>;
  } else {
    statusBadge = <span className="text-[10px] font-bold text-[var(--success)] bg-[var(--success)]/10 px-2 py-0.5 rounded-full border border-[var(--success)]/20">ON TRACK</span>;
  }

  if (loading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-5 shadow-sm animate-pulse">
             <div className="h-4 w-24 bg-[var(--card-border)] rounded mb-4" />
             <div className="h-8 w-16 bg-[var(--card-border)] rounded" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <motion.div whileHover={{ y: -4 }} className="glass-card rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-lg">
        <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Total This Month</p>
        <p className="mt-2 text-3xl font-black text-[var(--foreground)] tracking-tight">{currencySymbol}{stats.total.toLocaleString()}</p>
      </motion.div>

      <motion.div whileHover={{ y: -4 }} className="glass-card rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-lg">
        <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Average / Day</p>
        <p className="mt-2 text-2xl font-bold text-[var(--foreground)] tracking-tight">{currencySymbol}{stats.avgPerDay.toLocaleString()}</p>
      </motion.div>

      <motion.div whileHover={{ y: -4 }} className="glass-card rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-lg relative overflow-hidden group">
        <div className={`absolute top-0 right-0 h-16 w-16 -mr-4 -mt-4 rounded-full blur-2xl opacity-20 pointer-events-none transition-all ${stats.projectedPercent > 100 ? 'bg-red-500' : 'bg-[var(--primary)]'}`} />
        <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex justify-between items-center z-10 relative">
          Projected Month End
          {stats.projectedPercent > 100 && (
             <span className="text-[10px] font-bold text-[var(--warning)] bg-[var(--warning)]/10 px-2 py-0.5 rounded-full border border-[var(--warning)]/20 animate-pulse">
               EXCEEDS BUDGET
             </span>
          )}
        </p>
        <p className={`mt-2 text-2xl font-bold tracking-tight z-10 relative ${stats.projectedPercent > 100 ? 'text-[var(--warning)]' : 'text-[var(--primary)]'}`}>
          {currencySymbol}{stats.projectedTotal.toLocaleString()}
        </p>
        
        {/* Animated Progress Bar for Prediction */}
        <div className="mt-4 h-1.5 w-full rounded-full bg-[var(--background)] z-10 relative overflow-hidden flex border border-[var(--card-border)]/50">
          {/* Base current spend */}
          <div 
             className={`h-full transition-all duration-1000 ${percentUsed > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-[var(--primary)] to-[var(--ai-glow)]'}`} 
             style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
          {/* Projected extra spend (stripes) */}
          <div 
             className={`h-full opacity-40 transition-all duration-1000 border-l border-[var(--background)] ${stats.projectedPercent > 100 ? 'bg-red-500/80' : 'bg-[var(--primary)]/80'}`}
             style={{ 
               width: `${Math.min(Math.max(0, stats.projectedPercent - percentUsed), 100 - Math.min(percentUsed, 100))}%`,
               backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)'
             }}
          />
        </div>
      </motion.div>

      <motion.div 
        whileHover={{ y: -4 }}
        onClick={handleBudgetChange}
        className={`glass-card rounded-2xl p-5 shadow-sm cursor-pointer relative overflow-hidden transition-all ${budgetBg}`}
        title="Click to edit Monthly Budget"
      >
        <div className="absolute top-0 right-0 p-3 opacity-5">
          <svg className="h-12 w-12 text-[var(--foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex justify-between items-center z-10 relative">
          Budget Used
          {statusBadge}
        </p>
        <div className="mt-2 flex items-baseline gap-2 z-10 relative">
          <p className={`text-3xl font-black tracking-tight ${budgetColor}`}>{percentUsed}%</p>
          <p className="text-[11px] font-semibold text-[var(--text-muted)]">of {currencySymbol}{budget.toLocaleString()}</p>
        </div>
        
        {/* Progress Bar Line */}
        <div className="mt-4 h-1.5 w-full rounded-full bg-[var(--background)] z-10 relative overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${percentUsed > 100 ? 'bg-red-500' : percentUsed > 80 ? 'bg-[var(--warning)]' : 'bg-gradient-to-r from-[var(--primary)] to-[var(--ai-glow)]'}`} 
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </motion.div>
    </section>
  );
}
