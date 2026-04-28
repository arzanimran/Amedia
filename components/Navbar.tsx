"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored && stored !== "undefined") {
      setUser(JSON.parse(stored));
    }
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
    router.refresh();
    setMenuOpen(false);
  }

  const linkClass =
    "px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 transition";

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/60">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* BRAND */}
        <Link href="/" className="text-2xl font-black tracking-tight text-black">
          Amedia
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden sm:flex items-center gap-5">

          <Link href="/" className={linkClass}>
            🏠 Feed
          </Link>

          {user ? (
            <>
              <Link
                href="/create"
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-black"
              >
                + Post
              </Link>

              <Link href={`/profile/${user.id}`} className={linkClass}>
                👤 Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-red-500 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 border-t bg-white/90">

          <Link onClick={() => setMenuOpen(false)} href="/" className={linkClass}>
            🏠 Feed
          </Link>

          {user ? (
            <>
              <Link
                onClick={() => setMenuOpen(false)}
                href="/create"
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-black"
              >
                + Post
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                href={`/profile/${user.id}`}
                className={linkClass}
              >
                👤 Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-red-500 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              onClick={() => setMenuOpen(false)}
              href="/login"
              className="px-3 py-1.5 rounded-full text-sm font-medium text-blue-600"
            >
              Login
            </Link>
          )}

        </div>
      )}
    </nav>
  );
}