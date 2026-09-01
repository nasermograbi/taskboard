import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      data: null,
      error: err.issues[0]?.message ?? "Invalid request",
    });
  }

  const status =
    err instanceof Error && "status" in err && typeof err.status === "number"
      ? err.status
      : 500;

  const message = err instanceof Error ? err.message : "Unknown error";

  if (status === 500) console.error(err);

  res.status(status).json({
    data: null,
    error: status === 500 ? "Internal server error" : message,
  });
};
