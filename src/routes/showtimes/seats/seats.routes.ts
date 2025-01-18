import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { insertSeatsSchema, patchSeatsSchema, selectSeatsSchema, selectShowtimesSchema } from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
import { isAdminMiddleware } from "@/middlewares/is-admin.middleware";

const tags = ["Showtimes"];

const ShowtimeParamsSchema = z.object({
  showtimeId: selectShowtimesSchema.shape.id,
});

export const list = createRoute({
  path: "/showtimes/{showtimeId}/seats",
  method: "get",
  request: {
    params: ShowtimeParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectSeatsSchema),
      "The list of seats",
    ),
  },
});

export const create = createRoute({
  path: "/showtimes/{showtimeId}/seats",
  method: "post",
  request: {
    params: ShowtimeParamsSchema,
    body: jsonContentRequired(
      insertSeatsSchema,
      "The seat to create",
    ),
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectSeatsSchema,
      "The created seat",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertSeatsSchema),
      "The validation error(s)",
    ),
  },
});

const ShowtimeSeatParamsSchema = ShowtimeParamsSchema.merge(z.object({
  seatId: selectSeatsSchema.shape.id,
}));

export const getOne = createRoute({
  path: "/showtimes/{showtimeId}/seats/{seatId}",
  method: "get",
  request: {
    params: ShowtimeSeatParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSeatsSchema,
      "The requested seat",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Seat not found",
    ),
  },
});

export const patch = createRoute({
  path: "/showtimes/{showtimeId}/seats/{seatId}",
  method: "patch",
  request: {
    params: ShowtimeSeatParamsSchema,
    body: jsonContentRequired(
      patchSeatsSchema,
      "The seat updates",
    ),
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSeatsSchema,
      "The updated seat",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Seat not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(ShowtimeSeatParamsSchema),
      "Invalid id error",
    ),
  },
});

export const remove = createRoute({
  path: "/showtimes/{showtimeId}/seats/{seatId}",
  method: "delete",
  request: {
    params: ShowtimeSeatParamsSchema,
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Seat deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Seat not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(ShowtimeSeatParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
