import { prisma } from "../lib/prisma.js";
import fs from "fs";
import path from "path";
import { env } from "../config/env.js";

export interface CreateDocumentInput {
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentType: string;
  description?: string;
  caseId?: string;
  uploadedById: string;
}

export const createDocument = async (data: CreateDocumentInput) => {
  return prisma.document.create({
    data,
    include: {
      uploadedBy: true,
      case: true,
    },
  });
};

export const listDocuments = async (options: {
  caseId?: string;
  uploadedById?: string;
  documentType?: string;
  skip?: number;
  take?: number;
}) => {
  const where: any = {};

  if (options.caseId) {
    where.caseId = options.caseId;
  }

  if (options.uploadedById) {
    where.uploadedById = options.uploadedById;
  }

  if (options.documentType) {
    where.documentType = options.documentType;
  }

  const [data, total] = await Promise.all([
    prisma.document.findMany({
      where,
      skip: options.skip,
      take: options.take,
      include: {
        uploadedBy: true,
        case: true,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    }),
    prisma.document.count({ where }),
  ]);

  return {
    data,
    pagination: {
      total,
      skip: options.skip || 0,
      take: options.take || 10,
    },
  };
};

export const getDocument = async (id: string) => {
  return prisma.document.findUnique({
    where: { id },
    include: {
      uploadedBy: true,
      case: true,
    },
  });
};

export const deleteDocument = async (id: string) => {
  const document = await prisma.document.findUnique({
    where: { id },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  // Delete file from filesystem
  const filePath = path.resolve(env.UPLOAD_DIR, document.filePath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return prisma.document.delete({
    where: { id },
  });
};

export const getDocumentTypeFromMime = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) {
    return "IMAGE";
  }
  if (mimeType.startsWith("video/")) {
    return "VIDEO";
  }
  if (mimeType.startsWith("audio/")) {
    return "AUDIO";
  }
  if (mimeType === "application/pdf") {
    return "PDF";
  }
  if (
    mimeType.includes("word") ||
    mimeType.includes("excel") ||
    mimeType.includes("powerpoint") ||
    mimeType.includes("text")
  ) {
    return "DOCUMENT";
  }
  return "OTHER";
};

