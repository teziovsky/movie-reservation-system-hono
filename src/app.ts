import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import index from "@/routes/index.route";
import movies from "@/routes/movies/movies.index";

const app = createApp();

configureOpenAPI(app);

const routes = [
  index,
  movies,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
