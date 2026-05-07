"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ExportCSVButton from "@/components/ExportCSVButton";
import { useAuth } from "@/components/AuthGate";
import { useTheme } from "@/components/ThemeProvider";
import { useSettings } from "@/lib/useSettings";
import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, Wallet, Palette } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, currencySymbol, setCurrency } = useSettings();
  
  const [budget, setBudget] = useState("50000");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("monthlyBudget");
    if (saved) setBudget(saved);
  }, []);

  const saveSettings = () => {
    localStorage.setItem("monthlyBudget", budget.toString());
    alert("Settings saved successfully!");
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Settings</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)] font-medium">Manage your account, preferences, and AI configuration.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        
        {/* Sidebar Nav (Visual) */}
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 p-3 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold border border-[var(--primary)]/20">
            <User className="h-5 w-5" /> Account Profile
          </button>
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] font-semibold transition-colors">
            <Wallet className="h-5 w-5" /> Budget & Currency
          </button>
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] font-semibold transition-colors">
            <Palette className="h-5 w-5" /> Appearance
          </button>
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] font-semibold transition-colors">
            <Bell className="h-5 w-5" /> Notifications
          </button>
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] font-semibold transition-colors">
            <Shield className="h-5 w-5" /> Privacy & Data
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          
          <motion.section 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-[var(--foreground)] border-b border-[var(--card-border)] pb-3 mb-6">Financial Preferences</h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Monthly Budget limit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">₹</span>
                  <input 
                    type="number" 
                    value={budget} 
                    onChange={e => setBudget(e.target.value)}
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] py-3 pl-8 pr-4 text-sm font-bold text-[var(--foreground)] shadow-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Default Currency</label>
                <select 
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--foreground)] shadow-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={saveSettings}
                className="rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary)]/90 active:scale-95"
              >
                Save Preferences
              </button>
            </div>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-[var(--foreground)] border-b border-[var(--card-border)] pb-3 mb-6">Appearance</h3>
            <div className="flex items-center justify-between">
               <div>
                 <p className="font-bold text-[var(--foreground)]">Theme Mode</p>
                 <p className="text-xs text-[var(--text-muted)] mt-1">Switch between light and dark styling.</p>
               </div>
               <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between w-24 rounded-full border border-[var(--card-border)] bg-[var(--background)] px-2 py-1.5 transition-all"
               >
                  <div className={`w-full h-5 rounded-full p-0.5 transition-colors flex ${theme === "dark" ? "bg-[var(--primary)] justify-end" : "bg-slate-300 justify-start"}`}>
                    <motion.div 
                      layout 
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </div>
               </button>
            </div>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="glass-card rounded-2xl p-6 border-red-500/20"
          >
            <h3 className="text-lg font-bold text-red-500 border-b border-red-500/20 pb-3 mb-6">Danger Zone</h3>
            
            <div className="flex items-center justify-between py-2">
               <div>
                 <p className="font-bold text-[var(--foreground)]">Export All Data</p>
                 <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm">Download a CSV file containing your entire ledger history.</p>
               </div>
               <ExportCSVButton />
            </div>

            <div className="flex items-center justify-between py-4 border-t border-[var(--card-border)] mt-4">
               <div>
                 <p className="font-bold text-[var(--foreground)]">Sign Out</p>
                 <p className="text-xs text-[var(--text-muted)] mt-1">End your current session.</p>
               </div>
               <button 
                 onClick={logout}
                 className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-6 py-2.5 text-sm font-bold text-[var(--foreground)] transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95"
               >
                 Log Out
               </button>
            </div>
          </motion.section>

        </div>
      </div>
    </DashboardLayout>
  );
}
