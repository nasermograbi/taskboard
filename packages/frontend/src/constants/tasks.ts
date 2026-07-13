import { type TaskPriority, type TaskStatus } from "../api/client";

export const PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string }> = [
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
];

export const STATUS_OPTIONS: TaskStatus[] = ["OPEN", "DOING", "CLOSED"];

export const isTaskStatus = (status: unknown): status is TaskStatus => {
  return status === "OPEN" || status === "DOING" || status === "CLOSED";
};

export const sanitizeStatus = (status: unknown): TaskStatus => {
  return isTaskStatus(status) ? status : "OPEN";
};

export const sanitizeFilterStatus = (status: unknown): TaskStatus | "ALL" => {
  if (status === "ALL") return "ALL";
  return sanitizeStatus(status);
};

export const sanitizePriority = (priority: unknown): TaskPriority => {
  const num = Number(priority);
  if (num === 1 || num === 2 || num === 3) {
    return num;
  }
  return 2;
};
