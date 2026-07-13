export type TaskStatus = "OPEN" | "DOING" | "CLOSED";
export type TaskPriority = 1 | 2 | 3;

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  description: string | null;
  assignee: string | null;
  priority: TaskPriority | null;
  created_at: Date;
  updated_at: Date;
};

export type CreateTaskInput = {
  title: string;
  description: string | null;
  assignee: string | null;
  priority: TaskPriority;
};

export type UpdateTaskInput = {
  title: string;
  description: string | null;
  assignee: string | null;
  priority: TaskPriority;
  status: TaskStatus;
};

export type PaginatedTasks = {
  items: Task[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
};
