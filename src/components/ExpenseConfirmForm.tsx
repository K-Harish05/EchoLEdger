"use client";

import { useState } from "react";
import type { ParsedExpense } from "@/lib/parser";
import { toast } from "sonner";

interface ExpenseConfirmFormProps {
  initialData: ParsedExpense;
  onSave: (data: ParsedExpense) => void;
  onCancel: () => void;
}

export default function ExpenseConfirmForm({ initialData, onSave, onCancel }: ExpenseConfirmFormProps) {
  const [formData, setFormData] = useState<ParsedExpense>(initialData);
  const [errors, setErrors] = useState<{ amount?: string; date?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSave = () => {
    const newErrors: { amount?: string; date?: string } = {};
    if (!formData.amount || isNaN(Number(formData.amount))) {
      newErrors.amount = "Valid amount is required";
      toast.error("Valid amount is required");
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
      toast.error("Date is required");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    toast.success("Expense saved to ledger!");
    onSave({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  return (
    <div className="mt-4 flex flex-col gap-5 rounded-xl border border-transparent bg-transparent p-0">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--foreground)]">Review & Confirm</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase border ${
          formData.confidence === "High" ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20" :
          formData.confidence === "Medium" ? "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20" :
          "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          Confidence: {formData.confidence}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Amount *</label>
          <input 
            name="amount" 
            type="number" 
            value={formData.amount || ""} 
            onChange={handleChange} 
            className={`w-full rounded-xl border bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)]/50 shadow-sm outline-none transition-all focus:ring-1 ${errors.amount ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500' : 'border-[var(--card-border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]'}`} 
            placeholder="e.g. 250" 
          />
          {errors.amount && <span className="text-[11px] font-bold text-red-500 mt-1">{errors.amount}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Date *</label>
          <input 
            name="date" 
            type="date" 
            value={formData.date || ""} 
            onChange={handleChange} 
            className={`w-full rounded-xl border bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)]/50 shadow-sm outline-none transition-all focus:ring-1 ${errors.date ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500' : 'border-[var(--card-border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]'}`} 
          />
          {errors.date && <span className="text-[11px] font-bold text-red-500 mt-1">{errors.date}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Category</label>
          <input 
            name="category" 
            value={formData.category || ""} 
            onChange={handleChange} 
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)]/50 shadow-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]" 
            placeholder="e.g. Food" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Vendor</label>
          <input 
            name="vendor" 
            value={formData.vendor || ""} 
            onChange={handleChange} 
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)]/50 shadow-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]" 
            placeholder="e.g. Swiggy" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Split With</label>
          <input 
            name="friendName" 
            value={formData.friendName || ""} 
            onChange={handleChange} 
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)]/50 shadow-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]" 
            placeholder="e.g. John" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Split Type</label>
          <select 
            name="splitType" 
            value={formData.splitType || "None"} 
            onChange={handleChange} 
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] shadow-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]" 
          >
            <option value="None">No Split</option>
            <option value="I owe">I owe them</option>
            <option value="Owes me">They owe me</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Notes (Optional)</label>
          <input 
            name="notes" 
            value={formData.notes || ""} 
            onChange={handleChange} 
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)]/50 shadow-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]" 
            placeholder="Any extra details?" 
          />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button 
          onClick={handleSave} 
          className="flex-1 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[var(--primary)]/20 transition-all hover:shadow-[var(--primary)]/40 hover:bg-[var(--primary)]/90 active:scale-[0.98]"
        >
          Save to Ledger
        </button>
        <button 
          onClick={onCancel} 
          className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-6 py-3 text-sm font-bold text-[var(--text-muted)] transition-all hover:bg-[var(--card-border)] hover:text-[var(--foreground)] active:scale-[0.98]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
