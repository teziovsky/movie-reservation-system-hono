import type { Context, Next } from "hono";

import { verifyToken } from "@/lib/jwt";

export async function authMiddleware(c: Context, next: Next) {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  try {
    const { payload } = await verifyToken(token);
    c.set("userId", payload.userId);
    await next();
  }
  catch {
    return c.json({ message: "Invalid token" }, 401);
  }
}
