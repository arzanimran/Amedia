import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    // ✅ Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    // ✅ Check if user already exists
    const existingUser = await query(
      "SELECT * FROM users1 WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // ✅ Insert user
    const result = await query(
      "INSERT INTO users1 (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashed]
    );

    return NextResponse.json({ user: result.rows[0] });

  } catch (error: any) {
    console.error("REGISTER ERROR:", error);

    // ✅ Handle unique constraint (extra safety)
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}