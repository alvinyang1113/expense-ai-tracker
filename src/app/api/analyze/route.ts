import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import Expense from "@/models/Expense";

function buildSystemPrompt(today: string) {
  return `你是一個記帳助手。今天的日期是 ${today}（格式 YYYY-MM-DD）。
使用者會輸入一段關於花費或收入的中文或英文描述，請將其解析成結構化的 JSON，格式為：
{
  "amount": number,       // 金額，正數
  "currency": string,     // 幣別代碼，例如 "TWD"、"USD"，若無法判斷則用 "TWD"
  "category": string,     // 分類，例如 "餐飲"、"交通"、"娛樂"、"薪資" 等
  "description": string,  // 簡短描述
  "type": "expense" | "income", // 支出或收入
  "date": string           // 事件發生日期，格式 YYYY-MM-DD。若使用者提到「昨天」「上週五」等相對日期，請以今天的日期為基準換算；若沒有提到日期，使用今天的日期
}
只回傳 JSON，不要有其他文字。`;
}

interface AnalysisResult {
  amount: number;
  currency: string;
  category: string;
  description: string;
  type: "expense" | "income";
  date: string;
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  const body = await request.json();
  const text: string | undefined = body?.text;

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const today = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD in local time

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt(today) },
      { role: "user", content: text },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return NextResponse.json(
      { error: "OpenAI returned no content" },
      { status: 502 }
    );
  }

  let analysis: AnalysisResult;
  try {
    analysis = JSON.parse(content);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse OpenAI response", raw: content },
      { status: 502 }
    );
  }

  const occurredAt = analysis.date ? new Date(`${analysis.date}T12:00:00`) : new Date();

  await connectToDatabase();
  const expense = await Expense.create({
    userId: session.userId,
    rawText: text,
    amount: analysis.amount,
    currency: analysis.currency,
    category: analysis.category,
    description: analysis.description,
    type: analysis.type,
    occurredAt: Number.isNaN(occurredAt.getTime()) ? new Date() : occurredAt,
  });

  return NextResponse.json({ analysis, expense });
}
