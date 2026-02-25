import { pool } from "../db/postgres";
import { randomUUID } from "crypto";
import { GetTasksFilters } from "../services/tasks.service";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: string;
}

export async function createTask(input: {
  title: string;
  description: string;
  userId: string;
}): Promise<Task> {
  const id = randomUUID();

  const result = await pool.query(
    `
    INSERT INTO tasks (id, title, description, completed, user_id)
    VALUES ($1, $2, $3, false, $4)
    RETURNING 
      id, 
      title, 
      description, 
      completed, 
      user_id AS "userId", 
      created_at AS "createdAt"
  `,
    [id, input.title, input.description, input.userId],
  );

  return result.rows[0];
}

export async function findTasksByUser(
  userId: string,
  query: GetTasksFilters,
): Promise<{ data: Task[]; total: number }> {
  const conditions: string[] = ["user_id = $1"];
  const values: any[] = [userId];

  if (query.completed !== undefined) {
    values.push(query.completed);
    conditions.push(`completed = $${values.length}`);
  }

  if (query.from) {
    values.push(query.from);
    conditions.push(`created_at >= $${values.length}`);
  }

  if (query.to) {
    values.push(query.to);
    conditions.push(`created_at <= $${values.length}`);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const page = query.page;
  const limit = query.limit;
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT 
      id, 
      title, 
      description, 
      completed, 
      user_id AS "userId", 
      created_at AS "createdAt"
    FROM tasks
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const dataResult = await pool.query(dataQuery, [...values, limit, offset]);

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM tasks
    ${whereClause}
  `;

  const countResult = await pool.query(countQuery, values);

  return {
    data: dataResult.rows,
    total: countResult.rows[0].total,
  };
}

export async function findTaskById(id: string): Promise<Task | null> {
  const result = await pool.query(
    `
    SELECT 
      id, 
      title, 
      description, 
      completed, 
      user_id AS "userId", 
      created_at AS "createdAt"
    FROM tasks
    WHERE id = $1
  `,
    [id],
  );

  return result.rows[0] || null;
}

export async function updateTask(
  id: string,
  input: Partial<{ title: string; description: string; completed: boolean }>,
): Promise<Task | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (input.title !== undefined) {
    fields.push(`title = $${idx++}`);
    values.push(input.title);
  }

  if (input.description !== undefined) {
    fields.push(`description = $${idx++}`);
    values.push(input.description);
  }

  if (input.completed !== undefined) {
    fields.push(`completed = $${idx++}`);
    values.push(input.completed);
  }

  const result = await pool.query(
    `
    UPDATE tasks
    SET ${fields.join(", ")}
    WHERE id = $${idx}
    RETURNING 
      id, 
      title, 
      description, 
      completed, 
      user_id AS "userId", 
      created_at AS "createdAt"
  `,
    [...values, id],
  );

  return result.rows[0] || null;
}

export async function deleteTask(id: string): Promise<void> {
  await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
}
