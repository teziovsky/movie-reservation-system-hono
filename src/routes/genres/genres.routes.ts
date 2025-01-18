import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertGenresSchema, patchGenresSchema, selectGenresSchema } from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
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

export const getOne = createRoute({
  path: "/genres/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
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
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: "/genres/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
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
      createErrorSchema(patchGenresSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/genres/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
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
