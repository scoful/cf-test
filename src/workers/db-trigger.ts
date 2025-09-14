/**
 * Cloudflare Worker for D1 database triggers
 * This worker can be used to handle database events and perform actions
 * when data changes in the D1 database.
 */

import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
import * as schema from "../server/db/schema";

export interface Env {
  DB: D1Database;
  // Add other bindings as needed
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const db = drizzle(env.DB, { schema });

    // Handle different trigger endpoints
    switch (url.pathname) {
      case "/trigger/post-created":
        return handlePostCreated(request, db);
      
      case "/trigger/post-updated":
        return handlePostUpdated(request, db);
      
      case "/trigger/cleanup":
        return handleCleanup(request, db, ctx);
      
      default:
        return new Response("Trigger endpoint not found", { status: 404 });
    }
  },

  // Scheduled event handler for periodic tasks
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const db = drizzle(env.DB, { schema });
    
    // Example: Clean up old posts every day
    console.log("Running scheduled cleanup task");
    
    try {
      // Delete posts older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const result = await db
        .delete(schema.posts)
        .where(sql`created_at < ${thirtyDaysAgo.getTime() / 1000}`);
      
      console.log(`Cleaned up old posts: ${result.changes} records deleted`);
    } catch (error) {
      console.error("Cleanup task failed:", error);
    }
  },
};

/**
 * Handle post creation trigger
 */
async function handlePostCreated(request: Request, db: any): Promise<Response> {
  try {
    const data = await request.json();
    const { postId, name } = data;

    console.log(`Post created trigger: ${postId} - ${name}`);

    // Example: Send notification, update cache, etc.
    // You can add your custom logic here

    // Example: Log the event
    await logEvent(db, "post_created", { postId, name });

    return new Response(JSON.stringify({ success: true, message: "Post creation handled" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Post creation trigger error:", error);
    return new Response(JSON.stringify({ error: "Failed to handle post creation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Handle post update trigger
 */
async function handlePostUpdated(request: Request, db: any): Promise<Response> {
  try {
    const data = await request.json();
    const { postId, oldName, newName } = data;

    console.log(`Post updated trigger: ${postId} - ${oldName} -> ${newName}`);

    // Example: Invalidate cache, send notifications, etc.
    await logEvent(db, "post_updated", { postId, oldName, newName });

    return new Response(JSON.stringify({ success: true, message: "Post update handled" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Post update trigger error:", error);
    return new Response(JSON.stringify({ error: "Failed to handle post update" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Handle cleanup trigger
 */
async function handleCleanup(request: Request, db: any, ctx: ExecutionContext): Promise<Response> {
  try {
    // Use waitUntil to ensure cleanup completes even if response is sent
    ctx.waitUntil(performCleanup(db));

    return new Response(JSON.stringify({ success: true, message: "Cleanup initiated" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cleanup trigger error:", error);
    return new Response(JSON.stringify({ error: "Failed to initiate cleanup" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Log events to database (example implementation)
 */
async function logEvent(db: any, eventType: string, data: any): Promise<void> {
  // This is a placeholder - you would need to create an events table
  console.log(`Event logged: ${eventType}`, data);
  
  // Example: Insert into events table
  // await db.insert(events).values({
  //   type: eventType,
  //   data: JSON.stringify(data),
  //   createdAt: new Date(),
  // });
}

/**
 * Perform cleanup operations
 */
async function performCleanup(db: any): Promise<void> {
  try {
    // Example cleanup operations
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Clean up old posts (example)
    const result = await db
      .delete(schema.posts)
      .where(sql`created_at < ${sevenDaysAgo.getTime() / 1000}`);
    
    console.log(`Cleanup completed: ${result.changes} records processed`);
  } catch (error) {
    console.error("Cleanup operation failed:", error);
    throw error;
  }
}
