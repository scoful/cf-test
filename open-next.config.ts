import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // Use R2 for incremental cache (optional, requires R2 bucket)
  // incrementalCache: r2IncrementalCache,
});
