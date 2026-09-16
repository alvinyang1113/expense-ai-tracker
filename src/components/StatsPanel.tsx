import { categoryColor, categoryIcon } from "@/lib/category";
import { monthShortLabel } from "@/lib/date";
import type { CategoryStat, MonthlyStat } from "@/lib/types";

type Period = "month" | "year";

export function StatsPanel({
  period,
  onPeriodChange,
  title,
  total,
  categories,
  monthly,
  loading,
  onPrev,
  onNext,
  onSelectMonth,
}: {
  period: Period;
  onPeriodChange: (period: Period) => void;
  title: string;
  total: number;
  categories: CategoryStat[];
  monthly?: MonthlyStat[];
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelectMonth?: (month: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <div className="card-shadow flex items-center justify-center gap-1 rounded-full bg-surface p-1">
        {(["month", "year"] as const).map((p) => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-all ${
              period === p
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted"
            }`}
          >
            {p === "month" ? "月統計" : "年統計"}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          className="card-shadow flex h-8 w-8 items-center justify-center rounded-full bg-surface text-muted transition-transform active:scale-90"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <button
          onClick={onNext}
          className="card-shadow flex h-8 w-8 items-center justify-center rounded-full bg-surface text-muted transition-transform active:scale-90"
        >
          ›
        </button>
      </div>

      <div className="hero-shadow flex flex-col items-center gap-1 rounded-3xl bg-gradient-to-br from-primary to-primary-strong py-7 text-primary-foreground">
        <span className="text-sm opacity-80">
          {period === "month" ? "本月支出總計" : "本年支出總計"}
        </span>
        <span className="text-4xl font-bold tracking-tight">
          ${total.toLocaleString()}
        </span>
      </div>

      {period === "year" && monthly && (
        <MonthlyTrend monthly={monthly} onSelectMonth={onSelectMonth} />
      )}

      {loading ? (
        <div className="py-10 text-center text-sm text-muted">載入中...</div>
      ) : categories.length === 0 ? (
        <div className="card-shadow flex flex-col items-center gap-2 rounded-3xl bg-surface py-10 text-muted">
          <span className="text-3xl">📊</span>
          <span className="text-sm">
            {period === "month" ? "這個月還沒有支出紀錄" : "這一年還沒有支出紀錄"}
          </span>
        </div>
      ) : (
        <ul className="card-shadow flex flex-col gap-4 rounded-3xl bg-surface p-4">
          {categories.map((item) => {
            const percent = total > 0 ? Math.round((item.total / total) * 100) : 0;
            return (
              <li key={item.category} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold text-foreground">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-sm"
                      style={{ backgroundColor: `${categoryColor(item.category)}1f` }}
                    >
                      {categoryIcon(item.category)}
                    </span>
                    {item.category}
                    <span className="text-xs font-normal text-muted">
                      ({item.count} 筆)
                    </span>
                  </span>
                  <span className="text-muted">
                    ${item.total.toLocaleString()} · {percent}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: categoryColor(item.category),
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function MonthlyTrend({
  monthly,
  onSelectMonth,
}: {
  monthly: MonthlyStat[];
  onSelectMonth?: (month: string) => void;
}) {
  const max = Math.max(1, ...monthly.map((m) => m.total));

  return (
    <div className="card-shadow flex flex-col gap-2 rounded-3xl bg-surface p-4">
      <span className="text-sm font-medium text-muted">每月支出趨勢</span>
      <div className="flex h-28 items-end gap-1.5">
        {monthly.map((item) => (
          <button
            key={item.month}
            onClick={() => onSelectMonth?.(item.month)}
            className="flex flex-1 flex-col items-center gap-1"
            title={`${item.month}: $${item.total.toLocaleString()}`}
          >
            <div className="flex h-20 w-full items-end">
              <div
                className="w-full rounded-t-md bg-primary transition-all"
                style={{
                  height: `${Math.max(4, (item.total / max) * 100)}%`,
                  opacity: item.total === 0 ? 0.15 : 1,
                }}
              />
            </div>
            <span className="text-[10px] text-muted">
              {monthShortLabel(item.month)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
