import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertMoviesSchema, patchMoviesSchema, selectMoviesSchema, selectMoviesWithGenresSchema } from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
import { isAdminMiddleware } from "@/middlewares/is-admin.middleware";

const tags = ["Movies"];

export const list = createRoute({
  path: "/movies",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectMoviesWithGenresSchema),
      "The list of movies",
    ),
  },
});

export const create = createRoute({
  path: "/movies",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertMoviesSchema,
      "The movie to create",
    ),
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectMoviesSchema,
      "The created movie",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertMoviesSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: "/movies/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMoviesWithGenresSchema,
      "The requested movie",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Movie not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: "/movies/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchMoviesSchema,
      "The movie updates",
    ),
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMoviesSchema,
      "The updated movie",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Movie not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchMoviesSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/movies/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Movie deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Movie not found",
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
