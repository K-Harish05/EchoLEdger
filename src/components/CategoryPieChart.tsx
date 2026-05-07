"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useExpenses } from "@/lib/useExpenses";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4", "#6366f1"];

export default function CategoryPieChart() {
  const { expenses, loading } = useExpenses();

  const data = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const categoryMap: Record<string, number> = {};
    
    // Sum amounts by category
    expenses.forEach((exp) => {
      const cat = exp.category || "General";
      categoryMap[cat] = (categoryMap[cat] || 0) + (Number(exp.amount) || 0);
    });

    // Convert to array format expected by Recharts
    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Order biggest slice first
  }, [expenses]);

  if (loading) {
    return (
      <div className="glass-card flex h-64 items-center justify-center rounded-2xl shadow-sm">
        <p className="animate-pulse text-sm font-medium text-slate-500">Loading Chart...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-card flex h-64 items-center justify-center rounded-2xl shadow-sm">
        <p className="text-sm font-medium text-slate-500">No expenses yet</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">Expense Breakdown</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">Where your money is going</p>
      </div>
      
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`₹${value}`, "Amount"]}
              contentStyle={{ borderRadius: "12px", border: "1px solid var(--card-border)", backgroundColor: "var(--card)", color: "var(--foreground)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", backdropFilter: "blur(12px)" }}
              itemStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px", color: "var(--text-muted)" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
