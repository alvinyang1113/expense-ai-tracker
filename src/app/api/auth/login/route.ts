import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { toSafeUser } from "@/lib/user";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email: string | undefined = body?.email?.trim().toLowerCase();
  const password: string | undefined = body?.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "email、password 皆為必填" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json({ error: "email 或密碼錯誤" }, { status: 401 });
  }

  await createSession({ userId: user._id.toString(), role: user.role });

  return NextResponse.json({ user: toSafeUser(user) });
}
