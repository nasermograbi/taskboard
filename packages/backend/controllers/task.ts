import { TaskService } from "../services/task.js";
import { Request, Response } from "express";
import { TaskSchema } from "../schemas/task.js";

export const getTasks = async (req: Request, res: Response) => {
  const { page, limit, status } = TaskSchema.query.parse(req.query);

  const data = await TaskService.getAllTasks(page, limit, status);
  res.status(200).json({ data, error: null });
};

export const getTask = async (req: Request, res: Response) => {
  const { id } = TaskSchema.params.parse(req.params);
  const data = await TaskService.getTaskByID(id);

  res.status(200).json({ data, error: null });
};

export const createTask = async (req: Request, res: Response) => {
  const body = TaskSchema.create.parse(req.body);
  const data = await TaskService.createTask(body);

  res.status(201).json({ data, error: null });
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = TaskSchema.params.parse(req.params);
  const body = TaskSchema.update.parse(req.body);

  const data = await TaskService.updateTask(id, body);
  res.status(200).json({ data, error: null });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = TaskSchema.params.parse(req.params);
  await TaskService.deleteTask(id);

  res.status(204).send();
};
