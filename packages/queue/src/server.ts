import express, { NextFunction, Request, Response, Express } from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { indexingQueue } from "./index";
import { indexDocumentRouter } from "./routes/indexDocument";

// Initialize Express app
const app: Express = express();
const port = process.env.BULL_BOARD_PORT || 3002;

// Parse JSON request bodies
app.use(express.json());

// Set up BullBoard
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(indexingQueue)],
  serverAdapter,
});

// Use BullBoard middleware
serverAdapter.setBasePath("/admin/queues");
app.use("/admin/queues", serverAdapter.getRouter());

app.use("/api/index-documents", indexDocumentRouter);

app.get("/", (req, res) => {
  res.send("Server is up!");
});

// Start the server
app.listen(port, () => {
  console.log(`BullBoard is running on port ${port}`);
  console.log(`Dashboard available at http://localhost:${port}/admin/queues`);
});

// Export for programmatic usage
export { app };
