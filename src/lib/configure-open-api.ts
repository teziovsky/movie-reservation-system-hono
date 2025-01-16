import { swaggerUI } from "@hono/swagger-ui";

import type { AppOpenAPI } from "./types";

import packageJSON from "../../package.json";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
  });

  app.doc("/openapi", {
    openapi: "3.1.0",
    info: {
      version: packageJSON.version,
      title: "Movie Reservation System API",
    },
  });

  app.get(
    "/docs",
    swaggerUI({
      url: "/openapi",
    }),
  );
}
