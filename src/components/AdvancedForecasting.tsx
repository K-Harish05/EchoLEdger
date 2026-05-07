"use client";

import { useState } from "react";
import { useExpenses } from "@/lib/useExpenses";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, AlertCircle } from "lucide-react";

export default function AdvancedForecasting() {
  const { expenses, loading } = useExpenses();
  const [forecast, setForecast] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateForecast = async () => {
    if (!expenses || expenses.length === 0) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch forecast");
      
      setForecast(data.forecast);
    } catch (err: any) {
      console.error(err);
      setError("Unable to run forecasting model at this time. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return null;

  return (
    <section className="glass-card rounded-2xl p-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--ai-glow)] blur-[100px] opacity-20 pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--ai-glow)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight">Advanced Forecasting Engine</h3>
            <p className="text-sm text-[var(--text-muted)] font-medium">AI-driven predictive modeling based on your ledger</p>
          </div>
        </div>
        
        <button 
          onClick={generateForecast}
          disabled={isGenerating || expenses.length === 0}
          className="flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-bold text-[var(--background)] shadow-md transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-[var(--background)] border-t-transparent rounded-full" />
              Processing Model...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {forecast ? "Regenerate Forecast" : "Run AI Forecast"}
            </>
          )}
        </button>
      </div>

      <div className="relative z-10">
        {error ? (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        ) : !forecast ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-[var(--card-border)] rounded-xl bg-[var(--background)]/30">
            <TrendingUp className="h-8 w-8 text-[var(--text-muted)] opacity-50 mb-3" />
            <p className="text-sm font-bold text-[var(--foreground)]">Model Ready</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm">Click the button above to analyze your historical data and generate a predictive financial report.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-6 rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 text-sm leading-relaxed text-[var(--foreground)]"
          >
            {forecast.split('\n\n').map((paragraph, i) => (
              <p key={i} className="font-medium text-[var(--text-muted)]">
                {i === 0 && <span className="font-bold text-[var(--foreground)] block mb-1">Observation:</span>}
                {i === 1 && <span className="font-bold text-[var(--foreground)] block mb-1 mt-2">Projection:</span>}
                {i === 2 && <span className="font-bold text-[var(--primary)] block mb-1 mt-2">Recommendation:</span>}
                {paragraph}
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
