import api from "@/lib/api";
import type { Workload } from "@/types";

export interface WorkloadResponse {
  data: Workload[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getMyWorkload = async (
  page = 1,
  limit = 100,
): Promise<WorkloadResponse> => {
  const response = await api.get("/workload", {
    params: { page, limit },
  });

  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};
