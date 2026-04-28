import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import { uploadMedia } from "@/lib/cloudinary";

// GET /api/posts → all posts for feed
export async function GET(request: Request) {
  try {
    const currentUserId = getUserIdFromRequest(request) || 0;

    const result = await query(
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
       GROUP BY posts.id, users1.username, users1.avatar
       ORDER BY posts.created_at DESC`,
      [currentUserId]
    );

    return NextResponse.json({ posts: result.rows });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/posts → create new post (image or video)
export async function POST(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const formData = await request.formData();
    const caption = (formData.get("caption") as string) || "";
    const mediaFile = formData.get("media") as File;

    if (!mediaFile) {
      return NextResponse.json({ error: "Please select an image or video" }, { status: 400 });
    }

    // Convert file to base64 for cloudinary
    const bytes = await mediaFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${mediaFile.type};base64,${buffer.toString("base64")}`;

    // Upload to cloudinary (auto-detects image vs video)
    const { url, type } = await uploadMedia(base64);

    // Save to database
    const result = await query(
      "INSERT INTO posts (user_id, media_url, media_type, caption) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, url, type, caption]
    );

    return NextResponse.json({ post: result.rows[0] }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}