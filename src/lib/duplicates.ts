import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Checks Firestore to see if an expense with the exact same
 * Amount, Vendor, and Date already exists for the User.
 */
export async function checkForDuplicateExpense(
  userId: string,
  amount: number,
  vendor: string,
  date: string
): Promise<boolean> {
  // If baseline required matching isn't met, assume no duplicate
  if (!amount || !vendor || !date) return false;

  try {
    const expensesRef = collection(db, "expenses");
    
    // Note: Multiple equality operators (`==`) do not require
    // a composite index on Firestore out-of-the-box.
    const duplicateQuery = query(
      expensesRef,
      where("userId", "==", userId),
      where("amount", "==", amount),
      where("vendor", "==", vendor),
      where("date", "==", date)
    );

    const snapshot = await getDocs(duplicateQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error("Duplicate check failed (ignoring block):", error);
    // Fail-open: if the query fails, let the user save. 
    // They shouldn't be fully blocked from using the app if index routing fails.
    return false;
  }
}
