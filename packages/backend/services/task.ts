import { TaskModel } from "../models/task.js";
import { ValidationError, NotFoundError } from "../errors.js";
import { Prisma } from "../generated/prisma/client.js";
import { UpdateTaskInput, CreateTaskInput } from "../schemas/task.js";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  OPEN: ["DOING"],
  DOING: ["CLOSED"],
  CLOSED: [],
};

export const TaskService = {
  getAllTasks: async (page: number, limit: number, status?: string) => {
    const safeLimit = Math.min(limit, 100);

    const { tasks, totalCount } = await TaskModel.findAll(
      page,
      safeLimit,
      status,
    );
    return {
      tasks,
      totalCount,
      page,
      limit: safeLimit,
      totalPages: Math.ceil(totalCount / safeLimit),
    };
  },
  getTaskByID: async (id: number) => {
    const task = await TaskModel.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID ${id} not found.`);
    }
    return task;
  },
  createTask: async (data: CreateTaskInput) => {
    const status = "OPEN";

    return await TaskModel.create({
      ...data,
      status,
    });
  },
  updateTask: async (id: number, data: UpdateTaskInput) => {
    const task = await TaskModel.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID ${id} not found.`);
    }

    if (data.status !== undefined && task.status !== data.status) {
      if (!ALLOWED_TRANSITIONS[task.status]?.includes(data.status))
        throw new ValidationError("Cannot update status");

      if (data.status === "CLOSED") {
        const assignee = data.assignee ?? task.assignee;
        if (!assignee) throw new ValidationError("Missing assignee");
      }
    }

    return await TaskModel.update(id, data);
  },

  deleteTask: async (id: number) => {
    try {
      return await TaskModel.delete(id);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundError(`Task with ID ${id} not found.`);
      }
      throw e;
    }
  },
};
