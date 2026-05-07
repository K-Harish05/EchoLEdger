export interface ExpenseDBModel {
  id?: string;
  userId: string;
  amount: number;
  category: string;
  vendor: string;
  date: string;
  notes: string;
  confidence: string;
  createdAt: number;
}
