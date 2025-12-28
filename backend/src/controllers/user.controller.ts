import type { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { listUsers, getUserById, createUser } from "../services/user.service.js";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
});

export const listUsersHandler = async (req: AuthRequest, res: Response) => {
  try {
    const users = await listUsers({
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
      role: req.query.role as string,
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to list users" });
  }
};

export const getUserHandler = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to get user" });
  }
};

export const createUserHandler = async (req: AuthRequest, res: Response) => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await createUser(data);
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(400).json({ message: "Email already exists" });
    } else if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(400).json({ message: error.message || "Failed to create user" });
    }
  }
};

