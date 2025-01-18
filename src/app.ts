import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth.middleware";
import auth from "@/routes/auth/auth.index";
import index from "@/routes/index.route";
import movies from "@/routes/movies/movies.index";
import users from "@/routes/users/users.index";

const app = createApp();

configureOpenAPI(app);

const publicRoutes = [
  index,
  auth,
] as const;

publicRoutes.forEach((route) => {
  app.route("/", route);
});

const protectedRoutes = [
  movies,
  users,
] as const;

protectedRoutes.forEach((route) => {
  app.use("*", authMiddleware);
  app.route("/", route);
});

export type AppType = typeof publicRoutes[number] | typeof protectedRoutes[number];

export default app;
