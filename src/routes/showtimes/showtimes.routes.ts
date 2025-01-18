import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertShowtimesSchema, patchShowtimesSchema, selectShowtimesSchema } from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
import { isAdminMiddleware } from "@/middlewares/is-admin.middleware";

const tags = ["Showtimes"];

export const list = createRoute({
  path: "/showtimes",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectShowtimesSchema),
      "The list of showtimes",
    ),
  },
});

export const create = createRoute({
  path: "/showtimes",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertShowtimesSchema,
      "The showtime to create",
    ),
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectShowtimesSchema,
      "The created showtime",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertShowtimesSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: "/showtimes/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectShowtimesSchema,
      "The requested showtime",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Showtime not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: "/showtimes/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchShowtimesSchema,
      "The showtime updates",
    ),
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectShowtimesSchema,
      "The updated showtime",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Showtime not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchShowtimesSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/showtimes/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Showtime deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Showtime not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
