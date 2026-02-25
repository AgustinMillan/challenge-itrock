import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import tasksRoutes from "./routes/tasks.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { pool } from "./db/postgres";

dotenv.config();

export const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", tasksRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/db-health", async (_req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({ dbTime: result.rows[0] });
});

app.use(errorMiddleware);
