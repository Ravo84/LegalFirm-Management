import type { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import {
  createCase,
  listCases,
  getCase,
  updateCase,
  deleteCase,
  assignCaseToUser,
  removeCaseAssignment,
} from "../services/case.service.js";
import { z } from "zod";

const createCaseSchema = z.object({
  caseNumber: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  clientName: z.string().min(1),
  status: z.enum(["OPEN", "IN_PROGRESS", "UNDER_REVIEW", "PENDING_CLIENT", "SETTLED", "CLOSED", "ARCHIVED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  startDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  dueDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
});

const updateCaseSchema = createCaseSchema.partial();

export const createCaseHandler = async (req: AuthRequest, res: Response) => {
  try {
    const data = createCaseSchema.parse(req.body);
    const case_ = await createCase(data, req.user?.userId);
    res.status(201).json(case_);
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(400).json({ message: "Case number already exists" });
    } else {
      res.status(400).json({ message: error.message || "Failed to create case" });
    }
  }
};

export const listCasesHandler = async (req: AuthRequest, res: Response) => {
  try {
    const cases = await listCases({
      status: req.query.status as any,
      managerId: req.query.managerId as string,
      userId: req.user?.role === "EMPLOYEE" ? req.user.userId : (req.query.userId as string),
      search: req.query.search as string,
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    });
    res.json(cases);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to list cases" });
  }
};

export const getCaseHandler = async (req: AuthRequest, res: Response) => {
  try {
    const case_ = await getCase(req.params.caseId);
    if (!case_) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.json(case_);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to get case" });
  }
};

export const updateCaseHandler = async (req: AuthRequest, res: Response) => {
  try {
    const data = updateCaseSchema.parse(req.body);
    const case_ = await updateCase(req.params.caseId, data);
    res.json(case_);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to update case" });
  }
};

export const deleteCaseHandler = async (req: AuthRequest, res: Response) => {
  try {
    await deleteCase(req.params.caseId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to delete case" });
  }
};

export const assignCaseHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = z.object({ userId: z.string() }).parse(req.body);
    const assignment = await assignCaseToUser(req.params.caseId, userId);
    res.status(201).json(assignment);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to assign case" });
  }
};

export const removeAssignmentHandler = async (req: AuthRequest, res: Response) => {
  try {
    await removeCaseAssignment(req.params.caseId, req.params.userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to remove assignment" });
  }
};

