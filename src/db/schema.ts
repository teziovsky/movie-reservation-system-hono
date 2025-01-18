import { relations, sql } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const userRole = pgEnum("user_role", ["root", "admin", "user"]);
export type UserRole = typeof userRole.enumValues[number];
export const userRoles: Record<UserRole, number> = {
  root: 1,
  admin: 2,
  user: 3,
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("user"),
  image: text("image").default(sql`NULL`),
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
  movieId: integer("movie_id").notNull().references(() => movies.id, { onDelete: "cascade" }),
  genreId: integer("genre_id").notNull().references(() => genres.id, { onDelete: "cascade" }),
});

export const showtimes = pgTable("showtimes", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").notNull().references(() => movies.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  showtimeId: integer("showtime_id").notNull().references(() => showtimes.id, { onDelete: "cascade" }),
  row: text("row").notNull(),
  number: integer("number").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  showtimeId: integer("showtime_id").notNull().references(() => showtimes.id, { onDelete: "cascade" }),
  seatId: integer("seat_id").notNull().references(() => seats.id, { onDelete: "cascade" }).unique(),
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
export const selectUsersSchema = createSelectSchema(users).omit({
  passwordHash: true,
});
export const selectMoviesSchema = createSelectSchema(movies);
export const selectGenresSchema = createSelectSchema(genres);
export const selectMovieGenresSchema = createSelectSchema(movieGenres);
export const selectShowtimesSchema = createSelectSchema(showtimes);
export const selectSeatsSchema = createSelectSchema(seats);
export const selectReservationsSchema = createSelectSchema(reservations);

export type User = z.infer<typeof selectUsersSchema>;
export type Movie = z.infer<typeof selectMoviesSchema>;
export type Genre = z.infer<typeof selectGenresSchema>;
export type MovieGenre = z.infer<typeof selectMovieGenresSchema>;
export type Showtime = z.infer<typeof selectShowtimesSchema>;
export type Seat = z.infer<typeof selectSeatsSchema>;
export type Reservation = z.infer<typeof selectReservationsSchema>;

// Insert schemas
export const insertUsersSchema = createInsertSchema(users, {
  username: schema => schema.min(3),
  email: schema => schema.email(),
  passwordHash: schema => schema.min(8),
  image: schema => schema.url(),
}).required({
  username: true,
  email: true,
  passwordHash: true,
}).omit({
  id: true,
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
}).extend({
  genres: z.array(selectGenresSchema.shape.id).min(1),
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

export type InsertUsersPayload = z.infer<typeof insertUsersSchema>;
export type InsertMoviesPayload = z.infer<typeof insertMoviesSchema>;
export type InsertGenresPayload = z.infer<typeof insertGenresSchema>;
export type InsertMovieGenresPayload = z.infer<typeof insertMovieGenresSchema>;
export type InsertShowtimesPayload = z.infer<typeof insertShowtimesSchema>;
export type InsertSeatsPayload = z.infer<typeof insertSeatsSchema>;
export type InsertReservationsPayload = z.infer<typeof insertReservationsSchema>;

// Patch schemas
export const patchUsersSchema = createUpdateSchema(users, {
  username: schema => schema.min(3),
  email: schema => schema.email(),
  image: schema => schema.url(),
}).omit({
  id: true,
  passwordHash: true,
  role: true,
  createdAt: true,
  updatedAt: true,
});

export const patchUsersRoleSchema = createUpdateSchema(users).omit({
  id: true,
  username: true,
  email: true,
  passwordHash: true,
  image: true,
  createdAt: true,
  updatedAt: true,
});

export const patchMoviesSchema = createUpdateSchema(movies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  genres: z.array(selectGenresSchema.shape.id).min(1),
});

export const patchGenresSchema = createUpdateSchema(genres).omit({
  id: true,
});

export const patchMovieGenresSchema = createUpdateSchema(movieGenres).omit({
  id: true,
});

export const patchShowtimesSchema = createUpdateSchema(showtimes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchSeatsSchema = createUpdateSchema(seats).omit({
  id: true,
  isAvailable: true,
});

export const patchReservationsSchema = createUpdateSchema(reservations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PatchUsersPayload = z.infer<typeof patchUsersSchema>;
export type PatchUsersRolePayload = z.infer<typeof patchUsersRoleSchema>;
export type PatchMoviesPayload = z.infer<typeof patchMoviesSchema>;
export type PatchGenresPayload = z.infer<typeof patchGenresSchema>;
export type PatchMovieGenresPayload = z.infer<typeof patchMovieGenresSchema>;
export type PatchShowtimesPayload = z.infer<typeof patchShowtimesSchema>;
export type PatchSeatsPayload = z.infer<typeof patchSeatsSchema>;
export type PatchReservationsPayload = z.infer<typeof patchReservationsSchema>;
