import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// GET /api/users/[id]
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ IMPORTANT FIX

    const currentUserId = getUserIdFromRequest(request) || 0;

    // ✅ get user
    const userResult = await query(
      "SELECT id, username, email, avatar, bio, created_at FROM users1 WHERE id = $1",
      [id]
    );

    const user = userResult.rows[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ get posts
    const postsResult = await query(
      `SELECT
        posts.*,
        users1.username,
        users1.avatar,
        COUNT(DISTINCT likes.id) AS like_count,
        COUNT(DISTINCT comments.id) AS comment_count,
        BOOL_OR(likes.user_id = $1) AS is_liked
       FROM posts
       JOIN users1 ON posts.user_id = users1.id
       LEFT JOIN likes ON likes.post_id = posts.id
       LEFT JOIN comments ON comments.post_id = posts.id
       WHERE posts.user_id = $2
       GROUP BY posts.id, users1.username, users1.avatar
       ORDER BY posts.created_at DESC`,
      [currentUserId, id]
    );

    return NextResponse.json({
      user,
      posts: postsResult.rows,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}