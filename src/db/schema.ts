import type { z } from "zod";

import { boolean, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userRole = pgEnum("user_role", ["root", "admin", "user"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRole("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const selectUsersSchema = createSelectSchema(users);

export const insertUsersSchema = createInsertSchema(users, {
  email: schema => schema.email(),
  password: schema => schema.min(8),
}).required({
  email: true,
  password: true,
}).omit({
  id: true,
  role: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUsersPayload = z.infer<typeof insertUsersSchema>;
