"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  User,
  PlusCircle,
  LogOut,
  LogIn,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  // load user + theme
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  // toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
    router.refresh();
    setMenuOpen(false);
  }

  const linkClass =
    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition";

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* BRAND */}
        <Link href="/" className="text-2xl font-black">
          Amedia
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden sm:flex items-center gap-4">

          <Link href="/" className={linkClass}>
            <Home size={18} /> Feed
          </Link>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              <Link
                href="/create"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-black"
              >
                <PlusCircle size={18} /> Post
              </Link>

              <Link href={`/profile/${user.id}`} className={linkClass}>
                <User size={18} /> Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white bg-blue-600 hover:bg-blue-700"
            >
              <LogIn size={18} /> Login
            </Link>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-2xl"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 border-t bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

          <Link onClick={() => setMenuOpen(false)} href="/" className={linkClass}>
            <Home size={18} /> Feed
          </Link>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />} Theme
          </button>

          {user ? (
            <>
              <Link
                onClick={() => setMenuOpen(false)}
                href="/create"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white bg-black"
              >
                <PlusCircle size={18} /> Post
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                href={`/profile/${user.id}`}
                className={linkClass}
              >
                <User size={18} /> Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-red-500 text-left"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link
              onClick={() => setMenuOpen(false)}
              href="/login"
              className="flex items-center gap-2 px-3 py-1.5 text-blue-600"
            >
              <LogIn size={18} /> Login
            </Link>
          )}

        </div>
      )}
    </nav>
  );
}