import { categoryColor, categoryIcon } from "@/lib/category";
import type { ExpenseRecord } from "@/lib/types";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ExpenseList({
  expenses,
  loading,
}: {
  expenses: ExpenseRecord[];
  loading: boolean;
}) {
  const dayTotal = expenses.reduce(
    (sum, e) => sum + (e.type === "expense" ? e.amount : -e.amount),
    0
  );

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16 text-sm text-muted">
        載入中...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      <div className="hero-shadow flex items-center justify-between rounded-3xl bg-gradient-to-br from-primary to-primary-strong px-5 py-4 text-primary-foreground">
        <span className="text-sm font-medium opacity-80">當日支出</span>
        <span className="text-2xl font-bold tracking-tight">
          ${dayTotal.toLocaleString()}
        </span>
      </div>

      {expenses.length === 0 ? (
        <div className="card-shadow flex flex-col items-center gap-2 rounded-3xl bg-surface py-10 text-muted">
          <span className="text-3xl">🧾</span>
          <span className="text-sm">這天還沒有記帳紀錄</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {expenses.map((expense) => (
            <li
              key={expense._id}
              className="card-shadow flex items-center gap-3 rounded-2xl bg-surface p-3"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl"
                style={{ backgroundColor: `${categoryColor(expense.category)}1f` }}
              >
                {categoryIcon(expense.category)}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-foreground">
                  {expense.description || expense.category}
                </span>
                <span className="text-xs text-muted">
                  {expense.category} · {formatTime(expense.occurredAt)}
                  {expense.recordedBy && ` · ${expense.recordedBy.name}`}
                </span>
              </div>
              <span
                className={`shrink-0 font-semibold tabular-nums ${
                  expense.type === "income" ? "text-success" : "text-foreground"
                }`}
              >
                {expense.type === "income" ? "+" : "-"}
                {expense.amount.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
