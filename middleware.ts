import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // allow login & register pages
  if (
    req.nextUrl.pathname === "/login" ||
    req.nextUrl.pathname === "/register"
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/Home"], // ✅ protect home page
};

