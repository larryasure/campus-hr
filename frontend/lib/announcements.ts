import api from "@/lib/api";
import type { Announcement } from "@/types";

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const response = await api.get("/announcements");

  return response.data.data;
};