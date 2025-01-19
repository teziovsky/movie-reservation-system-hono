ALTER TABLE "movie_genres" DROP CONSTRAINT "movie_genres_movie_id_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "movie_genres" DROP CONSTRAINT "movie_genres_genre_id_genres_id_fk";
--> statement-breakpoint
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_showtime_id_showtimes_id_fk";
--> statement-breakpoint
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_seat_id_seats_id_fk";
--> statement-breakpoint
ALTER TABLE "seats" DROP CONSTRAINT "seats_showtime_id_showtimes_id_fk";
--> statement-breakpoint
ALTER TABLE "showtimes" DROP CONSTRAINT "showtimes_movie_id_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_showtime_id_showtimes_id_fk" FOREIGN KEY ("showtime_id") REFERENCES "public"."showtimes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_seat_id_seats_id_fk" FOREIGN KEY ("seat_id") REFERENCES "public"."seats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seats" ADD CONSTRAINT "seats_showtime_id_showtimes_id_fk" FOREIGN KEY ("showtime_id") REFERENCES "public"."showtimes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtimes" ADD CONSTRAINT "showtimes_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;