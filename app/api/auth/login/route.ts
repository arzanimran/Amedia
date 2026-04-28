import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // ✅ 1. Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ 2. Find user
    const result = await query(
      "SELECT * FROM users1 WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    // ✅ 3. Check user exists
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ 5. Create token
    const token = jwt.sign(
      { userId: user.id },
      SECRET,
      { expiresIn: "7d" }
    );

    // ✅ 6. Response
    const response = NextResponse.json({
      message: "Logged in!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || "",
      },
    });

    // ✅ 7. Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
      secure: false, // 👉 true when deploying (HTTPS)
    });

    return response;

  } catch (error) {
    console.error("LOGIN ERROR:", error); // 🔥 IMPORTANT for debugging

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}