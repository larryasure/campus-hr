import api from "@/lib/api";
import type { HRRequest, HRRequestStatus, HRRequestType } from "@/types";

export interface RequestsResponse {
  data: HRRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateRequestData {
  type: HRRequestType;
  subject: string;
  description: string;
}

export const getMyRequests = async (
  page = 1,
  limit = 100,
): Promise<RequestsResponse> => {
  const response = await api.get("/requests", {
    params: { page, limit },
  });

  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

export const getRequestById = async (id: string): Promise<HRRequest> => {
  const response = await api.get(`/requests/${id}`);

  return response.data.data;
};

export const createRequest = async (
  data: CreateRequestData,
): Promise<HRRequest> => {
  const response = await api.post("/requests", data);

  return response.data.data;
};

export type { HRRequestStatus };
