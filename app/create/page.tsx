"use client";

import UploadForm from "@/components/UploadForm";

export default function CreatePage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4 text-center">Create New Post</h1>
      <UploadForm />
    </div>
  );
}