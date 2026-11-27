import { Pool } from "pg";

const database = globalThis as typeof globalThis & { oksanaDatabasePool?: Pool };

export function logDatabaseError(message: string, error: unknown) {
  // PostgreSQL error details can include the values from a rejected row.
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  console.error(message, { code: typeof code === "string" ? code : undefined });
}

export function getDatabase() {
  if (!database.oksanaDatabasePool) {
    const pool = new Pool({
      max: 5,
      connectionTimeoutMillis: 3_000,
      idleTimeoutMillis: 10_000,
      statement_timeout: 5_000,
      query_timeout: 6_500,
    });
    pool.on("error", (error) => logDatabaseError("Idle PostgreSQL connection failed", error));
    database.oksanaDatabasePool = pool;
  }
  return database.oksanaDatabasePool;
}
