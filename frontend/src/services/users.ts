import { api } from "../lib/api";
import type { User } from "../types";

export interface ListUsersParams {
  skip?: number;
  take?: number;
  role?: string;
}

export interface UsersResponse {
  data: User[];
  pagination: {
    total: number;
    skip: number;
    take: number;
  };
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "EMPLOYEE";
}

export const usersService = {
  list: async (params?: ListUsersParams): Promise<UsersResponse> => {
    const { data } = await api.get<UsersResponse>("/users", { params });
    return data;
  },

  get: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  create: async (userData: CreateUserData): Promise<User> => {
    const { data } = await api.post<User>("/users", userData);
    return data;
  },
};

