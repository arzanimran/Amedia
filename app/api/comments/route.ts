import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// ===================== GET COMMENTS =====================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("post_id");

    if (!postId) {
      return NextResponse.json(
        { error: "post_id is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `
      SELECT 
        comments.*,
        users1.username,
        users1.avatar
      FROM comments
      JOIN users1 ON comments.user_id = users1.id
      WHERE comments.post_id = $1
      ORDER BY comments.created_at ASC
      `,
      [Number(postId)]
    );

    return NextResponse.json({
      comments: result.rows,
    });
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);

    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}

// ===================== POST COMMENT =====================
export async function POST(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Please login to comment" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const post_id = body?.post_id;
    const text = body?.text;

    if (!post_id) {
      return NextResponse.json(
        { error: "post_id is required" },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    // Insert comment
    const insertResult = await query(
      `
      INSERT INTO comments (user_id, post_id, text)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, Number(post_id), text.trim()]
    );

    const commentId = insertResult.rows[0].id;

    // Fetch comment with user info from users1
    const commentResult = await query(
      `
      SELECT 
        comments.*,
        users1.username,
        users1.avatar
      FROM comments
      JOIN users1 ON comments.user_id = users1.id
      WHERE comments.id = $1
      `,
      [commentId]
    );

    return NextResponse.json(
      { comment: commentResult.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST COMMENT ERROR:", error);

    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}

// ===================== DELETE COMMENT =====================
export async function DELETE(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const comment_id = body?.comment_id;

    if (!comment_id) {
      return NextResponse.json(
        { error: "comment_id is required" },
        { status: 400 }
      );
    }

    // Check if comment belongs to user
    const existing = await query(
      `
      SELECT * FROM comments
      WHERE id = $1 AND user_id = $2
      `,
      [comment_id, userId]
    );

    if (existing.rows.length === 0) {
      return NextResponse.json(
        { error: "Comment not found or not yours" },
        { status: 403 }
      );
    }

    // Delete comment
    await query(
      `
      DELETE FROM comments WHERE id = $1
      `,
      [comment_id]
    );

    return NextResponse.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);

    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}