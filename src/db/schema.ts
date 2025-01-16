import type { z } from "zod";

import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userRole = pgEnum("user_role", ["root", "admin", "user"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  posterUrl: text("poster_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const movieGenres = pgTable("movie_genres", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").notNull().references(() => movies.id),
  genreId: integer("genre_id").notNull().references(() => genres.id),
});

export const showtimes = pgTable("showtimes", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").notNull().references(() => movies.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  showtimeId: integer("showtime_id").notNull().references(() => showtimes.id),
  row: text("row").notNull(),
  number: integer("number").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  showtimeId: integer("showtime_id").notNull().references(() => showtimes.id),
  seatId: integer("seat_id").notNull().references(() => seats.id).unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations definitions
export const usersRelations = relations(users, ({ many }) => ({
  reservations: many(reservations),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  showtimes: many(showtimes),
  movieGenres: many(movieGenres),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  movieGenres: many(movieGenres),
}));

export const movieGenresRelations = relations(movieGenres, ({ one }) => ({
  movie: one(movies, {
    fields: [movieGenres.movieId],
    references: [movies.id],
  }),
  genre: one(genres, {
    fields: [movieGenres.genreId],
    references: [genres.id],
  }),
}));

export const showtimesRelations = relations(showtimes, ({ one, many }) => ({
  movie: one(movies, {
    fields: [showtimes.movieId],
    references: [movies.id],
  }),
  seats: many(seats),
  reservations: many(reservations),
}));

export const seatsRelations = relations(seats, ({ one }) => ({
  showtime: one(showtimes, {
    fields: [seats.showtimeId],
    references: [showtimes.id],
  }),
  reservation: one(reservations, {
    fields: [seats.id],
    references: [reservations.seatId],
  }),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, {
    fields: [reservations.userId],
    references: [users.id],
  }),
  showtime: one(showtimes, {
    fields: [reservations.showtimeId],
    references: [showtimes.id],
  }),
  seat: one(seats, {
    fields: [reservations.seatId],
    references: [seats.id],
  }),
}));

// Select schemas
export const selectUsersSchema = createSelectSchema(users);
export const selectMoviesSchema = createSelectSchema(movies);
export const selectGenresSchema = createSelectSchema(genres);
export const selectMovieGenresSchema = createSelectSchema(movieGenres);
export const selectShowtimesSchema = createSelectSchema(showtimes);
export const selectSeatsSchema = createSelectSchema(seats);
export const selectReservationsSchema = createSelectSchema(reservations);

// Insert schemas
export const insertUsersSchema = createInsertSchema(users, {
  username: schema => schema.min(3),
  email: schema => schema.email(),
  passwordHash: schema => schema.min(8),
}).required({
  username: true,
  email: true,
  passwordHash: true,
}).omit({
  id: true,
  role: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMoviesSchema = createInsertSchema(movies).required({
  title: true,
  description: true,
  posterUrl: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGenresSchema = createInsertSchema(genres).required({
  name: true,
}).omit({
  id: true,
});

export const insertMovieGenresSchema = createInsertSchema(movieGenres).required({
  movieId: true,
  genreId: true,
}).omit({
  id: true,
});

export const insertShowtimesSchema = createInsertSchema(showtimes).required({
  movieId: true,
  startTime: true,
  endTime: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSeatsSchema = createInsertSchema(seats).required({
  showtimeId: true,
  row: true,
  number: true,
}).omit({
  id: true,
  isAvailable: true,
});

export const insertReservationsSchema = createInsertSchema(reservations).required({
  userId: true,
  showtimeId: true,
  seatId: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUsersPayload = z.infer<typeof insertUsersSchema>;
export type InsertMoviesPayload = z.infer<typeof insertMoviesSchema>;
export type InsertGenresPayload = z.infer<typeof insertGenresSchema>;
export type InsertMovieGenresPayload = z.infer<typeof insertMovieGenresSchema>;
export type InsertShowtimesPayload = z.infer<typeof insertShowtimesSchema>;
export type InsertSeatsPayload = z.infer<typeof insertSeatsSchema>;
export type InsertReservationsPayload = z.infer<typeof insertReservationsSchema>;
