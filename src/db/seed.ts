import { seed } from "drizzle-seed";

import { db } from "@/db";
import { users } from "@/db/schema";

async function main() {
  await seed(db, { users }, { count: 5 });
}

main();
