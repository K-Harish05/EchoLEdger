"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ExpenseFilters, { type FilterState } from "@/components/ExpenseFilters";
import ExpenseList from "@/components/ExpenseList";
import ExportCSVButton from "@/components/ExportCSVButton";
import { motion } from "framer-motion";

export default function TransactionsPage() {
  const [filters, setFilters] = useState<FilterState>({ search: "", category: "" });

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Transactions</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)] font-medium">Your complete financial ledger. Filter, search, and export your history.</p>
        </div>
        <ExportCSVButton />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6 flex flex-col min-h-[600px]"
      >
        <div className="mb-6">
          <ExpenseFilters onFilterChange={setFilters} />
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <ExpenseList filters={filters} />
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
