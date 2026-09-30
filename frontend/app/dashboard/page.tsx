"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { getCurrentAcademicSession } from "@/lib/academicSession";
import { getMyProfile } from "@/lib/lecturer";
import { getMyWorkload } from "@/lib/workload";
import { getMyRequests } from "@/lib/requests";
import { getAnnouncements } from "@/lib/announcements";

import type { User, Workload, HRRequest, Announcement } from "@/types";

import DashboardHeader from "./components/DashboardHeader";
import DashboardStats from "./components/DashboardStats";
import WorkloadOverview from "./components/WorkloadOverview";
import RequestOverview from "./components/RequestOverview";
import ProfileSummary from "./components/ProfileSummary";
import AnnouncementOverview from "./components/AnnouncementOverview";

export default function DashboardPage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [workload, setWorkload] = useState<Workload[]>([]);
  const [requests, setRequests] = useState<HRRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [academicSession, setAcademicSession] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          profileData,
          workloadResponse,
          requestsResponse,
          announcementsData,
          sessionData,
        ] = await Promise.all([
          getMyProfile(),
          getMyWorkload(),
          getMyRequests(),
          getAnnouncements(),
          getCurrentAcademicSession(),
        ]);

        setProfile(profileData);
        setWorkload(workloadResponse.data);
        setRequests(requestsResponse.data);
        setAnnouncements(announcementsData);
        setAcademicSession(sessionData?.name || "");
      } catch (err) {
        console.error("Failed to load dashboard:", err);

        setError(
          "We couldn't load your dashboard. Please refresh and try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalTeachingHours = workload.reduce(
    (total, course) => total + course.weeklyTeachingHours,
    0,
  );

  const pendingRequests = requests.filter(
    (request) =>
      request.status === "PENDING" || request.status === "UNDER_REVIEW",
  ).length;

  const approvedRequests = requests.filter(
    (request) => request.status === "APPROVED",
  ).length;

  const yearsOfService = (() => {
    if (!profile?.dateOfEmployment) {
      return 0;
    }

    const employmentDate = new Date(profile.dateOfEmployment);

    if (Number.isNaN(employmentDate.getTime())) {
      return 0;
    }

    const today = new Date();

    let years = today.getFullYear() - employmentDate.getFullYear();

    const monthDifference = today.getMonth() - employmentDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < employmentDate.getDate())
    ) {
      years--;
    }

    return Math.max(years, 0);
  })();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex max-w-md items-start gap-3 border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <div>
            <p className="text-sm font-semibold text-red-800">
              Unable to load dashboard
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700">
              {error || "Your profile could not be loaded. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DashboardHeader
        fullName={profile.fullName}
        academicRank={profile.academicRank}
        department={profile.department}
        faculty={profile.faculty}
        academicSession={academicSession}
      />

      <DashboardStats
        totalCourses={workload.length}
        totalTeachingHours={totalTeachingHours}
        pendingRequests={pendingRequests}
        approvedRequests={approvedRequests}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
        <WorkloadOverview workload={workload} />

        <ProfileSummary profile={profile} yearsOfService={yearsOfService} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <RequestOverview requests={requests} />

        <AnnouncementOverview announcements={announcements} />
      </div>
    </div>
  );
}
