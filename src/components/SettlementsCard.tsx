"use client";

import { useMemo } from "react";
import { useExpenses } from "@/lib/useExpenses";
import { motion } from "framer-motion";
import { Users, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function SettlementsCard() {
  const { expenses, loading } = useExpenses();

  const balances = useMemo(() => {
    const friendMap: Record<string, number> = {};

    expenses?.forEach(exp => {
      // @ts-ignore - Assuming we added friendName and splitType to the type, but ensuring safety
      const friend = exp.friendName as string;
      // @ts-ignore
      const splitType = exp.splitType as string;

      if (friend && friend.trim() !== "" && splitType && splitType !== "None") {
        const name = friend.trim();
        const amt = Number(exp.amount) || 0;
        
        if (!friendMap[name]) friendMap[name] = 0;

        if (splitType === "I owe") {
          friendMap[name] -= amt;
        } else if (splitType === "Owes me") {
          friendMap[name] += amt;
        }
      }
    });

    const list = Object.entries(friendMap)
      .filter(([_, balance]) => balance !== 0)
      .map(([name, balance]) => ({ name, balance }))
      .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));

    return list;
  }, [expenses]);

  const totalOwedToMe = balances.filter(b => b.balance > 0).reduce((sum, b) => sum + b.balance, 0);
  const totalIOwe = balances.filter(b => b.balance < 0).reduce((sum, b) => sum + Math.abs(b.balance), 0);

  return (
    <div className="glass-card flex flex-col h-full rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Users className="h-16 w-16 text-[var(--primary)]" />
      </div>

      <div className="mb-6 relative z-10">
        <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight">Friends & Settlements</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">Track shared expenses and balances.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="rounded-xl border border-[var(--success)]/20 bg-[var(--success)]/10 p-4 flex flex-col">
          <div className="flex items-center gap-1.5 text-[var(--success)] mb-1">
            <ArrowDownLeft className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">You Receive</span>
          </div>
          <p className="text-xl font-black text-[var(--success)] tracking-tight">₹{totalOwedToMe.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex flex-col">
          <div className="flex items-center gap-1.5 text-red-500 mb-1">
            <ArrowUpRight className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">You Owe</span>
          </div>
          <p className="text-xl font-black text-red-500 tracking-tight">₹{totalIOwe.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 rounded-xl bg-[var(--card-border)]/50 animate-pulse" />
            ))}
          </div>
        ) : balances.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center border-2 border-dashed border-[var(--card-border)] rounded-xl bg-[var(--background)]/30">
            <p className="text-sm font-medium text-[var(--text-muted)]">No active settlements.</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 opacity-70">Add a split expense to see it here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {balances.map((person, idx) => (
              <motion.div 
                key={person.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 hover:bg-[var(--card-border)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--ai-glow)] flex items-center justify-center text-white font-bold shadow-sm">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-[var(--foreground)]">{person.name}</span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`font-black tracking-tight ${person.balance > 0 ? "text-[var(--success)]" : "text-red-500"}`}>
                    ₹{Math.abs(person.balance).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                    {person.balance > 0 ? "Owes you" : "You owe"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
