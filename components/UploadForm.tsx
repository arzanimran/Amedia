"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadForm() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [previewType, setPreviewType] = useState<"image" | "video">("image");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleMediaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));

      if (file.type.startsWith("video/")) {
        setPreviewType("video");
      } else {
        setPreviewType("image");
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!media) {
      setError("Please select an image or video");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("media", media);
    formData.append("caption", caption);

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border p-6 space-y-5">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center">Create Post</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Upload Box */}
          <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-400 transition">
            <span className="text-3xl mb-2">📤</span>
            <p className="text-sm text-gray-500">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Image or Video
            </p>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="hidden"
            />
          </label>

          {/* ✅ FIXED PREVIEW (FULL COVER) */}
          {preview && (
            <div className="w-full aspect-square rounded-xl overflow-hidden border shadow-sm">
              {previewType === "video" ? (
                <video
                  src={preview}
                  controls
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {/* Caption */}
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? "Uploading..." : "Share Post 🚀"}
          </button>

        </form>
      </div>
    </div>
  );
}