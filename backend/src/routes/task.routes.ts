import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  createTaskHandler,
  listTasksHandler,
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "../controllers/task.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", createTaskHandler);
router.get("/", listTasksHandler);
router.get("/:taskId", getTaskHandler);
router.put("/:taskId", updateTaskHandler);
router.delete("/:taskId", deleteTaskHandler);

export default router;

