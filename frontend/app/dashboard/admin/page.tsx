"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { getMyProfile } from "@/lib/lecturer";
import { getAllAdminRequests, getAllLecturers } from "@/lib/admin";

import type { HRRequest, User } from "@/types";

import AdminHeader from "./components/AdminHeader";
import AdminStats from "./components/AdminStats";
import RecentRequests from "./components/RecentRequests";
import LecturerOverview from "./components/LecturerOverview";

export default function AdminDashboardPage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [lecturers, setLecturers] = useState<User[]>([]);
  const [requests, setRequests] = useState<HRRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAdminDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, lecturersResponse, requestsResponse] =
          await Promise.all([
            getMyProfile(),
            getAllLecturers(),
            getAllAdminRequests(),
          ]);

        setProfile(profileResponse);
        setLecturers(lecturersResponse.data);
        setRequests(requestsResponse.data);
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);

        setError(
          "We couldn't load the HR dashboard. Please refresh and try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAdminDashboard();
  }, []);

  const activeLecturers = lecturers.filter(
    (lecturer) => lecturer.employmentStatus === "ACTIVE",
  ).length;

  const pendingRequests = requests.filter(
    (request) =>
      request.status === "PENDING" || request.status === "UNDER_REVIEW",
  ).length;

  const departments = new Set(
    lecturers.map((lecturer) => lecturer.department).filter(Boolean),
  ).size;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          Loading HR dashboard...
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
              Unable to load HR dashboard
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700">
              {error || "Your administrator profile could not be loaded."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <AdminHeader adminName={profile.fullName} />

      <AdminStats
        totalLecturers={lecturers.length}
        activeLecturers={activeLecturers}
        pendingRequests={pendingRequests}
        departments={departments}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <RecentRequests requests={requests} />

        <LecturerOverview lecturers={lecturers} />
      </div>
    </div>
  );
}
