import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  // Clear the cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // expire immediately
    path: "/",
  });

  return response;
}