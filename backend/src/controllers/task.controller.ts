import type { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { createTask, listTasks, getTask, updateTask, deleteTask } from "../services/task.service.js";
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["TO_DO", "IN_PROGRESS", "DONE", "BLOCKED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  caseId: z.string(),
  assignedToId: z.string().optional(),
});

const updateTaskSchema = createTaskSchema.partial();

export const createTaskHandler = async (req: AuthRequest, res: Response) => {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await createTask({
      ...data,
      creatorId: req.user!.userId,
    });
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to create task" });
  }
};

export const listTasksHandler = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await listTasks({
      caseId: req.query.caseId as string,
      assignedToId: req.user?.role === "EMPLOYEE" ? req.user.userId : (req.query.assignedToId as string),
      status: req.query.status as any,
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to list tasks" });
  }
};

export const getTaskHandler = async (req: AuthRequest, res: Response) => {
  try {
    const task = await getTask(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to get task" });
  }
};

export const updateTaskHandler = async (req: AuthRequest, res: Response) => {
  try {
    const data = updateTaskSchema.parse(req.body);
    const task = await updateTask(req.params.taskId, data);
    res.json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to update task" });
  }
};

export const deleteTaskHandler = async (req: AuthRequest, res: Response) => {
  try {
    await deleteTask(req.params.taskId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to delete task" });
  }
};

