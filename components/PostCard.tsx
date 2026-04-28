"use client";

import Link from "next/link";
import { useState } from "react";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import { Post } from "@/types";

interface Props {
  post: Post;
  showDelete?: boolean;    // only shown on own profile
  onDelete?: () => void;   // callback to refresh after delete
}

export default function PostCard({ post, showDelete = false, onDelete }: Props) {
  const [showComments, setShowComments] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);

    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });

    if (res.ok) {
      onDelete?.(); // refresh the list
    } else {
      alert("Failed to delete post");
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">

      {/* Header: avatar + username + delete */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <img
            src={post.avatar || `https://ui-avatars.com/api/?name=${post.username}&background=random`}
            alt={post.username}
            className="w-9 h-9 rounded-full object-cover"
          />
          <Link href={`/profile/${post.user_id}`} className="font-semibold text-sm hover:underline">
            {post.username}
          </Link>
        </div>

        {/* Delete button — only for post owner */}
        {showDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-400 hover:text-red-600 text-sm disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "🗑 Delete"}
          </button>
        )}
      </div>

      {/* Media: image or video */}
      {/* Media: FULL COVER FIX */}
<div className="w-full aspect-square bg-black">
  {post.media_type === "video" ? (
    <video
      src={post.media_url}
      controls
      className="w-full h-full object-cover"
    />
  ) : (
    <img
      src={post.media_url}
      alt="post"
      className="w-full h-full object-cover"
    />
  )}
</div>

      {/* Actions: like + comment toggle */}
      <div className="p-3">
        <div className="flex items-center gap-4 mb-2">
          <LikeButton
            postId={post.id}
            initialLiked={post.is_liked}
            initialCount={Number(post.like_count)}
          />

          {/* Comment toggle button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition"
          >
            💬 <span>{Number(post.comment_count)} comments</span>
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm">
            <Link href={`/profile/${post.user_id}`} className="font-semibold hover:underline">
              {post.username}
            </Link>{" "}
            {post.caption}
          </p>
        )}

        {/* Date */}
        <p className="text-xs text-gray-400 mt-1">
          {new Date(post.created_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
          })}
        </p>

        {/* Comments section — shown when toggled */}
        {showComments && <CommentSection postId={post.id} />}
      </div>
    </div>
  );
}