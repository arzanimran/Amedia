"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import Loader from "@/components/Loader";
import { Post } from "@/types";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="flex justify-center px-4 mt-6">
      <div className="w-full max-w-xl flex flex-col gap-6">

        {posts.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-5xl mb-3">📸</p>
            <p className="text-lg">No posts yet</p>
            <p className="text-sm">Start sharing your moments 🚀</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={fetchPosts}
            />
          ))
        )}

      </div>
    </div>
  );
}