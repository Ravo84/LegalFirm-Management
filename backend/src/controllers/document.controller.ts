import type { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import {
  createDocument,
  listDocuments,
  getDocument,
  deleteDocument,
  getDocumentTypeFromMime,
} from "../services/document.service.js";
import { z } from "zod";
import path from "path";
import fs from "fs";
import { env } from "../config/env.js";

export const uploadDocumentHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { caseId, description } = z
      .object({
        caseId: z.string().optional(),
        description: z.string().optional(),
      })
      .parse(req.body);

    // Store relative path from upload directory
    const relativePath = path.relative(path.resolve(env.UPLOAD_DIR), req.file.path);
    
    const document = await createDocument({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: relativePath,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      documentType: getDocumentTypeFromMime(req.file.mimetype),
      description,
      caseId: caseId || undefined,
      uploadedById: req.user!.userId,
    });

    res.status(201).json(document);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to upload document" });
  }
};

export const listDocumentsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const documents = await listDocuments({
      caseId: req.query.caseId as string,
      uploadedById: req.user?.role === "EMPLOYEE" ? req.user.userId : (req.query.uploadedById as string),
      documentType: req.query.documentType as any,
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    });
    res.json(documents);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to list documents" });
  }
};

export const getDocumentHandler = async (req: AuthRequest, res: Response) => {
  try {
    const document = await getDocument(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(document);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to get document" });
  }
};

export const downloadDocumentHandler = async (req: AuthRequest, res: Response) => {
  try {
    const document = await getDocument(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = path.resolve(env.UPLOAD_DIR, document.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.setHeader("Content-Type", document.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${document.originalName}"`);
    res.sendFile(filePath);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to download document" });
  }
};

export const deleteDocumentHandler = async (req: AuthRequest, res: Response) => {
  try {
    await deleteDocument(req.params.documentId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to delete document" });
  }
};

