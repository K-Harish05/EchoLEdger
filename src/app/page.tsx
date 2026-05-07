"use client";

import { useState } from "react";
import VoiceCaptureCard from "@/components/VoiceCaptureCard";
import ExpenseConfirmForm from "@/components/ExpenseConfirmForm";
import { useAuth } from "@/components/AuthGate";
import type { ParsedExpense } from "@/lib/parser";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { checkForDuplicateExpense } from "@/lib/duplicates";
import ExpenseFilters, { type FilterState } from "@/components/ExpenseFilters";
import ExpenseList from "@/components/ExpenseList";
import StatsCards from "@/components/StatsCards";
import CategoryPieChart from "@/components/CategoryPieChart";
import DailySpendChart from "@/components/DailySpendChart";
import ExportCSVButton from "@/components/ExportCSVButton";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import SmartInsights from "@/components/SmartInsights";
import AIAssistant from "@/components/AIAssistant";
import SettlementsCard from "@/components/SettlementsCard";
// ... imports above

export default function Home() {
  const { user, logout } = useAuth();
  const [transcript, setTranscript] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [parsedData, setParsedData] = useState<ParsedExpense | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [filters, setFilters] = useState<FilterState>({ search: "", category: "" });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (text: string) => {
    setSubmitted(text);
    setIsParsing(true);
    setParsedData(null);
    try {
      const res = await fetch("/api/parse-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setParsedData(data);
    } catch (e) {
      console.error(e);
      alert("Failed to connect to parser.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 shadow-2xl transition-transform animate-bounce ${toast.type === "success" ? "bg-[var(--success)] text-white shadow-[var(--success)]/20" : "bg-red-500 text-white shadow-red-500/20"}`}>
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-end"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Overview</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)] font-medium">Welcome back, {user?.displayName?.split(" ")[0] || "User"}. Here is your financial summary.</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* TOP LAYER: Hero Voice & Smart Insights */}
        <section className="grid gap-6 xl:grid-cols-2">
          {/* Real voice capture component */}
          <VoiceCaptureCard
            onTranscriptChange={setTranscript}
            onSubmit={handleSubmit}
            isParsing={isParsing}
          />

          <div className="flex flex-col gap-6 h-full">
            <SmartInsights />
          </div>
        </section>

        {/* AI PARSER LAYER (Full Width) */}
        <AnimatePresence>
          {(submitted || parsedData) && (
            <motion.div 
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="glass-card rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/10 blur-3xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse"></div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">AI Parser Engine</h2>
              </div>

              <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-5 py-4 text-sm text-[var(--primary)] relative z-10">
                <p className="font-semibold opacity-80">Audio Received:</p>
                <p className="mt-1.5 italic text-[var(--foreground)]">&ldquo;{submitted}&rdquo;</p>
                {isParsing && <p className="mt-3 text-xs font-bold text-[var(--primary)] flex items-center gap-2"><SparkleIcon /> Running NLP Engine...</p>}
                
                {parsedData && !isParsing && (
                  <ExpenseConfirmForm 
                    initialData={parsedData} 
                    onSave={async (data) => {
                      if (!user) return;
                      
                      const isDup = await checkForDuplicateExpense(user.uid, Number(data.amount), data.vendor || "", data.date || "");
                      if (isDup) {
                        const confirmOverride = window.confirm("Warning: A similar expense (same amount, vendor, and date) already exists. Are you sure you want to save this duplicate?");
                        if (!confirmOverride) return;
                      }

                      try {
                        const expensesRef = collection(db, "expenses");
                        await addDoc(expensesRef, {
                          userId: user.uid,
                          amount: Number(data.amount),
                          category: data.category || "General",
                          vendor: data.vendor || "Unknown Vendor",
                          date: data.date || new Date().toISOString().split('T')[0],
                          notes: data.notes || "",
                          confidence: data.confidence || "Medium",
                          friendName: data.friendName || "",
                          splitType: data.splitType || "None",
                          createdAt: Date.now()
                        });

                        showToast("Expense successfully saved to your ledger!", "success");
                        setParsedData(null);
                        setSubmitted("");
                      } catch (error) {
                        console.error("Failed to save expense:", error);
                        showToast("Failed to save expense to Firestore.", "error");
                      }
                    }}
                    onCancel={() => {
                      setParsedData(null);
                      setSubmitted("");
                    }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MIDDLE LAYER: Stats Cards */}
        <StatsCards />

        {/* MIDDLE LAYER 2: Charts & Settlements */}
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr] lg:items-stretch">
          <CategoryPieChart />
          <DailySpendChart />
          <SettlementsCard />
        </section>

        {/* BOTTOM LAYER: Transactions + AI Assistant */}
        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 h-[500px] flex flex-col"
          >
            <div className="mb-6 flex flex-col justify-between border-b border-[var(--card-border)] pb-5 sm:flex-row sm:items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight">Ledger</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">Live view of your validated expenses.</p>
              </div>
              <ExportCSVButton />
            </div>
            <div className="shrink-0 mb-4">
              <ExpenseFilters onFilterChange={setFilters} />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <ExpenseList filters={filters} />
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
          >
             <AIAssistant />
          </motion.div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function SparkleIcon() {
  return (
    <svg className="h-4 w-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
