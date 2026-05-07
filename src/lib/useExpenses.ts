import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthGate";
import type { ExpenseDBModel } from "@/types/expense";

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseDBModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: ExpenseDBModel[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as ExpenseDBModel);
      });
      
      // Sort client-side to prevent Firestore composite index requirements
      data.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      
      setExpenses(data);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Firestore Error listening to expenses:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { expenses, loading, error };
}
