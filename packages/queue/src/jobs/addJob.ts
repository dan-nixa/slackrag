import { indexingQueue } from "../index";

/**
 * Example function to add a job to the indexing queue
 */
export async function queueIndexingForUser(email: string) {
  try {
    const job = await indexingQueue.add(
      "index-user-files",
      { email },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    console.log(`Queued indexing job ${job.id} for user: ${email}`);
    return job.id;
  } catch (error) {
    console.error("Failed to queue indexing job:", error);
    throw error;
  }
}
