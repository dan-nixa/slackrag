import { Queue } from "bullmq";
import { redisConnection } from "./redis";
import { indexingWorker } from "./processors/indexProcessor";
// import { fileURLToPath } from "url";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

// Export the queue for other parts of the application to use
export const indexingQueue = new Queue("document-indexing", {
  connection: redisConnection,
});

// Export the function to add jobs to the queue
export { queueIndexingForUser } from "./jobs/addJob";

console.log(
  `Indexing queue initialized with Redis at ${redisConnection.host}:${redisConnection.port}`
);

// Check if this file is being run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  console.log("Starting queue worker service...");

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down workers...");
    await indexingWorker.close();
    await indexingQueue.close();
    console.log("Workers shut down successfully");
    process.exit(0);
  };

  // Listen for termination signals
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  console.log("Queue worker service started successfully");
}
