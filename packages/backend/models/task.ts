import prisma from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { UpdateTaskInput } from "../schemas/task.js";

export const TaskModel = {
  findAll: async (page: number, limit: number, status?: string) => {
    const [tasks, totalCount] = await prisma.$transaction([
      prisma.task.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status },
      }),
      prisma.task.count({ where: { status } }),
    ]);
    return { tasks, totalCount };
  },
  findById: async (id: number) => {
    return await prisma.task.findUnique({ where: { id } });
  },
  create: async (data: Prisma.TaskCreateInput) => {
    return await prisma.task.create({ data });
  },
  update: async (id: number, data: UpdateTaskInput) => {
    return await prisma.task.update({ where: { id }, data });
  },
  delete: async (id: number) => {
    return await prisma.task.delete({ where: { id } });
  },
};
