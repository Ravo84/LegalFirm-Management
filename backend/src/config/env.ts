import dotenv from "dotenv";

dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "file:./prisma/dev.db",
  JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production",
  PORT: Number(process.env.PORT) || 4000,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  UPLOAD_DIR: process.env.UPLOAD_DIR || "./uploads",
};

