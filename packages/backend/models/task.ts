import pool from "../db.js";
import type { Task } from "@taskboard/shared";

export type { Task };

export const getTasks = async (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;
  const result = await pool.query<Task>(
    "SELECT * FROM tasks ORDER BY id DESC LIMIT $1 OFFSET $2;",
    [limit, offset]
  );
  const countResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*) FROM tasks;"
  );
  
  const totalCount = parseInt(countResult.rows[0].count, 10);
  
  return {
    items: result.rows,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

export const getTaskById = async (id: number) => {
  const result = await pool.query<Task>(
    "SELECT * FROM tasks WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

export const createTask = async (
  title: string,
  status: string,
  description: string | null,
  assignee: string | null,
  priority: number | null
) => {
  const queryText = `
    INSERT INTO tasks (title, status, description, assignee, priority)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const result = await pool.query<Task>(queryText, [title, status, description, assignee, priority]);
  return result.rows[0];
};

export const updateTask = async (
  id: number,
  title: string,
  status: string,
  description: string | null,
  assignee: string | null,
  priority: number | null
) => {
  const queryText = `
    UPDATE tasks
    SET title = $2, status = $3, description = $4, assignee = $5, priority = $6
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query<Task>(queryText, [
    id,
    title,
    status,
    description,
    assignee,
    priority,
  ]);
  return result.rows[0] || null;
};

export const deleteTask = async (id: number) => {
  const result = await pool.query<Task>(
    "DELETE FROM tasks WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0] || null;
};
