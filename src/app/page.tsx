"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Composer } from "@/components/Composer";
import { DateStrip } from "@/components/DateStrip";
import { ExpenseList } from "@/components/ExpenseList";
import { StatsPanel } from "@/components/StatsPanel";
import {
  addMonths,
  addYears,
  formatMonthTitle,
  toDateKey,
  toMonthKey,
} from "@/lib/date";
import type { CategoryStat, ExpenseRecord, MonthlyStat } from "@/lib/types";

type Tab = "record" | "stats";
type StatsPeriod = "month" | "year";
type CurrentUser = { id: string; email: string; name: string; role: string };

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("record");
  const [user, setUser] = useState<CurrentUser | null>(null);

  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(true);

  const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>("month");
  const [statsMonth, setStatsMonth] = useState(() => toMonthKey(new Date()));
  const [statsYear, setStatsYear] = useState(() => toMonthKey(new Date()).slice(0, 4));
  const [statsTotal, setStatsTotal] = useState(0);
  const [statsCategories, setStatsCategories] = useState<CategoryStat[]>([]);
  const [statsMonthly, setStatsMonthly] = useState<MonthlyStat[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadExpenses = useCallback(async (date: string) => {
    setExpensesLoading(true);
    try {
      const res = await fetch(`/api/expenses?date=${date}`);
      const data = await res.json();
      setExpenses(data.expenses ?? []);
    } finally {
      setExpensesLoading(false);
    }
  }, []);

  const loadMonthStats = useCallback(async (month: string) => {
    setStatsLoading(true);
    try {
      const res = await fetch(`/api/expenses/stats?month=${month}`);
      const data = await res.json();
      setStatsTotal(data.total ?? 0);
      setStatsCategories(data.categories ?? []);
      setStatsMonthly([]);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadYearStats = useCallback(async (year: string) => {
    setStatsLoading(true);
    try {
      const res = await fetch(`/api/expenses/stats?year=${year}`);
      const data = await res.json();
      setStatsTotal(data.total ?? 0);
      setStatsCategories(data.categories ?? []);
      setStatsMonthly(data.monthly ?? []);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) {
          router.replace("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    loadExpenses(selectedDate);
  }, [selectedDate, loadExpenses]);

  useEffect(() => {
    if (statsPeriod === "month") {
      loadMonthStats(statsMonth);
    } else {
      loadYearStats(statsYear);
    }
  }, [statsPeriod, statsMonth, statsYear, loadMonthStats, loadYearStats]);

  async function handleSubmit(text: string) {
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "分析失敗");
      }

      const occurredDate: string = toDateKey(new Date(data.expense.occurredAt));
      setSelectedDate(occurredDate);
      await loadExpenses(occurredDate);
      if (statsPeriod === "month") {
        await loadMonthStats(statsMonth);
      } else {
        await loadYearStats(statsYear);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤");
    }
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between bg-surface px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-sm hero-shadow">
            🧾
          </span>
          <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">
            Alvin的AI家庭記帳本
          </h1>
        </div>
        {user && (
          <div className="flex shrink-0 items-center gap-2">
            <span className="max-w-16 truncate text-sm font-medium text-muted">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="shrink-0 rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-muted transition-colors active:bg-border"
            >
              登出
            </button>
          </div>
        )}
      </header>

      <main className="flex flex-1 flex-col overflow-y-auto pt-3">
        {tab === "record" ? (
          <>
            <DateStrip
              monthKey={toMonthKey(new Date(`${selectedDate}T12:00:00`))}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
            <div className="mt-3">
              <ExpenseList expenses={expenses} loading={expensesLoading} />
            </div>
          </>
        ) : (
          <StatsPanel
            period={statsPeriod}
            onPeriodChange={setStatsPeriod}
            title={
              statsPeriod === "month"
                ? formatMonthTitle(statsMonth)
                : `${statsYear} 年`
            }
            total={statsTotal}
            categories={statsCategories}
            monthly={statsMonthly}
            loading={statsLoading}
            onPrev={() =>
              statsPeriod === "month"
                ? setStatsMonth((m) => addMonths(m, -1))
                : setStatsYear((y) => addYears(y, -1))
            }
            onNext={() =>
              statsPeriod === "month"
                ? setStatsMonth((m) => addMonths(m, 1))
                : setStatsYear((y) => addYears(y, 1))
            }
            onSelectMonth={(month) => {
              setStatsMonth(month);
              setStatsPeriod("month");
            }}
          />
        )}

        {error && (
          <p className="mx-4 mb-3 rounded-2xl bg-danger/10 p-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}
      </main>

      {tab === "record" && <Composer onSubmit={handleSubmit} />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
