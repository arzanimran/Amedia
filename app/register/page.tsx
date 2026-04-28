"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    router.push("/login");
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <div className="bg-white border p-8 rounded-xl w-full max-w-sm shadow-sm">
        <h1 className="text-3xl font-bold text-center mb-2">InstaClone</h1>
        <p className="text-center text-gray-400 text-sm mb-6">Sign up to see photos & videos</p>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-lg p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            minLength={6}
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white rounded-lg p-3 font-semibold hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 font-semibold">Log in</a>
        </p>
      </div>
    </div>
  );
}