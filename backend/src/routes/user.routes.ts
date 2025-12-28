import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { listUsersHandler, getUserHandler, createUserHandler } from "../controllers/user.controller.js";

const router = Router();

router.use(authenticate);
router.use(requireRole("ADMIN"));

router.post("/", createUserHandler);
router.get("/", listUsersHandler);
router.get("/:userId", getUserHandler);

export default router;

