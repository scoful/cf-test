import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import * as schema from "./schema";

/**
 * Get D1 database instance for Cloudflare Workers
 */
export function getD1Database() {
  try {
    const { env } = getCloudflareContext() as { env: CloudflareEnv };
    if (!env?.DB) {
      throw new Error("D1 database binding not found");
    }
    return drizzle(env.DB, { schema });
  } catch (error) {
    console.error("Failed to get D1 database:", error);
    throw error;
  }
}

// CloudflareEnv type is defined globally in cloudflare-env.d.ts
