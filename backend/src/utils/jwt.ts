import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (userId: string, email: string, role: string) => {
  return jwt.sign({ sub: userId, email, role }, env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as { sub: string; email: string; role: string };
};

