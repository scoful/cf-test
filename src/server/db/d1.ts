import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import * as schema from "./schema";

/**
 * Get D1 database instance for Cloudflare Workers
 */
export function getD1Database() {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      throw new Error("D1 database binding not found");
    }
    return drizzle(env.DB, { schema });
  } catch (error) {
    console.error("Failed to get D1 database:", error);
    throw error;
  }
}

/**
 * Type for Cloudflare environment with D1 binding
 */
export interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
  WORKER_SELF_REFERENCE: Fetcher;
  NEXTJS_ENV: string;
  NODE_ENV: string;
  DATABASE_URL: string;
}
