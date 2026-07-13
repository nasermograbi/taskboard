import { Request, Response } from "express";
import * as taskModel from "../models/task.js";

type AppError = {
  message: string;
};

const priorities = { low: 1, mid: 2, high: 3 };
const statuses = { open: "OPEN", closed: "CLOSED", doing: "DOING" };

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as AppError).message);
  }
  return "Unknown error";
}

const createTask = async (req: Request, res: Response) => {
  const { title, description, assignee, priority } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ data: null, error: "Title is required" });
  }

  if (title.length > 255) {
    return res.status(400).json({ data: null, error: "Title is too long" });
  }

  const isValidPriority = Object.values(priorities).includes(priority);
  if (!isValidPriority && priority != null) {
    return res.status(400).json({ data: null, error: "Invalid priority" });
  }

  try {
    const newTask = await taskModel.createTask(
      title.trim(),
      statuses.open,
      description || null,
      assignee || null,
      priority || null
    );
    return res.status(201).json({ data: newTask, error: null });
  } catch (err: unknown) {
    console.error("Error in createTask controller:", getErrorMessage(err));
    return res.status(500).json({ data: null, error: "Internal server error" });
  }
};

const getTasks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    
    const data = await taskModel.getTasks(page, limit);
    return res.status(200).json({ data, error: null });
  } catch (err: unknown) {
    console.error("Error in getTasks controller:", getErrorMessage(err));
    return res.status(500).json({ data: null, error: "Internal server error" });
  }
};

const getTask = async (req: Request, res: Response) => {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ data: null, error: "Invalid task id" });
  }

  try {
    const task = await taskModel.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ data: null, error: "Task not found" });
    }

    return res.status(200).json({ data: task, error: null });
  } catch (err: unknown) {
    console.error("Error in getTaskById controller:", getErrorMessage(err));
    return res.status(500).json({ data: null, error: "Internal server error" });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ data: null, error: "Invalid task id" });
  }

  try {
    const task = await taskModel.deleteTask(taskId);

    if (!task) {
      return res.status(404).json({ data: null, error: "Task not found" });
    }

    return res.status(200).json({ data: task, error: null });
  } catch (err: unknown) {
    console.error("Error in deleteTask controller:", getErrorMessage(err));
    return res.status(500).json({ data: null, error: "Internal server error" });
  }
};

const updateTask = async (req: Request, res: Response) => {
  const taskId = Number(req.params.id);
  const { title, description, assignee, priority, status } = req.body;

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ data: null, error: "Invalid task id" });
  }

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ data: null, error: "Title is required" });
  }

  if (title.length > 255) {
    return res.status(400).json({ data: null, error: "Title is too long" });
  }

  const isValidPriority = Object.values(priorities).includes(priority);
  const isValidStatus = Object.values(statuses).includes(status);

  if (!isValidPriority && priority != null) {
    return res.status(400).json({ data: null, error: "Invalid priority" });
  }

  if (!isValidStatus) {
    return res.status(400).json({ data: null, error: "Invalid status" });
  }

  try {
    const task = await taskModel.updateTask(
      taskId,
      title.trim(),
      status,
      description || null,
      assignee || null,
      priority || null
    );

    if (!task) {
      return res.status(404).json({ data: null, error: "Task not found" });
    }

    return res.status(200).json({ data: task, error: null });
  } catch (err: unknown) {
    console.error("Error in updateTask controller:", getErrorMessage(err));
    return res.status(500).json({ data: null, error: "Internal server error" });
  }
};

export { createTask, getTasks, getTask, deleteTask, updateTask };
