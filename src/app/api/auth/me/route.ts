import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { toSafeUser } from "@/lib/user";
import User from "@/models/User";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  await connectToDatabase();
  const user = await User.findById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  return NextResponse.json({ user: toSafeUser(user) });
}
