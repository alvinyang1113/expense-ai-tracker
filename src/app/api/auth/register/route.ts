import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { toSafeUser } from "@/lib/user";
import User from "@/models/User";

const INVITE_CODE = "coding";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email: string | undefined = body?.email?.trim().toLowerCase();
  const password: string | undefined = body?.password;
  const name: string | undefined = body?.name?.trim();
  const inviteCode: string | undefined = body?.inviteCode;

  if (!email || !password || !name || !inviteCode) {
    return NextResponse.json(
      { error: "email、password、name、驗證碼皆為必填" },
      { status: 400 }
    );
  }

  if (inviteCode !== INVITE_CODE) {
    return NextResponse.json({ error: "驗證碼錯誤" }, { status: 403 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "密碼至少需要 6 個字元" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "此 email 已被註冊" }, { status: 409 });
  }

  const user = await User.create({
    email,
    password: await hashPassword(password),
    name,
  });

  await createSession({ userId: user._id.toString(), role: user.role });

  return NextResponse.json({ user: toSafeUser(user) }, { status: 201 });
}
