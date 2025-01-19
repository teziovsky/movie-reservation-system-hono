import { createMiddleware } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";

export const isAdminMiddleware = createMiddleware(async (c, next) => {
  const userId = c.get("userId");

  const loggedInUser = await db.query.users.findFirst({
    where: (fields, operators) => operators.eq(fields.id, userId),
    columns: {
      role: true,
    },
  });

  if (!loggedInUser || !["root", "admin"].includes(loggedInUser.role)) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  c.set("loggedInUserRole", loggedInUser.role);

  await next();
});
