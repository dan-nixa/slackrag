import { Worker } from "bullmq";
import { redisConnection } from "../redis";
import { getDriveClientForUser, listDriveFiles } from "@repo/google";

// import { getDriveClientForUser } from "@repo/google";
// import { listSlackragFiles } from "@repo/google";
// import { getEmbedding } from "@repo/openai";
// import { prisma } from "@repo/database";

export const indexingWorker = new Worker(
  "document-indexing",
  async (job) => {
    console.log(
      `Processing indexing job ${job.id} for user: ${job.data.email}`
    );

    try {
      const { email } = job.data;

      // Placeholder for actual implementation
      console.log(`Would process files for user: ${email}`);

      // const drive = await getDriveClientForUser(email);
      const files = await listDriveFiles(email, "slackrag");

      for (const file of files) {
        console.log(file.name);
      }

      // for (const file of files) {
      //   const text = await downloadAndExtractPlainText(drive, file.id); // you'll define this
      //   const embedding = await getEmbedding(text);
      //   await prisma.document.upsert({
      //     where: { id: file.id },
      //     update: {
      //       content: text,
      //       embedding,
      //       userEmail: email,
      //     },
      //     create: {
      //       id: file.id,
      //       content: text,
      //       embedding,
      //       userEmail: email,
      //     },
      //   });
      // }

      console.log(`Completed indexing job ${job.id}`);
      return { success: true, message: "Job completed successfully" };
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      throw error; // Re-throw so BullMQ marks the job as failed
    }
  },
  { connection: redisConnection }
);

console.log("Indexing worker initialized and ready to process jobs");
