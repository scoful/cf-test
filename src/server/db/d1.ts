import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import * as schema from "./schema";

/**
 * Get D1 database instance for Cloudflare Workers
 */
export function getD1Database() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const { env } = getCloudflareContext() as { env: any };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!env?.DB) {
      throw new Error("D1 database binding not found");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return drizzle(env.DB, { schema });
  } catch (error) {
    console.error("Failed to get D1 database:", error);
    throw error;
  }
}

// CloudflareEnv type is defined globally in cloudflare-env.d.ts
