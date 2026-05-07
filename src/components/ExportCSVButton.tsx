"use client";

import { useState } from "react";
import { useExpenses } from "@/lib/useExpenses";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportCSVButton() {
  const { expenses } = useExpenses();
  const [isOpen, setIsOpen] = useState(false);

  const handleExportCSV = () => {
    if (!expenses || expenses.length === 0) {
      toast.error("No expenses to export!");
      return;
    }

    const headers = ["Date", "Vendor", "Category", "Amount", "Friend/Split", "Confidence", "Notes"];
    const csvRows = expenses.map(exp => {
      // @ts-ignore
      const friendData = exp.splitType && exp.splitType !== "None" ? `${exp.friendName} (${exp.splitType})` : "N/A";
      
      return [
        exp.date || "N/A",
        `"${(exp.vendor || "").replace(/"/g, '""')}"`,
        exp.category || "General",
        exp.amount,
        `"${friendData}"`,
        exp.confidence || "N/A",
        `"${(exp.notes || "").replace(/"/g, '""')}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `EchoLedger_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported Successfully");
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    if (!expenses || expenses.length === 0) {
      toast.error("No expenses to export!");
      return;
    }

    const doc = new jsPDF();
    doc.text("EchoLedger - Expense Ledger", 14, 15);
    
    const tableData = expenses.map(exp => {
      // @ts-ignore
      const friendData = exp.splitType && exp.splitType !== "None" ? `${exp.friendName} (${exp.splitType})` : "N/A";
      return [
        exp.date || "N/A",
        exp.vendor || "N/A",
        exp.category || "General",
        `${exp.amount}`,
        friendData
      ];
    });

    autoTable(doc, {
      head: [["Date", "Vendor", "Category", "Amount", "Split Info"]],
      body: tableData,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`EchoLedger_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF Exported Successfully");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-4 py-2 text-sm font-semibold text-[var(--primary)] shadow-sm transition-all hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 sm:mt-0"
      >
        <Download className="h-4 w-4 text-[var(--primary)]" />
        Export Data
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-2 shadow-lg z-50">
          <button 
            onClick={handleExportCSV}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--card-border)]"
          >
            <FileSpreadsheet className="h-4 w-4 text-green-500" />
            Download CSV
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--card-border)] mt-1"
          >
            <FileText className="h-4 w-4 text-red-500" />
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
