import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "@/db/schema";
import env from "@/env";

const client = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(client, { schema });

export { client, db, schema };
