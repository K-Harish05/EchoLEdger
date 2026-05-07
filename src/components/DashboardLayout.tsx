"use client";

import { Home, PieChart, Receipt, Settings, LogOut, Sparkles, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "./AuthGate";
import { useTheme } from "./ThemeProvider";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Receipt, label: "Transactions", href: "/transactions" },
    { icon: PieChart, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-transparent transition-colors duration-300">
      {/* Sidebar */}
      <aside className="glass-panel hidden w-[260px] flex-col justify-between py-6 sm:flex fixed h-full z-20">
        <div>
          <div className="flex items-center gap-3 px-6 pb-8 border-b border-[var(--card-border)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/20 transition-all duration-300">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--foreground)] to-[var(--text-muted)] bg-clip-text text-transparent">EchoLedger</h1>
          </div>
          
          <nav className="mt-6 flex flex-col gap-1.5 px-4">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link href={item.href} key={idx}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      isActive 
                        ? "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                        : "text-[var(--text-muted)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)] border border-transparent"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? "text-[var(--primary)]" : "opacity-70"}`} />
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-4 flex flex-col gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm font-medium text-[var(--text-muted)] transition-all hover:text-[var(--foreground)] hover:border-[var(--primary)]/50"
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${theme === "dark" ? "bg-[var(--primary)]" : "bg-slate-300"}`}>
              <motion.div 
                layout 
                className="w-3 h-3 bg-white rounded-full shadow-sm"
                animate={{ x: theme === "dark" ? 16 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </button>

          <div className="glass-card rounded-xl p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold shadow-md shadow-[var(--primary)]/20">
              {user?.displayName?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-[var(--foreground)] truncate">{user?.displayName || "User"}</p>
              <p className="text-[11px] font-medium text-[var(--primary)] uppercase tracking-wider truncate">Pro Plan</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] bg-transparent px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)] transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 sm:ml-[260px] relative transition-all duration-300">
        {/* Mobile Header */}
        <header className="glass-card sticky top-0 z-30 flex items-center justify-between px-4 py-4 sm:hidden border-b border-[var(--card-border)] border-r-0 border-l-0 border-t-0 rounded-none shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] shadow-md shadow-[var(--primary)]/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-[var(--foreground)]">EchoLedger</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button onClick={logout} className="text-[var(--text-muted)] hover:text-red-500 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-xs font-medium text-[var(--text-muted)] border-t border-[var(--card-border)] bg-[var(--background)]/50 backdrop-blur-sm">
          built by <span className="font-bold text-[var(--foreground)] tracking-wide">K S V HARISH</span>
        </footer>
      </main>
    </div>
  );
}
