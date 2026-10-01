import api from "@/lib/api";
import type { Workload } from "@/types";

export interface AdminWorkloadLecturer {
  _id: string;
  staffId: string;
  fullName: string;
  email: string;
  faculty?: string;
  department?: string;
  academicRank?: string;
}

export interface AdminWorkload extends Omit<Workload, "lecturer"> {
  lecturer: AdminWorkloadLecturer;
}

export interface AdminWorkloadResponse {
  success: boolean;
  data: AdminWorkload[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WorkloadFilters {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  semester?: string;
  academicSession?: string;
  lecturerId?: string;
}

export interface WorkloadFormData {
  lecturer: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  semester: "FIRST" | "SECOND";
  academicSession: string;
  weeklyTeachingHours: number;
}

export const getAllAdminWorkload = async (
  filters?: WorkloadFilters,
): Promise<AdminWorkloadResponse> => {
  const response = await api.get<AdminWorkloadResponse>("/admin/workload", {
    params: filters,
  });

  return response.data;
};

export const createAdminWorkload = async (data: WorkloadFormData) => {
  const response = await api.post("/admin/workload", data);

  return response.data;
};

export const updateAdminWorkload = async (
  id: string,
  data: Partial<WorkloadFormData>,
) => {
  const response = await api.put(`/admin/workload/${id}`, data);

  return response.data;
};

export const deleteAdminWorkload = async (id: string) => {
  const response = await api.delete(`/admin/workload/${id}`);

  return response.data;
};
