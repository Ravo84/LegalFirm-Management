export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "EMPLOYEE";
  fullName: string;
  isActive?: boolean;      // added
  createdAt?: string;      // added
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description?: string;
  clientName: string;
  status: CaseStatus;
  priority: TaskPriority;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  managerId?: string;
  manager?: User;
  assignments?: CaseAssignment[];
  documents?: Document[];
  tasks?: CaseTask[];
}

export interface CaseAssignment {
  id: string;
  caseId: string;
  userId: string;
  user: User;
  createdAt: string;
}

export interface CaseTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  caseId: string;
  assignedToId?: string;
  assignedTo?: User;
  creatorId: string;
  createdBy: User;
}

export interface Document {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentType: DocumentType;
  description?: string;
  uploadedAt: string;
  updatedAt: string;
  caseId?: string;
  uploadedById: string;
  uploadedBy: User;
  case?: {               // added to fix Documents errors
    caseNumber: string;
    [key: string]: any;
  };
}

export type CaseStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "UNDER_REVIEW"
  | "PENDING_CLIENT"
  | "SETTLED"
  | "CLOSED"
  | "ARCHIVED";
export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type DocumentType = "PDF" | "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "OTHER";
