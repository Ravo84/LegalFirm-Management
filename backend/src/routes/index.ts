import { Router } from "express";
import authRoutes from "./auth.routes.js";
import caseRoutes from "./case.routes.js";
import documentRoutes from "./document.routes.js";
import taskRoutes from "./task.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cases", caseRoutes);
router.use("/documents", documentRoutes);
router.use("/tasks", taskRoutes);
router.use("/users", userRoutes);

export default router;

