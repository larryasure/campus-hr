export type UserRole = "LECTURER" | "HR_ADMIN";

export type EmploymentStatus =
  | "ACTIVE"
  | "ON_LEAVE"
  | "SABBATICAL"
  | "INACTIVE";

export type HRRequestType =
  | "LEAVE"
  | "LETTER_OF_INTRODUCTION"
  | "EMPLOYMENT_REFERENCE"
  | "SABBATICAL"
  | "OTHER";

export type HRRequestStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type AnnouncementStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED";

export interface User {
  id: string;
  staffId: string;
  fullName: string;
  email: string;
  phone?: string;
  faculty?: string;
  department?: string;
  academicRank?: string;
  dateOfEmployment?: string;
  employmentStatus?: EmploymentStatus;
  profilePhoto?: string;
  role: UserRole;
}

export interface AcademicQualification {
  _id?: string;
  degree: string;
  institution: string;
  year: number;
}
export interface AcademicRecord {
  _id: string;
  user: string;
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

export interface Workload {
  _id: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  semester: string;
  academicSession: string;
  weeklyTeachingHours: number;
}

export interface HRRequest {
  _id: string;
  user: string | User;
  type: HRRequestType;
  subject: string;
  description: string;
  status: HRRequestStatus;
  adminComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  scheduledAt?: string;
  publishedAt?: string;
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
