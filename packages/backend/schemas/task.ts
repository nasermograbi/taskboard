import { z } from "zod";

export const TaskSchema = {
  create: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(255, "Title is too long"),
    description: z.string().trim().nullish(),
    assignee: z.string().trim().nullish(),
    priority: z.number().int().min(1).max(3).nullish(),
  }),

  update: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(255, "Title is too long")
      .optional(),
    description: z.string().trim().nullish(),
    assignee: z.string().trim().nullish(),
    priority: z.number().int().min(1).max(3).nullish(),
    status: z.enum(["OPEN", "DOING", "CLOSED"]).optional(),
  }),

  params: z.object({
    id: z.coerce.number().int().positive("Invalid task id"),
  }),

  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(["OPEN", "DOING", "CLOSED"]).optional(),
  }),
};

export type CreateTaskInput = z.infer<typeof TaskSchema.create>;
export type UpdateTaskInput = z.infer<typeof TaskSchema.update>;
