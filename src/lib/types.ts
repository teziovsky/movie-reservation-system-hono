import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

import type { User } from "@/db/schema";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    userId: User["id"];
    loggedInUserRole: User["role"];
  };
};

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
