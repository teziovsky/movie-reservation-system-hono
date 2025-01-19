import { createMiddleware } from "hono/factory";

import { verifyToken } from "@/lib/jwt";

export const authMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  try {
    const { payload } = await verifyToken(token);
    c.set("userId", String(payload.userId));

    await next();
  }
  catch {
    return c.json({ message: "Invalid token" }, 401);
  }
});
