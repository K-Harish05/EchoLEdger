"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface SettingsContextType {
  currency: string;
  currencySymbol: string;
  setCurrency: (c: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState("INR");
  const [currencySymbol, setCurrencySymbol] = useState("₹");

  useEffect(() => {
    const saved = localStorage.getItem("appCurrency");
    if (saved) {
      setCurrencyState(saved);
      updateSymbol(saved);
    }
  }, []);

  const updateSymbol = (c: string) => {
    switch (c) {
      case "USD": setCurrencySymbol("$"); break;
      case "EUR": setCurrencySymbol("€"); break;
      case "GBP": setCurrencySymbol("£"); break;
      default: setCurrencySymbol("₹"); break;
    }
  };

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    updateSymbol(c);
    localStorage.setItem("appCurrency", c);
  };

  return (
    <SettingsContext.Provider value={{ currency, currencySymbol, setCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    return { currency: "INR", currencySymbol: "₹", setCurrency: () => {} };
  }
  return context;
}
