"use client";

import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, TrendingDown, Sparkles, type LucideIcon } from "lucide-react";
import { useExpenses } from "@/lib/useExpenses";

// Reusable component
function InsightCard({ 
  insight, 
  idx 
}: { 
  insight: { id: string, title: string, desc: string, color: string, bg: string, border: string, icon: LucideIcon }, 
  idx: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 }}
      className={`glass-card relative flex flex-col gap-1 rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${insight.border}`}
    >
      <div className={`absolute top-0 right-0 h-16 w-16 -mr-4 -mt-4 rounded-full blur-2xl opacity-20 pointer-events-none ${insight.bg.replace('/10', '')}`} />
      
      <div className="flex items-start gap-3 z-10">
        <div className={`mt-0.5 rounded-full p-1.5 ${insight.bg}`}>
          <insight.icon className={`h-4 w-4 ${insight.color}`} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[var(--foreground)] tracking-tight">{insight.title}</h4>
          <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)] leading-relaxed">{insight.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function SmartInsights() {
  const { expenses, loading } = useExpenses();
  const [budget, setBudget] = useState(50000);

  useEffect(() => {
    const saved = localStorage.getItem("monthlyBudget");
    if (saved) setBudget(Number(saved));
  }, []);

  const insights = useMemo(() => {
    if (loading) return [];
    if (!expenses || expenses.length === 0) {
      return [{
        id: "empty",
        icon: Sparkles,
        title: "Welcome aboard",
        desc: "Add your first expense to generate AI insights.",
        color: "text-[var(--primary)]",
        bg: "bg-[var(--primary)]/10",
        border: "border-[var(--primary)]/20"
      }];
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // 1. Calculate this month's stats
    const thisMonthExpenses = expenses.filter(exp => {
      if (!exp.date) return false;
      const d = new Date(exp.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalThisMonth = thisMonthExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const percentUsed = budget > 0 ? Math.round((totalThisMonth / budget) * 100) : 0;

    // 2. Top Category
    const categoryMap: Record<string, number> = {};
    thisMonthExpenses.forEach(exp => {
      const cat = exp.category || "General";
      categoryMap[cat] = (categoryMap[cat] || 0) + (Number(exp.amount) || 0);
    });
    
    let topCategory = "None";
    let topSpend = 0;
    Object.entries(categoryMap).forEach(([cat, amt]) => {
      if (amt > topSpend) {
        topCategory = cat;
        topSpend = amt;
      }
    });

    // 3. Last 7 days vs Previous 7 days
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    let last7Total = 0;
    let prev7Total = 0;

    expenses.forEach(exp => {
      if (!exp.date) return;
      const d = new Date(exp.date);
      if (d >= sevenDaysAgo && d <= today) {
        last7Total += Number(exp.amount) || 0;
      } else if (d >= fourteenDaysAgo && d < sevenDaysAgo) {
        prev7Total += Number(exp.amount) || 0;
      }
    });

    const generated = [];

    // --- RULE 1: Budget Alert ---
    if (percentUsed >= 90) {
      generated.push({
        id: "budget-alert",
        icon: AlertTriangle,
        title: "Critical Budget Alert",
        desc: `You've used ${percentUsed}% of your ₹${budget} monthly budget. Slow down!`,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/30"
      });
    } else if (percentUsed >= 75) {
      generated.push({
        id: "budget-warn",
        icon: AlertTriangle,
        title: "Budget Warning",
        desc: `Approaching limit: You've spent ${percentUsed}% of your budget this month.`,
        color: "text-[var(--warning)]",
        bg: "bg-[var(--warning)]/10",
        border: "border-[var(--warning)]/30"
      });
    } else if (totalThisMonth > 0) {
      generated.push({
        id: "budget-good",
        icon: TrendingDown,
        title: "On Track",
        desc: `You have ₹${budget - totalThisMonth} left. Good job staying under budget!`,
        color: "text-[var(--success)]",
        bg: "bg-[var(--success)]/10",
        border: "border-[var(--success)]/30"
      });
    }

    // --- RULE 2: Top Category ---
    if (topSpend > 0) {
      generated.push({
        id: "top-cat",
        icon: Sparkles,
        title: "Spending Habit",
        desc: `Your highest expense is ${topCategory} (₹${topSpend}) this month.`,
        color: "text-[var(--primary)]",
        bg: "bg-[var(--primary)]/10",
        border: "border-[var(--primary)]/30"
      });
    }

    // --- RULE 3: Weekly Trend ---
    if (last7Total > 0 && prev7Total > 0) {
      const diff = Math.round(((last7Total - prev7Total) / prev7Total) * 100);
      if (diff > 10) {
        generated.push({
          id: "trend-up",
          icon: TrendingUp,
          title: "Spending Increase",
          desc: `You spent ${diff}% more in the last 7 days compared to the previous week.`,
          color: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500/20"
        });
      } else if (diff < -10) {
        generated.push({
          id: "trend-down",
          icon: TrendingDown,
          title: "Great Savings",
          desc: `You spent ${Math.abs(diff)}% less this week. Keep it up!`,
          color: "text-[var(--success)]",
          bg: "bg-[var(--success)]/10",
          border: "border-[var(--success)]/20"
        });
      }
    } else if (last7Total > 0 && generated.length < 3) {
      // Fallback rule if no previous week data
       generated.push({
          id: "recent-spend",
          icon: TrendingUp,
          title: "Weekly Pulse",
          desc: `You've spent ₹${last7Total} in the last 7 days.`,
          color: "text-indigo-400",
          bg: "bg-indigo-500/10",
          border: "border-indigo-500/20"
       });
    }

    return generated.slice(0, 3); // Max 3 insights
  }, [expenses, budget, loading]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[var(--ai-glow)]" />
        <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">Smart Insights</h3>
      </div>
      
      {loading ? (
        <div className="flex flex-col gap-3 flex-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-20 rounded-xl border border-[var(--card-border)] p-4 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          {insights.map((insight, idx) => (
            <InsightCard key={insight.id} insight={insight} idx={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
