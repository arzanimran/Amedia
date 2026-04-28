"use client";

import { useState, useEffect } from "react";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  avatar: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    setUser(null);
  }

  return { user, logout };
}