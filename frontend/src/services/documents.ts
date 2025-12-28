import { api } from "../lib/api";
import type { Document } from "../types";

export interface ListDocumentsParams {
  caseId?: string;
  uploadedById?: string;
  documentType?: string;
  skip?: number;
  take?: number;
}

export interface DocumentsResponse {
  data: Document[];
  pagination: {
    total: number;
    skip: number;
    take: number;
  };
}

export const documentsService = {
  list: async (params?: ListDocumentsParams): Promise<DocumentsResponse> => {
    const { data } = await api.get<DocumentsResponse>("/documents", { params });
    return data;
  },

  get: async (id: string): Promise<Document> => {
    const { data } = await api.get<Document>(`/documents/${id}`);
    return data;
  },

  upload: async (file: File, caseId?: string, description?: string): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    if (caseId) formData.append("caseId", caseId);
    if (description) formData.append("description", description);

    const { data } = await api.post<Document>("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  download: async (id: string): Promise<Blob> => {
    const { data } = await api.get<Blob>(`/documents/${id}/download`, {
      responseType: "blob",
    });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },
};

