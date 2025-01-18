import { and, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { seats } from "@/db/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./seats.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { showtimeId } = c.req.valid("param");

  const seatsList = await db.query.seats.findMany({
    where: (fields, operators) => operators.eq(fields.showtimeId, showtimeId),
  });

  return c.json(seatsList);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { showtimeId } = c.req.valid("param");
  const seat = c.req.valid("json");

  const [inserted] = await db.insert(seats)
    .values({ ...seat, showtimeId })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { showtimeId, seatId } = c.req.valid("param");

  const seat = await db.query.seats.findFirst({
    where: (fields, operators) =>
      and(
        operators.eq(fields.id, seatId),
        operators.eq(fields.showtimeId, showtimeId),
      ),
  });

  if (!seat) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(seat, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { showtimeId, seatId } = c.req.valid("param");
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

  const [updated] = await db.update(seats)
    .set(updates)
    .where(
      and(
        eq(seats.id, seatId),
        eq(seats.showtimeId, showtimeId),
      ),
    )
    .returning();

  if (!updated) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { showtimeId, seatId } = c.req.valid("param");

  const result = await db.delete(seats)
    .where(
      and(
        eq(seats.id, seatId),
        eq(seats.showtimeId, showtimeId),
      ),
    )
    .returning();

  if (result.length === 0) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
