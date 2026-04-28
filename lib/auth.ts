import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export function signToken(userId: number): string {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, SECRET) as { userId: number };
  } catch {
    return null;
  }
}

export function getUserIdFromRequest(request: Request): number | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((c) => {
    const [key, val] = c.trim().split("=");
    if (key && val) cookies[key.trim()] = val.trim();
  });

  const token = cookies["token"];
  if (!token) return null;

  const payload = verifyToken(token);
  return payload ? payload.userId : null;
}