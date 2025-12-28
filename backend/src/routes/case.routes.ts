import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  createCaseHandler,
  listCasesHandler,
  getCaseHandler,
  updateCaseHandler,
  deleteCaseHandler,
  assignCaseHandler,
  removeAssignmentHandler,
} from "../controllers/case.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", createCaseHandler);
router.get("/", listCasesHandler);
router.get("/:caseId", getCaseHandler);
router.put("/:caseId", updateCaseHandler);
router.delete("/:caseId", deleteCaseHandler);
router.post("/:caseId/assign", assignCaseHandler);
router.delete("/:caseId/assign/:userId", removeAssignmentHandler);

export default router;

