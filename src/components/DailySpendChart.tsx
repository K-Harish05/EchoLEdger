"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useExpenses } from "@/lib/useExpenses";

export default function DailySpendChart() {
  const { expenses, loading } = useExpenses();

  const data = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const dailyMap: Record<string, number> = {};

    expenses.forEach((exp) => {
      if (!exp.date) return;
      // Truncate to just the YYYY-MM-DD standard format
      // Note: exp.date usually comes in from AI as yyyy-mm-dd
      const dateKey = exp.date.split("T")[0]; 
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + (Number(exp.amount) || 0);
    });

    // Map object to expected Recharts array, sorted chronologically
    const chartData = Object.entries(dailyMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Optional: Format the date string so it's prettier on X axis (e.g. 'Oct 4')
    return chartData.map(item => {
      const d = new Date(item.date);
      const formatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { ...item, displayDate: formatted };
    });
  }, [expenses]);

  if (loading) {
    return (
      <div className="glass-card flex h-64 items-center justify-center rounded-2xl shadow-sm lg:h-full">
        <p className="animate-pulse text-sm font-medium text-slate-500">Loading Trends...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-card flex h-64 items-center justify-center rounded-2xl shadow-sm lg:h-full">
        <p className="text-sm font-medium text-slate-500">Not enough data</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">Spending Trends</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">Your daily volume across all time</p>
      </div>

      <div className="h-64 sm:h-72 w-full lg:flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "var(--text-muted)" }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "var(--text-muted)" }} 
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`₹${value}`, "Total Spend"]}
              labelStyle={{ color: "var(--text-muted)", marginBottom: "4px" }}
              itemStyle={{ color: "var(--primary)", fontWeight: "bold" }}
              contentStyle={{ borderRadius: "12px", border: "1px solid var(--card-border)", backgroundColor: "var(--card)", color: "var(--foreground)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", backdropFilter: "blur(12px)" }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="var(--primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
