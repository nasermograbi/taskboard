const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

type ApiErrorDetails = {
  status: number;
  body: string;
};

const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const parseError = (status: number, body: string): ApiErrorDetails => ({
  status,
  body,
});

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
};

const jsonParse = <T>(text: string): T | null => {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(buildApiUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.text();
    const parsed = jsonParse<{ error?: string }>(body);
    const errorMsg = parsed?.error || body;

    const error = parseError(response.status, errorMsg);
    throw new Error(`API request failed (${error.status}): ${error.body}`);
  }

  const json = await parseJsonResponse<{ data: T; error: string | null }>(
    response,
  );

  if (json && json.error) {
    throw new Error(json.error);
  }

  return json && json.data !== undefined ? json.data : (json as unknown as T);
};

export const apiGet = async <T>(path: string): Promise<T> =>
  apiRequest<T>(path);

export const apiPost = async <T>(path: string, body: unknown): Promise<T> =>
  apiRequest<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiPut = async <T>(path: string, body: unknown): Promise<T> =>
  apiRequest<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const apiDelete = async (path: string): Promise<void> => {
  await apiRequest<unknown>(path, { method: "DELETE" });
};

import type {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
  UpdateTaskInput,
  PaginatedTasks,
} from "@taskboard/shared";

export type {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
  UpdateTaskInput,
  PaginatedTasks,
};

export const getTasks = (page: number = 1, limit: number = 10) =>
  apiGet<PaginatedTasks>(`/tasks?page=${page}&limit=${limit}`);
export const createTask = (payload: CreateTaskInput) =>
  apiPost<Task>("/tasks", payload);
export const updateTask = (taskId: number, payload: UpdateTaskInput) =>
  apiPut<Task>(`/tasks/${taskId}`, payload);
export const deleteTask = (taskId: number) => apiDelete(`/tasks/${taskId}`);
