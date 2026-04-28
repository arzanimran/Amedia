"use client";

import { useEffect, useState } from "react";
import { Comment } from "@/types";
import Link from "next/link";

interface Props {
  postId: number;
}

export default function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // Get current user id from localStorage
  const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const myId = stored ? JSON.parse(stored).id : null;

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function loadComments() {
    const res = await fetch(`/api/comments?post_id=${postId}`);
    const data = await res.json();
    setComments(data.comments || []);
    setLoading(false);
  }

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setPosting(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, text }),
    });

    const data = await res.json();
    setPosting(false);

    if (res.ok) {
      // Add new comment to top of list instantly
      setComments((prev) => [...prev, data.comment]);
      setText(""); // clear input
    } else {
      alert(data.error || "Failed to post comment");
    }
  }

  async function handleDeleteComment(commentId: number) {
    const res = await fetch("/api/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment_id: commentId }),
    });

    if (res.ok) {
      // Remove from UI
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  }

  return (
    <div className="mt-3 border-t pt-3">

      {/* Comment List */}
      {loading ? (
        <p className="text-xs text-gray-400">Loading comments...</p>
      ) : (
        <div className="flex flex-col gap-2 mb-3 max-h-48 overflow-y-auto">
          {comments.length === 0 && (
            <p className="text-xs text-gray-400">No comments yet. Be first!</p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2 group">
              <img
                src={comment.avatar || `https://ui-avatars.com/api/?name=${comment.username}&background=random`}
                alt={comment.username}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-xs mr-1">
                  <Link href={`/profile/${comment.user_id}`} className="hover:underline">
                    {comment.username}
                  </Link>
                </span>
                <span className="text-xs break-words">{comment.text}</span>
              </div>

              {/* Delete button — only for comment owner */}
              {myId === comment.user_id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Input */}
      <form onSubmit={handlePostComment} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 text-sm border rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          disabled={posting || !text.trim()}
          className="text-sm text-blue-500 font-semibold disabled:opacity-40 hover:text-blue-700 transition"
        >
          {posting ? "..." : "Post"}
        </button>
      </form>
    </div>
  );
}