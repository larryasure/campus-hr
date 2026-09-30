import api from "@/lib/api";
import type { User } from "@/types";

export const getMyProfile = async (): Promise<User> => {
  const response = await api.get("/lecturers/profile");

  return response.data.user;
};

export const updateMyProfile = async (
  data: Partial<User>
): Promise<User> => {
  const response = await api.put("/lecturers/profile", data);

  return response.data.user;
};