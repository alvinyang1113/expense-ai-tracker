import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import Expense from "@/models/Expense";

type CategoryAgg = { _id: string; total: number; count: number };

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  const month = request.nextUrl.searchParams.get("month");
  const year = request.nextUrl.searchParams.get("year");

  if (year) {
    if (!/^\d{4}$/.test(year)) {
      return NextResponse.json(
        { error: "year query param must be in YYYY format" },
        { status: 400 }
      );
    }
    return NextResponse.json(await getYearStats(year));
  }

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: "month or year query param is required (YYYY-MM or YYYY)" },
      { status: 400 }
    );
  }

  return NextResponse.json(await getMonthStats(month));
}

async function getMonthStats(month: string) {
  const start = new Date(`${month}-01T00:00:00`);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

  await connectToDatabase();
  const byCategory: CategoryAgg[] = await Expense.aggregate([
    {
      $match: {
        type: "expense",
        occurredAt: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const total = byCategory.reduce((sum, item) => sum + item.total, 0);

  return {
    month,
    total,
    categories: byCategory.map((item) => ({
      category: item._id,
      total: item.total,
      count: item.count,
    })),
  };
}

async function getYearStats(year: string) {
  const start = new Date(`${year}-01-01T00:00:00`);
  const end = new Date(Number(year) + 1, 0, 1);

  await connectToDatabase();
  const [result] = await Expense.aggregate([
    {
      $match: {
        type: "expense",
        occurredAt: { $gte: start, $lt: end },
      },
    },
    {
      $facet: {
        byCategory: [
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          { $sort: { total: -1 } },
        ],
        byMonth: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$occurredAt" } },
              total: { $sum: "$amount" },
            },
          },
        ],
      },
    },
  ]);

  const byCategory: CategoryAgg[] = result?.byCategory ?? [];
  const byMonth: { _id: string; total: number }[] = result?.byMonth ?? [];
  const monthlyMap = new Map(byMonth.map((item) => [item._id, item.total]));

  const total = byCategory.reduce((sum, item) => sum + item.total, 0);

  const monthly = Array.from({ length: 12 }, (_, i) => {
    const key = `${year}-${String(i + 1).padStart(2, "0")}`;
    return { month: key, total: monthlyMap.get(key) ?? 0 };
  });

  return {
    year,
    total,
    categories: byCategory.map((item) => ({
      category: item._id,
      total: item.total,
      count: item.count,
    })),
    monthly,
  };
}
