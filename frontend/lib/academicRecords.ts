import api from "@/lib/api";
import type { AcademicRecord } from "@/types";

export interface AcademicRecordsResponse {
  data: AcademicRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AcademicRecordData {
  degree: string;
  institution: string;
  year: number;
  academicRank?: string;
  promotionHistory?: string[];
  researchInterests?: string[];
  publications?: string[];
  certifications?: string[];
  affiliations?: string[];
}

export const getAcademicRecords = async (
  page = 1,
  limit = 100
): Promise<AcademicRecordsResponse> => {
  const response = await api.get("/academic-records", {
    params: { page, limit },
  });

  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

export const createAcademicRecord = async (
  data: AcademicRecordData
): Promise<AcademicRecord> => {
  const response = await api.post("/academic-records", data);

  return response.data.data;
};

export const updateAcademicRecord = async (
  id: string,
  data: Partial<AcademicRecordData>
): Promise<AcademicRecord> => {
  const response = await api.put(`/academic-records/${id}`, data);

  return response.data.data;
};

export const deleteAcademicRecord = async (
  id: string
): Promise<void> => {
  await api.delete(`/academic-records/${id}`);
};