import { and, eq, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { movieGenres, movies } from "@/db/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./movies.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const movies = await db.query.movies.findMany({
    with: {
      movieGenres: {
        with: {
          genre: true,
        },
      },
    },
  }).then((movies) => {
    return movies.map((movie) => {
      const { movieGenres, ...movieData } = movie;
      return {
        ...movieData,
        genres: movieGenres.map(mg => mg.genre),
      };
    });
  });

  return c.json(movies);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const movie = c.req.valid("json");
  const { genre_ids, ...movieData } = movie;

  const insertedMovie = await db.transaction(async (tx) => {
    const [inserted] = await db.insert(movies).values(movieData).returning();

    await tx.insert(movieGenres).values(
      genre_ids.map(genreId => ({
        genreId,
        movieId: inserted.id,
      })),
    );

    return inserted;
  });
  return c.json(insertedMovie, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const movie = await db.query.movies.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
    with: {
      movieGenres: {
        with: {
          genre: true,
        },
      },
    },
  }).then((movie) => {
    if (!movie) {
      return null;
    }

    const { movieGenres, ...movieData } = movie;
    return {
      ...movieData,
      genres: movieGenres.map(mg => mg.genre),
    };
  });

  if (!movie) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(movie, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const { genre_ids, ...movieData } = updates;

  if (Object.keys(movieData).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const updated = await db.transaction(async (tx) => {
    const [updatedMovie] = await db.update(movies).set(movieData).where(eq(movies.id, id)).returning();

    if (!updatedMovie) {
      return null;
    }

    const existingGenres = await tx.query.movieGenres.findMany({
      where: (fields, operators) => operators.eq(fields.movieId, id),
    });
    const existingGenreSet = new Set(existingGenres.map(g => g.genreId));
    const newGenreSet = new Set(genre_ids);

    const genresToDelete = [...existingGenreSet.difference(newGenreSet)];
    const genresToAdd = [...newGenreSet.difference(existingGenreSet)];

    if (genresToDelete.length > 0) {
      await tx.delete(movieGenres)
        .where(and(eq(movieGenres.movieId, id), inArray(movieGenres.genreId, genresToDelete)));
    }

    if (genresToAdd.length > 0) {
      await tx.insert(movieGenres).values(genresToAdd.map(genreId => ({ genreId, movieId: id })),
      );
    }

    return updatedMovie;
  });

  if (!updated) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(movies)
    .where(eq(movies.id, id))
    .returning();

  if (result.length === 0) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
