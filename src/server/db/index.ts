import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

/**
 * Create database client for local development (SQLite)
 */
function createLocalClient(): Client {
  return createClient({ url: env.DATABASE_URL });
}

export const client = globalForDb.client ?? createLocalClient();
if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });

// Export D1 utilities for Cloudflare Workers
export { getD1Database, type CloudflareEnv } from "./d1";
