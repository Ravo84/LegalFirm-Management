import axios from "axios";

// ❌ No localhost fallback in production
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: `${API_URL}/api`, // ✅ VERY IMPORTANT
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
