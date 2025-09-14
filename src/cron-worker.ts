/**
 * Cloudflare Workers Cron Trigger
 * This worker handles scheduled tasks and calls the main app's API
 */

export default {
  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext): Promise<void> {
    console.log("Cron trigger activated:", event.cron);
    
    try {
      // Call the main worker's scheduled API endpoint
      const mainWorkerUrl = env.MAIN_WORKER_URL || "https://cf-test.your-domain.workers.dev";
      const response = await fetch(`${mainWorkerUrl}/api/scheduled`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Cloudflare-Cron-Worker"
        },
        body: JSON.stringify({
          cron: event.cron,
          scheduledTime: event.scheduledTime,
          source: "cron-worker"
        })
      });

      if (!response.ok) {
        throw new Error(`Scheduled task failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Scheduled task completed successfully:", result);
    } catch (error) {
      console.error("Cron worker error:", error);
      // Don't throw - let the worker continue
    }
  }
};
