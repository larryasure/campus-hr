import api from "@/lib/api";

export interface AcademicSession {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getCurrentAcademicSession = async (): Promise<AcademicSession | null> => {
  const response = await api.get("/academic-sessions/current");

  return response.data.data;
};