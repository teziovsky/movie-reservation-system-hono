import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";

import { hash } from "@/lib/auth";

import type { InsertReservationsPayload, InsertSeatsPayload, InsertShowtimesPayload, InsertUsersPayload } from "./schema";

import { db } from "./index";
import { genres, movieGenres, movies, reservations, seats, showtimes, users } from "./schema";

async function clearTables() {
  await db.delete(reservations);
  await db.delete(seats);
  await db.delete(showtimes);
  await db.delete(movieGenres);
  await db.delete(genres);
  await db.delete(movies);
  await db.delete(users);
}

async function seedUsers(count: number) {
  const userData: InsertUsersPayload[] = [];

  const adminUser: InsertUsersPayload = {
    username: "admin",
    email: "admin@example.com",
    passwordHash: await hash("admin123"),
    role: "admin",
  };
  userData.push(adminUser);

  for (let i = 0; i < count - 1; i++) {
    const user: InsertUsersPayload = {
      username: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: await hash("password123"),
      role: "user",
    };
    userData.push(user);
  }
  return db.insert(users).values(userData).returning();
}

async function seedGenres() {
  const genreNames = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Romance",
    "Thriller",
    "Documentary",
    "Animation",
    "Adventure",
  ];
  return db.insert(genres).values(
    genreNames.map(name => ({ name })),
  ).returning();
}

async function seedMovies(count: number) {
  const movieData = Array.from({ length: count }, () => ({
    title: faker.word.words({ count: { min: 2, max: 5 } }),
    description: faker.lorem.paragraph(),
    posterUrl: faker.image.url({ width: 800, height: 600 }),
  }));
  return db.insert(movies).values(movieData).returning();
}

async function seedMovieGenres(moviesList: typeof movies.$inferSelect[], genresList: typeof genres.$inferSelect[]) {
  const movieGenresData = moviesList.flatMap((movie) => {
    // Assign 1-3 random genres to each movie
    const genreCount = faker.number.int({ min: 1, max: 3 });
    const selectedGenres = faker.helpers.arrayElements(genresList, genreCount);
    return selectedGenres.map(genre => ({
      movieId: movie.id,
      genreId: genre.id,
    }));
  });
  return db.insert(movieGenres).values(movieGenresData).returning();
}

async function seedShowtimes(moviesList: typeof movies.$inferSelect[]) {
  const showtimeData: InsertShowtimesPayload[] = [];
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  for (const movie of moviesList) {
    const showCount = faker.number.int({ min: 3, max: 8 });
    for (let i = 0; i < showCount; i++) {
      const startTime = faker.date.between({ from: startDate, to: endDate });
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
      showtimeData.push({
        movieId: movie.id,
        startTime,
        endTime,
      });
    }
  }
  return db.insert(showtimes).values(showtimeData).returning();
}

async function seedSeats(showtimesList: typeof showtimes.$inferSelect[]) {
  const seatsData: InsertSeatsPayload[] = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 10;

  for (const showtime of showtimesList) {
    for (const row of rows) {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        seatsData.push({
          showtimeId: showtime.id,
          row,
          number: seatNum,
        });
      }
    }
  }
  return db.insert(seats).values(seatsData).returning();
}

async function seedReservations(
  usersList: typeof users.$inferSelect[],
  seatsList: typeof seats.$inferSelect[],
  showtimesList: typeof showtimes.$inferSelect[],
) {
  const reservationCount = Math.floor(seatsList.length * 0.3); // Reserve 30% of seats
  const reservationData: InsertReservationsPayload[] = [];

  for (let i = 0; i < reservationCount; i++) {
    const user = faker.helpers.arrayElement(usersList);
    const seat = faker.helpers.arrayElement(seatsList.filter(s => !reservationData.find(r => r.seatId === s.id)));
    const showtime = showtimesList.find(s => s.id === seat.showtimeId)!;

    reservationData.push({
      userId: user.id,
      showtimeId: showtime.id,
      seatId: seat.id,
    });

    // Mark seat as unavailable
    await db.update(seats).set({ isAvailable: false }).where(eq(seats.id, seat.id));
  }

  return db.insert(reservations).values(reservationData).returning();
}

async function main() {
  console.log("🧹 Clearing existing data...");
  await clearTables();

  console.log("🌱 Starting seed...");

  const usersList = await seedUsers(5);
  console.log(`✅ Created ${usersList.length} users`);

  const genresList = await seedGenres();
  console.log(`✅ Created ${genresList.length} genres`);

  const moviesList = await seedMovies(20);
  console.log(`✅ Created ${moviesList.length} movies`);

  const movieGenresList = await seedMovieGenres(moviesList, genresList);
  console.log(`✅ Created ${movieGenresList.length} movie-genre relations`);

  const showtimesList = await seedShowtimes(moviesList);
  console.log(`✅ Created ${showtimesList.length} showtimes`);

  const seatsList = await seedSeats(showtimesList);
  console.log(`✅ Created ${seatsList.length} seats`);

  const reservationsList = await seedReservations(usersList, seatsList, showtimesList);
  console.log(`✅ Created ${reservationsList.length} reservations`);

  console.log("✨ Seed completed successfully!");
}

main().catch(console.error);
