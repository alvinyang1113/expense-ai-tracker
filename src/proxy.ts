import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

const protectedRoutes = ["/"];
const publicRoutes = ["/login", "/register"];

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const authed = await hasValidSession(request);

  if (isProtectedRoute && !authed) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isPublicRoute && authed) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
