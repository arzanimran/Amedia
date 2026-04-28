"use client";

import { useState } from "react";

interface Props {
  postId: number;
  initialLiked: boolean;
  initialCount: number;
}

export default function LikeButton({ postId, initialLiked, initialCount }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  async function handleLike() {
    // Optimistic update — update UI first, confirm with server
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((prev) => (newLiked ? prev + 1 : prev - 1));

    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId }),
    });

    // Revert if server failed
    if (!res.ok) {
      setLiked(liked);
      setCount(count);
    }
  }

  return (
    <button onClick={handleLike} className="flex items-center gap-1 text-sm hover:scale-110 transition-transform">
      <span className={`text-xl transition-all ${liked ? "scale-125" : "scale-100"}`}>
        {liked ? "❤️" : "🤍"}
      </span>
      <span className="font-semibold">{count}</span>
    </button>
  );
}