"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
} from "motion/react";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import { Post } from "@/types";

interface Props {
  post: Post;
  showDelete?: boolean;
  onDelete?: () => void;
}

export default function PostCard({ post, showDelete = false, onDelete }: Props) {
  const [showComments, setShowComments] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const lastTap = useRef<number>(0);

  // ── Scroll-triggered animation ──────────────────────────────────────
  // `once: false` means the animation re-triggers every time the card
  // enters the viewport (scrolling down OR back up).
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, {
    margin: "-80px 0px",   // trigger 80px before the card fully enters
    once: false,           // re-animate on scroll back up too
  });

  // ── Delete ───────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (res.ok) {
      onDelete?.();
    } else {
      alert("Failed to delete post");
      setDeleting(false);
    }
  }

  // ── Double-tap heart ─────────────────────────────────────────────────
  function handleMediaTap() {
    const now = Date.now();
    if (now - lastTap.current < 320) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 900);
    }
    lastTap.current = now;
  }

  return (
    // Outer wrapper captures the ref for InView without wrapping motion div
    <div ref={cardRef}>
      <motion.div
        // ── Scroll animation: slide up + fade in ──────────────────────
        animate={
          isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 48, scale: 0.97 }
        }
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],   // custom spring-like ease
        }}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
      >

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <motion.img
              src={
                post.avatar ||
                `https://ui-avatars.com/api/?name=${post.username}&background=random`
              }
              alt={post.username}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-300 ring-offset-1 cursor-pointer"
            />
            <Link
              href={`/profile/${post.user_id}`}
              className="font-semibold text-sm text-gray-900 hover:underline"
            >
              {post.username}
            </Link>
          </div>

          <AnimatePresence>
            {showDelete && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-400 hover:text-red-600 text-sm disabled:opacity-40 transition-colors"
              >
                {deleting ? (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 0.9 }}
                  >
                    Deleting...
                  </motion.span>
                ) : (
                  "Delete"
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Media: FULL COVER FIX ───────────────────────────────── */}
        {/*
            The container is `relative` + `overflow-hidden` with an explicit
            aspect-ratio. The img/video is `absolute inset-0 w-full h-full`
            so it ALWAYS fills the box edge-to-edge with object-cover.
            No gap, no letterbox, no whitespace.
        */}
        <div
          className="relative w-full overflow-hidden bg-black"
          style={{ aspectRatio: "1 / 1" }}
          onClick={handleMediaTap}
        >
          {post.media_type === "video" ? (
            <video
              src={post.media_url}
              controls
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <motion.img
              src={post.media_url}
              alt="post"
              className="absolute inset-0 w-full h-full object-cover"
              // subtle Ken-Burns: zoomed out when off-screen, normal when in view
              animate={isInView ? { scale: 1 } : { scale: 1.06 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}

          {/* Double-tap heart burst */}
          <AnimatePresence>
            {heartBurst && (
              <motion.span
                key="heart"
                className="absolute inset-0 flex items-center justify-center pointer-events-none text-7xl"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.3, 1.1, 0.9] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, times: [0, 0.25, 0.6, 1] }}
              >
                heart
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* ── Actions + Caption ────────────────────────────────────── */}
        <div className="px-3 pt-2.5 pb-3">

          {/* Like + Comment row */}
          <div className="flex items-center gap-4 mb-2">
            <LikeButton
              postId={post.id}
              initialLiked={post.is_liked ?? false}
              initialCount={Number(post.like_count)}
            />

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => setShowComments((v) => !v)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <motion.span
                animate={showComments ? { rotate: [-10, 10, -6, 0] } : { rotate: 0 }}
                transition={{ duration: 0.35 }}
              >
                Comment icon
              </motion.span>
              <span>{Number(post.comment_count)} comments</span>
            </motion.button>
          </div>

          {/* Caption */}
          {post.caption && (
            <p className="text-sm text-gray-800 leading-snug mb-1">
              <Link
                href={`/profile/${post.user_id}`}
                className="font-semibold hover:underline mr-1"
              >
                {post.username}
              </Link>
              {post.caption}
            </p>
          )}

          {/* Date */}
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          {/* Comments accordion */}
          <AnimatePresence initial={false}>
            {showComments && (
              <motion.div
                key="comments"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="pt-3 border-t border-gray-100 mt-2">
                  <CommentSection postId={post.id} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}