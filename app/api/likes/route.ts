import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// POST /api/likes → toggle like/unlike
export async function POST(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Please login to like posts" }, { status: 401 });
    }

    const { post_id } = await request.json();

    // Check if already liked
    const existing = await query(
      "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, post_id]
    );

    if (existing.rows.length > 0) {
      // Unlike
      await query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [userId, post_id]);
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await query("INSERT INTO likes (user_id, post_id) VALUES ($1, $2)", [userId, post_id]);
      return NextResponse.json({ liked: true });
    }

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}