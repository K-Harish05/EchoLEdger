/**
 * Handles regex-based pre-parsing to reliably extract the amount 
 * from common Indian expense phrases (like "250rs", "rs 250").
 */
export function preParseAmount(text: string): number | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:rs|rupee|rupees|inr|₹)|(?:rs|rupee|rupees|inr|₹)\s*(\d+(?:\.\d+)?)/i);
  if (match) {
    return parseFloat(match[1] || match[2]);
  }
  
  // Look for standalone numbers if no currency identifier is found
  const plainMatch = text.match(/\b(\d+(?:\.\d+)?)\b/);
  if (plainMatch) {
    return parseFloat(plainMatch[1]);
  }
  
  return null;
}

export interface ParsedExpense {
  amount: number | string | null;
  category: string | null;
  vendor: string | null;
  date: string | null;
  notes: string | null;
  confidence: string | null;
  friendName: string | null;
  splitType: string | null;
  [key: string]: string | number | null | undefined;
}

/**
 * Normalizes invalid or missing data points returned by the AI
 * so that the UI does not crash and handles known mapping fallbacks.
 */
export function validateAndCleanExpense(parsed: ParsedExpense) {
  // If the date is missing or invalid, generate today's date
  if (!parsed.date || !/^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) {
    parsed.date = new Date().toISOString().split("T")[0];
  }
  
  // Fallback map: Vendor -> Category
  if (!parsed.category && parsed.vendor) {
    const v = parsed.vendor.toLowerCase();
    if (v.includes("swiggy") || v.includes("zomato") || v.includes("mcdonald") || v.includes("food") || v.includes("dinner")) {
      parsed.category = "Food";
    } else if (v.includes("uber") || v.includes("ola") || v.includes("petrol") || v.includes("train") || v.includes("bus") || v.includes("auto")) {
      parsed.category = "Transport";
    } else if (v.includes("amazon") || v.includes("flipkart") || v.includes("myntra") || v.includes("zudio")) {
      parsed.category = "Shopping";
    } else if (v.includes("netflix") || v.includes("spotify") || v.includes("movie") || v.includes("cinema")) {
      parsed.category = "Entertainment";
    } else {
      parsed.category = "General";
    }
  } else if (!parsed.category) {
    parsed.category = "General";
  }

  // Assign sensible defaults for empty fields to prevent undefined errors in form fields
  if (parsed.amount === null) parsed.amount = "";
  if (parsed.vendor === null) parsed.vendor = "";
  if (parsed.notes === null) parsed.notes = "";
  if (!parsed.confidence) parsed.confidence = "Low";
  if (!parsed.friendName) parsed.friendName = "";
  if (!parsed.splitType) parsed.splitType = "None";

  return parsed;
}
