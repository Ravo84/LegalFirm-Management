import { api } from "../lib/api";
import type { Case } from "../types";

export interface ListCasesParams {
  status?: string;
  managerId?: string;
  userId?: string;
  search?: string;
  skip?: number;
  take?: number;
}

export interface CasesResponse {
  data: Case[];
  pagination: {
    total: number;
    skip: number;
    take: number;
  };
}

export const casesService = {
  list: async (params?: ListCasesParams): Promise<CasesResponse> => {
    const { data } = await api.get<CasesResponse>("/cases", { params });
    return data;
  },

  get: async (id: string): Promise<Case> => {
    const { data } = await api.get<Case>(`/cases/${id}`);
    return data;
  },

  create: async (caseData: Partial<Case>): Promise<Case> => {
    const { data } = await api.post<Case>("/cases", caseData);
    return data;
  },

  update: async (id: string, caseData: Partial<Case>): Promise<Case> => {
    const { data } = await api.put<Case>(`/cases/${id}`, caseData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/cases/${id}`);
  },

  assign: async (caseId: string, userId: string): Promise<void> => {
    await api.post(`/cases/${caseId}/assign`, { userId });
  },
};

