import type { NextApiRequest, NextApiResponse } from "next";
import { getD1Database } from "@/server/db";
import { posts } from "@/server/db/schema";

/**
 * API route to handle scheduled tasks (cron triggers)
 * This will be called by Cloudflare Workers cron triggers
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST requests from Cloudflare Workers
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Scheduled task triggered - inserting data to D1");
    const db = getD1Database();

    // Generate a random name for the scheduled post
    const randomNames = [
      "Scheduled Post",
      "Auto Generated",
      "Cron Task",
      "Timer Post",
      "Background Job",
      "Scheduled Entry",
      "Auto Insert",
      "Trigger Post"
    ];
    
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const timestamp = new Date().toISOString();
    const name = `${randomName} - ${timestamp}`;

    // Insert the scheduled post
    const newPost = await db
      .insert(posts)
      .values({ name })
      .returning();

    console.log("Scheduled post created:", newPost[0]);

    res.status(200).json({ 
      success: true, 
      message: "Scheduled task completed",
      post: newPost[0]
    });
  } catch (error) {
    console.error("Scheduled task error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Scheduled task failed" 
    });
  }
}
