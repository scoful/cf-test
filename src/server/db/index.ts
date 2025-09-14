// For Cloudflare D1 deployment, we'll use D1 database directly
// Local development will be handled separately

// Export D1 utilities for Cloudflare Workers
export { getD1Database } from "./d1";
