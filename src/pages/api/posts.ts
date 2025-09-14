import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";

/**
 * API route to demonstrate database usage
 * Uses local SQLite in development, D1 in production
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    console.log("Using local SQLite database for development");

    switch (req.method) {
      case "GET":
        // Get all posts
        const allPosts = await db.select().from(posts);
        res.status(200).json({ posts: allPosts });
        break;

      case "POST":
        // Create a new post
        const { name } = req.body as { name?: string };
        if (!name) {
          return res.status(400).json({ error: "Name is required" });
        }

        const newPost = await db.insert(posts).values({ name }).returning();

        res.status(201).json({ post: newPost[0] });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
