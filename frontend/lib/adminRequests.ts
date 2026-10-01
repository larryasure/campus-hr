import api from "@/lib/api";

import type {
  HRRequest,
} from "@/types";

export interface AdminRequestResponse {
  success: boolean;
  data: HRRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminRequestFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}

export interface UpdateAdminRequestData {
  status?: HRRequest["status"];
  adminComment?: string;
}

export const getAllAdminRequests =
  async (
    filters?: AdminRequestFilters,
  ): Promise<AdminRequestResponse> => {
    const response =
      await api.get<AdminRequestResponse>(
        "/admin/requests",
        {
          params: filters,
        },
      );

    return response.data;
  };

export const updateAdminRequest =
  async (
    id: string,
    data: UpdateAdminRequestData,
  ) => {
    const response =
      await api.patch(
        `/admin/requests/${id}`,
        data,
      );

    return response.data;
  };

export const deleteAdminRequest =
  async (id: string) => {
    const response =
      await api.delete(
        `/admin/requests/${id}`,
      );

    return response.data;
  };