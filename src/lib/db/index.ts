import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var _pool: Pool | undefined;
}

const pool =
  global._pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL!,
  });

if (process.env.NODE_ENV !== "production") {
  global._pool = pool;
}

export const db = drizzle(pool, { schema });
