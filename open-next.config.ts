import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // Use R2 for incremental cache (optional, requires R2 bucket)
  // incrementalCache: r2IncrementalCache,
  
  // Custom configuration for Cloudflare
  override: {
    wrapper: "cloudflare-node",
    converter: "edge",
    tagCache: "cloudflare-kv",
    queue: "cloudflare-queue",
    incrementalCache: "cloudflare-kv",
    imageLoader: "cloudflare-image-loader",
  },
});
