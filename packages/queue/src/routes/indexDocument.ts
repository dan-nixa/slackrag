import express, { Request, Response, NextFunction, Router } from "express";
import { indexingQueue, queueIndexingForUser } from "src";

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const router: Router = express.Router();

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { email } = req.body ?? {};

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Add job to the queue using async/await
      const jobId = await queueIndexingForUser(email);
      return res.status(200).json({
        success: true,
        message: "Document indexing job queued successfully",
        jobId,
      });
    } catch (error) {
      console.error("Error queuing indexing job:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to queue indexing job",
      });
    }
  })
);

export { router as indexDocumentRouter };
