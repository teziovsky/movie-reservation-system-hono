import { apiReference } from "@scalar/hono-api-reference";
import { bearerAuth } from "hono/bearer-auth";
import { spec } from "node:test/reporters";

import type { AppOpenAPI } from "./types";

import packageJSON from "../../package.json";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
  });

  app.doc("/openapi", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Movie Reservation System API",
    },
  });

  app.get(
    "/docs",
    apiReference({
      theme: "kepler",
      layout: "modern",
      defaultOpenAllTags: true,
      showSidebar: true,
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: "/openapi",
      },
    }),
  );
}
