import api from "@/lib/api";

import type { Announcement } from "@/types";

export interface CreateAnnouncementData {
  title: string;
  content: string;
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
}

export interface ScheduleAnnouncementData {
  scheduledAt: string;
}

export interface AnnouncementPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface PaginatedAnnouncementsResponse {
  announcements: Announcement[];
  pagination: AnnouncementPagination;
}

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const response = await api.get("/announcements");

  return response.data.data;
};

export const getAdminAnnouncements = async (
  page = 1,
  limit = 10,
): Promise<PaginatedAnnouncementsResponse> => {
  const response = await api.get("/announcements/admin", {
    params: {
      page,
      limit,
    },
  });

  return {
    announcements: response.data.data,
    pagination: response.data.pagination,
  };
};

export const createAnnouncement = async (data: CreateAnnouncementData) => {
  const response = await api.post("/announcements", data);

  return response.data;
};

export const updateAnnouncement = async (
  id: string,
  data: UpdateAnnouncementData,
) => {
  const response = await api.put(`/announcements/${id}`, data);

  return response.data;
};

export const scheduleAnnouncement = async (
  id: string,
  data: ScheduleAnnouncementData,
) => {
  const response = await api.patch(`/announcements/${id}/schedule`, data);

  return response.data;
};

export const cancelScheduledAnnouncement = async (id: string) => {
  const response = await api.patch(`/announcements/${id}/cancel-schedule`);

  return response.data;
};

export const publishAnnouncement = async (id: string) => {
  const response = await api.patch(`/announcements/${id}/publish`);

  return response.data;
};

export const deleteAnnouncement = async (id: string) => {
  const response = await api.delete(`/announcements/${id}`);

  return response.data;
};