import { swaggerUI } from "@hono/swagger-ui";

import type { AppOpenAPI } from "./types";

import packageJSON from "../../package.json";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  });

  app.doc("/openapi", c => ({
    openapi: "3.1.0",
    info: {
      version: packageJSON.version,
      title: "Movie Reservation System API",
    },
    security: [
      {
        Bearer: [],
      },
    ],
    servers: [
      {
        url: new URL(c.req.url).origin,
        description: "Current environment",
      },
    ],
  }));

  app.get(
    "/docs",
    swaggerUI({
      url: "/openapi",
      deepLinking: true,
      filter: true,
      tryItOutEnabled: true,
    }),
  );
}
