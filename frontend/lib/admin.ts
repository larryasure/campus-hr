import api from "@/lib/api";
import type { User, HRRequest } from "@/types";

interface AdminLecturersResponse {
  success: boolean;
  data: User[];
}

interface AdminRequestsResponse {
  success: boolean;
  data: HRRequest[];
}

export const getAllLecturers = async (params?: {
  search?: string;
  faculty?: string;
  department?: string;
  academicRank?: string;
}) => {
  const response = await api.get<AdminLecturersResponse>(
    "/admin/lecturers",
    {
      params,
    },
  );

  return response.data;
};

export const getAllAdminRequests = async () => {
  const response = await api.get<AdminRequestsResponse>(
    "/admin/requests",
  );

  return response.data;
};