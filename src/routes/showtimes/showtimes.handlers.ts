import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { showtimes } from "@/db/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./showtimes.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const showtimes = await db.query.showtimes.findMany();
  return c.json(showtimes);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const showtime = c.req.valid("json");
  const [inserted] = await db.insert(showtimes).values(showtime).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { showtimeId } = c.req.valid("param");

  const showtime = await db.query.showtimes.findFirst({
    where: (fields, operators) => operators.eq(fields.id, showtimeId),
  });

  if (!showtime) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(showtime, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { showtimeId } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [showtime] = await db.update(showtimes)
    .set(updates)
    .where(eq(showtimes.id, showtimeId))
    .returning();

  if (!showtime) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(showtime, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { showtimeId } = c.req.valid("param");

  const result = await db.delete(showtimes)
    .where(eq(showtimes.id, showtimeId))
    .returning();

  if (result.length === 0) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
