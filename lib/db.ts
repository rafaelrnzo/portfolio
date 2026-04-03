import "server-only";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let dbSingleton: NeonQueryFunction<false, false> | null = null;

export function getDb() {
  if (dbSingleton) return dbSingleton;

  const databaseUrl = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "Missing DATABASE_URL (or NEON_DATABASE_URL) environment variable."
    );
  }

  dbSingleton = neon(databaseUrl);
  return dbSingleton;
}

