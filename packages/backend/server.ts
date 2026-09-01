import path from "path";
import { fileURLToPath } from "url";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import tasksRouter from "./routes/tasks.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("hellooooo");
});

app.use("/api/tasks", tasksRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
