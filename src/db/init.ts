import { pool } from "./postgres";

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT false,
      user_id TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  console.log("✅ DB initialized");
}
