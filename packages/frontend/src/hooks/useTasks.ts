import { useState, useEffect, useCallback, useMemo } from "react";
import {
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
  getTasks,
  updateTask as apiUpdateTask,
  type Task,
  type TaskStatus,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "../api/client";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const limit = 10;

  const [filterStatus, setFilterStatus] = useState<TaskStatus | "ALL">("ALL");

  const loadTasks = async (
    pageNumber: number = 1,
    isLoadMore: boolean = false,
  ) => {
    try {
      if (isLoadMore) setIsLoadingMore(true);
      else setIsLoading(true);

      const data = await getTasks(pageNumber, limit);
      if (isLoadMore) {
        setTasks((prev) => [...prev, ...data.tasks]);
      } else {
        setTasks(data.tasks);
      }
      setHasMore(pageNumber < data.totalPages);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load tasks";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadTasks(1, false);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadTasks(nextPage, true);
  };

  const createTask = async (taskPayload: CreateTaskInput) => {
    const tempId = Date.now();
    const optimisticTask: Task = {
      id: tempId,
      title: taskPayload.title,
      status: "OPEN",
      description: taskPayload.description ?? null,
      assignee: taskPayload.assignee ?? null,
      priority: taskPayload.priority ?? null,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const newTask = await apiCreateTask(taskPayload);
      setTasks((prev) => prev.map((t) => (t.id === tempId ? newTask : t)));
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      throw err;
    }
  };

  const updateTask = async (taskId: number, taskPayload: UpdateTaskInput) => {
    const previousTasks = [...tasks];
    const optimisticUpdatedTask: Task = {
      ...previousTasks.find((t) => t.id === taskId)!,
      ...taskPayload,
    };

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? optimisticUpdatedTask : t)),
    );

    try {
      const updatedTask = await apiUpdateTask(taskId, taskPayload);
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      );
    } catch (err) {
      setTasks(previousTasks);
      throw err;
    }
  };

  const deleteTask = useCallback(
    async (taskId: number) => {
      const previousTasks = [...tasks];
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      try {
        await apiDeleteTask(taskId);
      } catch (err) {
        setTasks(previousTasks);
        throw err;
      }
    },
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    if (filterStatus === "ALL") return tasks;
    return tasks.filter((t) => t.status === filterStatus);
  }, [tasks, filterStatus]);

  const taskCounts = useMemo(() => {
    const counts = { OPEN: 0, DOING: 0, CLOSED: 0 };
    tasks.forEach((t) => {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });
    return counts;
  }, [tasks]);

  return {
    tasks,
    filteredTasks,
    taskCounts,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    filterStatus,
    setFilterStatus,
    handleLoadMore,
    createTask,
    updateTask,
    deleteTask,
    setError,
  };
};
