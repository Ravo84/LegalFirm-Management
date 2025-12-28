import { api } from "../lib/api";
import type { User } from "../types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "ADMIN" | "EMPLOYEE";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error: any) {
      // Provide more detailed error message
      if (error.code === "ECONNREFUSED" || error.message?.includes("Network")) {
        throw new Error("Cannot connect to server. Make sure backend is running on http://localhost:4000");
      }
      throw error;
    }
  },

  register: async (registerData: RegisterData): Promise<User> => {
    const { data } = await api.post<User>("/auth/register", registerData);
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },
};

