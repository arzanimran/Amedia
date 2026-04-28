"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import Loader from "@/components/Loader";
import { User, Post } from "@/types";

export default function ProfilePage() {
  const { id } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Get logged in user id from localStorage
  const [myId, setMyId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setMyId(parsed.id);
    }
    loadProfile();
  }, [id]);

  async function loadProfile() {
    const res = await fetch(`/api/users/${id}`);
    const data = await res.json();
    setUser(data.user);
    setPosts(data.posts || []);
    setLoading(false);
  }

  if (loading) return <Loader />;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  const isMyProfile = myId === user.id; // show delete only on own profile

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-6">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
            alt={user.username}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            {user.bio && <p className="text-gray-600 text-sm mt-1">{user.bio}</p>}
            <p className="text-gray-400 text-sm mt-2">
              <span className="font-semibold text-black">{posts.length}</span> posts
            </p>
          </div>
        </div>
      </div>

      {/* Posts Grid-style list */}
      <div className="flex flex-col gap-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No posts yet</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showDelete={isMyProfile}  // show delete button only on own profile
              onDelete={loadProfile}
            />
          ))
        )}
      </div>
    </div>
  );
}