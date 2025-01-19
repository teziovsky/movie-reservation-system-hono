import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { insertSeatsSchema, patchSeatsSchema, selectSeatsSchema } from "@/db/schema";
import { IdParamSchema, notFoundSchema } from "@/lib/constants";
import { isAdminMiddleware } from "@/middlewares/is-admin.middleware";
import { ShowtimeParamsSchema } from "@/routes/showtimes/showtimes.routes";

const tags = ["Showtimes"];

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
      insertSeatsSchema.omit({ showtimeId: true }),
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
      createErrorSchema(ShowtimeParamsSchema).or(createErrorSchema(insertSeatsSchema.omit({ showtimeId: true }))),
      "The validation error(s)",
    ),
  },
});

const ShowtimeSeatParamsSchema = ShowtimeParamsSchema.merge(IdParamSchema("seatId"));

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
      patchSeatsSchema.omit({ showtimeId: true }),
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
      createErrorSchema(ShowtimeSeatParamsSchema).or(createErrorSchema(patchSeatsSchema.omit({ showtimeId: true }))),
      "The validation error(s)",
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
