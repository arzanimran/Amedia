import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

// DELETE /api/posts/[id]
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ FIX (important)

    const userId = getUserIdFromRequest(request);

    console.log("Logged userId:", userId); // 🔍 DEBUG

    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const postResult = await query(
      "SELECT * FROM posts WHERE id = $1",
      [id]
    );

    const post = postResult.rows[0];

    console.log("Post:", post); // 🔍 DEBUG

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // ⚠️ IMPORTANT: ensure same type (number vs string)
    if (Number(post.user_id) !== Number(userId)) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      );
    }

    await query("DELETE FROM posts WHERE id = $1", [id]);

    return NextResponse.json({ message: "Deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}