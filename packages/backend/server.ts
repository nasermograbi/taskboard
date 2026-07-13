import path from "path";
import { fileURLToPath } from "url";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import pool from "./db.js";
import tasksRouter from "./routes/tasks.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/db-test", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<{ current_database: string }>(
      "SELECT current_database();",
    );

    res.json({
      message: "Connected to Postgres",
      database: result.rows[0]?.current_database,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database query failed");
  }
});

app.get("/", (_req: Request, res: Response) => {
  res.send("hellooooo");
});

app.use("/api/tasks", tasksRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
