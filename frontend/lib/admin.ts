import api from "@/lib/api";

import type {
  User,
  HRRequest,
} from "@/types";

interface AdminLecturersResponse {
  success: boolean;
  data: User[];
}

interface AdminLecturerResponse {
  success: boolean;
  message: string;
  data: User;
}

interface AdminRequestsResponse {
  success: boolean;
  data: HRRequest[];
}

export interface CreateLecturerData {
  staffId: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  faculty?: string;
  department?: string;
  academicRank?: string;
  dateOfEmployment?: string;
  employmentStatus?: string;
  profilePhoto?: string;
}

export interface UpdateLecturerData {
  staffId?: string;
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  faculty?: string;
  department?: string;
  academicRank?: string;
  dateOfEmployment?: string;
  employmentStatus?: string;
  profilePhoto?: string;
}

export const getAllLecturers = async (
  params?: {
    search?: string;
    faculty?: string;
    department?: string;
    academicRank?: string;
  },
) => {
  const response =
    await api.get<AdminLecturersResponse>(
      "/admin/lecturers",
      {
        params,
      },
    );

  return response.data;
};

export const createLecturer = async (
  data: CreateLecturerData,
) => {
  const response =
    await api.post<AdminLecturerResponse>(
      "/admin/lecturers",
      data,
    );

  return response.data;
};

export const updateLecturer = async (
  id: string,
  data: UpdateLecturerData,
) => {
  const response =
    await api.put<AdminLecturerResponse>(
      `/admin/lecturers/${id}`,
      data,
    );

  return response.data;
};

export const deleteLecturer = async (
  id: string,
) => {
  const response = await api.delete<{
    success: boolean;
    message: string;
  }>(`/admin/lecturers/${id}`);

  return response.data;
};

export const getAllAdminRequests =
  async () => {
    const response =
      await api.get<AdminRequestsResponse>(
        "/admin/requests",
      );

    return response.data;
  };