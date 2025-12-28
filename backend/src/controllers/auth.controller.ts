import type { Request, Response } from "express";
import { loginUser, createUser } from "../services/auth.service.js";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["ADMIN", "EMPLOYEE"]).optional(),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(401).json({ message: error.message || "Invalid credentials" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await createUser(
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.role || "EMPLOYEE"
    );
    res.status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  }
};

