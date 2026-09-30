import api from "@/lib/api";
import type { LoginResponse, User } from "@/types";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  staffId: string;
  fullName: string;
  email: string;
  password: string;
}

export const login = async (
  data: LoginData
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const register = async (
  data: RegisterData
): Promise<User> => {
  const response = await api.post("/auth/register", data);

  return response.data.user;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await api.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });
};

export const forgotPassword = async (
  email: string
): Promise<void> => {
  await api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  await api.post("/auth/reset-password", {
    token,
    newPassword,
  });
};