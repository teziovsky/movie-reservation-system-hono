import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { patchUsersRoleSchema, patchUsersSchema, selectUsersSchema } from "@/db/schema";
import { notFoundSchema, unauthorizedSchema, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import { isAdminMiddleware } from "@/middlewares/is-admin.middleware";

const tags = ["Users"];

export const list = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUsersSchema),
      "The list of users",
    ),
  },
});

export const getCurrent = createRoute({
  path: "/users/current",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "The current user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
  },
});

const UserParamsSchema = z.object({
  userId: IdParamsSchema.shape.id,
});

export const getOne = createRoute({
  path: "/users/{userId}",
  method: "get",
  request: {
    params: UserParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "The requested user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UserParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: "/users/{userId}",
  method: "patch",
  request: {
    params: UserParamsSchema,
    body: jsonContentRequired(
      patchUsersSchema,
      "The user updates",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "The updated user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchUsersSchema)
        .or(createErrorSchema(UserParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const patchRole = createRoute({
  path: "/users/{userId}/role",
  method: "patch",
  request: {
    params: UserParamsSchema,
    body: jsonContentRequired(
      patchUsersRoleSchema,
      "The user role updates",
    ),
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "The updated user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      ZOD_ERROR_MESSAGES.INVALID_CREDENTIALS,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchUsersRoleSchema)
        .or(createErrorSchema(UserParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/users/{userId}",
  method: "delete",
  request: {
    params: UserParamsSchema,
  },
  middleware: [isAdminMiddleware] as const,
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "User deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UserParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type GetCurrentRoute = typeof getCurrent;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type PatchRoleRoute = typeof patchRole;
export type RemoveRoute = typeof remove;
