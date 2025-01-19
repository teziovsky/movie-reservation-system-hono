import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { insertUsersSchema, selectUsersSchema } from "@/db/schema";
import { unauthorizedSchema, ZOD_ERROR_MESSAGES } from "@/lib/constants";

const tags = ["Auth"];

const passwordSchema = z.string().min(8);

const registerSchema = insertUsersSchema.pick({
  username: true,
  email: true,
}).extend({
  password: passwordSchema,
});

export const register = createRoute({
  path: "/auth/register",
  method: "post",
  request: {
    body: jsonContentRequired(
      registerSchema,
      "The user to register",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectUsersSchema.pick({
        id: true,
        email: true,
      }),
      "The created user",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(registerSchema),
      "The validation error(s)",
    ),
  },
});

const insertLoginSchema = insertUsersSchema.pick({
  email: true,
}).extend({
  password: passwordSchema,
});

const selectLoginSchema = z.object({
  token: z.string(),
});

export const login = createRoute({
  method: "post",
  path: "/auth/login",
  request: {
    body: jsonContentRequired(
      insertLoginSchema,
      "The user to login",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectLoginSchema,
      "The token of the logged in user",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      ZOD_ERROR_MESSAGES.INVALID_CREDENTIALS,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertLoginSchema),
      "The validation error(s)",
    ),
  },
});

export type RegisterRoute = typeof register;
export type LoginRoute = typeof login;
