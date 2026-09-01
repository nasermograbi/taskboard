export type TaskStatus = "OPEN" | "DOING" | "CLOSED";
export type TaskPriority = 1 | 2 | 3;

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  description: string | null;
  assignee: string | null;
  priority: TaskPriority | null;
  createdAt: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  assignee?: string | null;
  priority?: TaskPriority | null;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  assignee?: string | null;
  priority?: TaskPriority | null;
  status?: TaskStatus;
};

export type PaginatedTasks = {
  tasks: Task[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
};
