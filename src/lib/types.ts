export type ExpenseRecord = {
  _id: string;
  rawText: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  type: "expense" | "income";
  occurredAt: string;
  createdAt: string;
  recordedBy: { id: string; name: string } | null;
};

export type CategoryStat = {
  category: string;
  total: number;
  count: number;
};

export type MonthlyStat = {
  month: string;
  total: number;
};
