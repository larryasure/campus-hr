import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_DEV_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const storedAuth = localStorage.getItem("campushr-auth");

    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        const token = parsed?.state?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {

      }
    }
  }

  return config;
});

export default api;