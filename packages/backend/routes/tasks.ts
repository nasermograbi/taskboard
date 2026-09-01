import { Router } from "express";
import {
  createTask,
  getTask,
  getTasks,
  deleteTask,
  updateTask,
} from "../controllers/task.js";

const router = Router();

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
