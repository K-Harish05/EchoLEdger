"use client";

import DashboardLayout from "@/components/DashboardLayout";
import CategoryPieChart from "@/components/CategoryPieChart";
import DailySpendChart from "@/components/DailySpendChart";
import SmartInsights from "@/components/SmartInsights";
import AdvancedForecasting from "@/components/AdvancedForecasting";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col justify-between items-start gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Deep Analytics</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)] font-medium">Explore your financial trends, anomalies, and forecasting data.</p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Full width Insights */}
        <SmartInsights />

        {/* Charts Grid */}
        <section className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="min-h-[400px]">
             <CategoryPieChart />
          </div>
          <div className="min-h-[400px]">
             <DailySpendChart />
          </div>
        </section>
        
        {/* Advanced Forecasting Engine */}
        <AdvancedForecasting />
      </div>
    </DashboardLayout>
  );
}
