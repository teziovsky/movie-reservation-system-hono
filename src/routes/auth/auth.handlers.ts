import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { users } from "@/db/schema";
import { ZOD_ERROR_MESSAGES } from "@/lib/constants";
import { generateToken } from "@/lib/jwt";
import { comparePassword, hashPassword } from "@/lib/password";

import type { LoginRoute, RegisterRoute } from "./auth.routes";

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const { username, email, password } = c.req.valid("json");

  const passwordHash = await hashPassword(password);

  const [user] = await db.insert(users).values({
    username,
    email,
    passwordHash,
  }).returning({ id: users.id, email: users.email });

  return c.json(user, HttpStatusCodes.CREATED);
};

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !await comparePassword(password, user.passwordHash)) {
    return c.json(
      {
        message: ZOD_ERROR_MESSAGES.INVALID_CREDENTIALS,
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const token = await generateToken({ userId: user.id });

  return c.json({ token }, HttpStatusCodes.OK);
};
