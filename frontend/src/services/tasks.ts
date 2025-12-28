import { api } from "../lib/api";
import type { CaseTask } from "../types";

export interface ListTasksParams {
  caseId?: string;
  assignedToId?: string;
  status?: string;
  skip?: number;
  take?: number;
}

export interface TasksResponse {
  data: CaseTask[];
  pagination: {
    total: number;
    skip: number;
    take: number;
  };
}

export const tasksService = {
  list: async (params?: ListTasksParams): Promise<TasksResponse> => {
    const { data } = await api.get<TasksResponse>("/tasks", { params });
    return data;
  },

  get: async (id: string): Promise<CaseTask> => {
    const { data } = await api.get<CaseTask>(`/tasks/${id}`);
    return data;
  },

  create: async (taskData: Partial<CaseTask>): Promise<CaseTask> => {
    const { data } = await api.post<CaseTask>("/tasks", taskData);
    return data;
  },

  update: async (id: string, taskData: Partial<CaseTask>): Promise<CaseTask> => {
    const { data } = await api.put<CaseTask>(`/tasks/${id}`, taskData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

