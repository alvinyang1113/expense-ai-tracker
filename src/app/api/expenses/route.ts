import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import Expense from "@/models/Expense";
import "@/models/User";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  const date = request.nextUrl.searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "date query param is required in YYYY-MM-DD format" },
      { status: 400 }
    );
  }

  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T23:59:59.999`);

  await connectToDatabase();
  const docs = await Expense.find({
    occurredAt: { $gte: start, $lte: end },
  })
    .sort({ occurredAt: -1 })
    .populate("userId", "name")
    .lean();

  const expenses = docs.map((doc) => {
    const recorder = doc.userId as unknown as { _id: unknown; name: string } | null;
    return {
      _id: doc._id.toString(),
      rawText: doc.rawText,
      amount: doc.amount,
      currency: doc.currency,
      category: doc.category,
      description: doc.description,
      type: doc.type,
      occurredAt: doc.occurredAt,
      createdAt: doc.createdAt,
      recordedBy: recorder
        ? { id: recorder._id!.toString(), name: recorder.name }
        : null,
    };
  });

  return NextResponse.json({ expenses });
}
