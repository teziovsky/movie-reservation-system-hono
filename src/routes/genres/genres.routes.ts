import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { insertGenresSchema, patchGenresSchema, selectGenresSchema } from "@/db/schema";
import { IdParamSchema, notFoundSchema } from "@/lib/constants";
import { isAdminMiddleware } from "@/middlewares/is-admin.middleware";

const tags = ["Genres"];

export const list = createRoute({
  path: "/genres",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectGenresSchema),
      "The list of genres",
    ),
  },
});

export const create = createRoute({
  path: "/genres",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertGenresSchema,
      "The genre to create",
    ),
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectGenresSchema,
      "The created genre",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertGenresSchema),
      "The validation error(s)",
    ),
  },
});

export const GenresParamsSchema = IdParamSchema("genreId");

export const getOne = createRoute({
  path: "/genres/{genreId}",
  method: "get",
  request: {
    params: GenresParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectGenresSchema,
      "The requested genre",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Genre not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(GenresParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: "/genres/{genreId}",
  method: "patch",
  request: {
    params: GenresParamsSchema,
    body: jsonContentRequired(
      patchGenresSchema,
      "The genre updates",
    ),
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectGenresSchema,
      "The updated genre",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Genre not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchGenresSchema).or(createErrorSchema(GenresParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/genres/{genreId}",
  method: "delete",
  request: {
    params: GenresParamsSchema,
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Genre deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Genre not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(GenresParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
