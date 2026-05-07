"use client";

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useExpenses } from "@/lib/useExpenses";
import type { FilterState } from "./ExpenseFilters";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ExpenseList({ filters }: { filters: FilterState }) {
  const { expenses, loading } = useExpenses();

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this expense? This cannot be undone.")) return;
    
    try {
      await deleteDoc(doc(db, "expenses", id));
      toast.success("Expense deleted successfully");
    } catch (error) {
       console.error("Delete failed:", error);
       toast.error("Failed to delete expense");
    }
  };

  // Client-side filtering keeps things fast and avoids complex Firestore indexes
  const filtered = expenses.filter(exp => {
    const s = filters.search.toLowerCase();
    const matchesSearch = !s || 
      (exp.vendor?.toLowerCase().includes(s)) || 
      (exp.notes?.toLowerCase().includes(s));
    
    const matchesCategory = !filters.category || exp.category === filters.category;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--card-border)] border-dashed bg-[var(--background)]/20 p-12 text-center shadow-sm">
        <p className="animate-pulse text-sm font-medium text-[var(--text-muted)]">Loading ledger...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--card-border)] border-dashed bg-[var(--background)]/20 p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-[var(--text-muted)]">No expenses found matching your criteria.</p>
        </div>
      ) : (
        filtered.map((exp, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={exp.id} 
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--background)]/40 p-4 shadow-sm transition-all hover:shadow-md hover:bg-[var(--card-border)]/50 hover:border-[var(--primary)]/30"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 flex items-center justify-center border border-[var(--card-border)]">
                <span className="text-sm font-bold text-[var(--primary)]">{exp.vendor?.charAt(0)?.toUpperCase() || "U"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[var(--foreground)] tracking-tight">{exp.vendor || "Unknown Vendor"}</span>
                <span className="text-xs font-semibold text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                  {exp.date} 
                  <span className="w-1 h-1 rounded-full bg-[var(--card-border)]"></span>
                  <span className="text-[var(--primary)] px-2 py-0.5 rounded border border-[var(--primary)]/20 bg-[var(--primary)]/10">{exp.category}</span>
                </span>
                {exp.notes && <span className="mt-1.5 text-[11px] text-[var(--text-muted)] italic font-medium bg-[var(--background)]/50 rounded px-2 py-1 inline-block border border-[var(--card-border)]/50">&quot;{exp.notes}&quot;</span>}
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-6 ml-14 sm:ml-0">
              <span className="text-lg font-black text-[var(--foreground)] tracking-tight">₹{exp.amount}</span>
              
              <button 
                onClick={() => handleDelete(exp.id)}
                className="rounded-lg p-2 text-[var(--text-muted)] opacity-100 sm:opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
                aria-label="Delete expense"
                title="Delete"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
